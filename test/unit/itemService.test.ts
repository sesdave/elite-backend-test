import chai from 'chai';
import sinon from 'sinon';
import { addLot, getItemQuantity, sellItem } from '../../src/services/itemService';
import LockMock from '../integration/model/LotMock'; // Import your Lot model
import RedisMock from 'ioredis-mock';
import { clearTableData } from '../../src/cleanup';
import { clearAllCache } from '../../src/utils/cache';
import chaiAsPromised from 'chai-as-promised';
import LockService from '../../src/services/lockService';

chai.use(chaiAsPromised);

describe('Inventory Management Test Suite', function () {
  this.timeout(20000);
  let lockService: LockService;
  let redisMock: any;
  let lotFindOneStub: sinon.SinonStub;

  before(() => {
    clearTableData();
    clearAllCache();

    lockService = new LockService();

    redisMock = new RedisMock();
    // Mock Redis operations
    redisMock.get = async (key: string) => JSON.stringify(redisMock.data[key] || null);
    redisMock.setex = async (key: string, expiresInSeconds: number, value: string) => {
      redisMock.data[key] = value;
      setTimeout(() => {
        delete redisMock.data[key];
      }, expiresInSeconds * 1000);
    };

    // Mock database operations
    lotFindOneStub = sinon.stub(LockMock, 'findOne');
  });

  afterEach(() => {
    clearTableData();
    clearAllCache();
  });

  after(() => {
    redisMock.quit();
    sinon.restore();
  });

  it('should release a lock', async () => {
    // Arrange
    const lockKey = 'resource-key';
    const lockTimeout = 5000;

    // Stub Lot.findOne to return a value for testing
    lotFindOneStub.returns({
      get: (field: string) => {
        if (field === 'totalQuantity') {
          return 10; // Return a desired total quantity for testing
        } else if (field === 'expiry') {
          return new Date('2023-12-31').getTime(); // Return a future expiry date
        }
      },
    });

    // Act
    const lock = await lockService.acquireLock(lockKey, lockTimeout);
    const isReleased = await lockService.releaseLock(lockKey);

    // Assert
    chai.expect(isReleased).to.be.true;
  });

  it('should add a lot and retrieve its quantity from cache', async () => {
    // Arrange
    const expectedQuantity = 10;

    // Stub Lot.findOne to return a value for testing
    lotFindOneStub.returns({
      get: (field: string) => {
        if (field === 'totalQuantity') {
          return expectedQuantity; // Return the expected quantity for testing
        } else if (field === 'expiry') {
          return new Date('2023-12-31').getTime(); // Return a future expiry date
        }
      },
    });

    // Act
    await addLot('foo', expectedQuantity, 1699737600000);
    const cachedData = await getItemQuantity('foo');

    // Assert
    chai.expect(cachedData.quantity).to.equal(expectedQuantity);
  });

  it('should retrieve quantities from cache if available', async () => {
    // Arrange
    const expectedQuantity = 10;

    // Stub Lot.findOne to return a value for testing
    lotFindOneStub.returns({
      get: (field: string) => {
        if (field === 'totalQuantity') {
          return expectedQuantity; // Return the expected quantity for testing
        } else if (field === 'expiry') {
          return new Date('2023-12-31').getTime(); // Return a future expiry date
        }
      },
    });

    // Act
    await addLot('foo', expectedQuantity, 1699737600000);
    const cachedData = await getItemQuantity('foo');

    // Assert
    chai.expect(cachedData.quantity).to.equal(expectedQuantity);

    // Act again to retrieve from cache
    const cachedData2 = await getItemQuantity('foo');

    // Assert
    chai.expect(cachedData2.quantity).to.equal(expectedQuantity);
  });

  it('should add a new lot and update cache after expiration', async () => {
    // Arrange
    const initialQuantity = 10;
    const addedQuantity = 5;
    const expectedQuantity = 15;

    // Stub Lot.findOne to return a value for testing
    lotFindOneStub.returns({
      get: (field: string) => {
        if (field === 'totalQuantity') {
          return initialQuantity; // Return the initial quantity for testing
        } else if (field === 'expiry') {
          return new Date('2023-12-31').getTime(); // Return a future expiry date
        }
      },
    });

    // Act
    await addLot('foo', initialQuantity, 1699737600000);
    await new Promise((resolve) => setTimeout(resolve, 15000)); // Simulate t=t0+15000
    await addLot('foo', addedQuantity, 1699737600000);
    const cachedData = await getItemQuantity('foo');

    // Assert
    chai.expect(cachedData.quantity).to.equal(expectedQuantity);
  });

  it('should sell items and update cache after selling', async () => {
    // Arrange
    const initialQuantity = 15;
    const soldQuantity = 3;

    // Stub Lot.findOne to return a value for testing
    lotFindOneStub.returns({
      get: (field: string) => {
        if (field === 'totalQuantity') {
          return initialQuantity; // Return the initial quantity for testing
        } else if (field === 'expiry') {
          return new Date('2023-12-31').getTime(); // Return a future expiry date
        }
      },
    });

    // Act
    await addLot('foo', initialQuantity, 1699737600000);
    await sellItem('foo', soldQuantity);
    const cachedData = await getItemQuantity('foo');

    // Assert
    chai.expect(cachedData.quantity).to.equal(initialQuantity - soldQuantity);
  });

  it('should handle concurrent operation', async () => {
    // Arrange
    const lockKey = 'resource-key';
    const lockTimeout = 5000;
  
    // Stub Lot.findOne to return a value for testing
    lotFindOneStub.returns({
      get: (field: string) => {
        if (field === 'totalQuantity') {
          return 10; // Return a desired total quantity for testing
        } else if (field === 'expiry') {
          return new Date('2023-12-31').getTime(); // Return a future expiry date
        }
      },
    });
  
    // Act
    const lock1 = await lockService.acquireLock(lockKey, lockTimeout);
    const lock2 = await lockService.acquireLock(lockKey, lockTimeout);
  
    // Assert
    chai.expect(lock1).to.not.be.null;
    chai.expect(lock2).to.be.null; // Lock should not be acquired concurrently
  });
  
  it('throw exception if sell is still on', async () => {
    // Arrange
    const expectedQuantity = 10;
  
    // Stub Lot.findOne to return a value for testing
    lotFindOneStub.returns({
      get: (field: string) => {
        if (field === 'totalQuantity') {
          return expectedQuantity; // Return the expected quantity for testing
        } else if (field === 'expiry') {
          return new Date('2023-12-31').getTime(); // Return a future expiry date
        }
      },
    });
  
    // Act
    await addLot('foo', expectedQuantity, 1699737600000);
  
    // Concurrent operations to update the quantity
    const promises = [
      async () => {
        await chai.expect(sellItem('foo', 3)).to.be.rejectedWith("Unable to Sell: foo. Please try again!!");
        await new Promise((resolve) => setTimeout(resolve, 6000)); // Delay for 6 seconds
      },
      async () => {
        await chai.expect(sellItem('foo', 2)).to.be.rejectedWith("Unable to Sell: foo. Please try again!!");
        await new Promise((resolve) => setTimeout(resolve, 6000)); // Delay for 6 seconds
      },
      async () => {
        await chai.expect(sellItem('foo', 4)).to.be.rejectedWith("Unable to Sell: foo. Please try again!!");
        await new Promise((resolve) => setTimeout(resolve, 6000)); // Delay for 6 seconds
      },
    ];
  
    // Use .to.be.rejectedWith to assert that an exception is thrown during sellItem
    await Promise.all(promises);
  });
  
  
  it('should handle multiple operations and cache updates', async () => {
    // Arrange
    const expectedQuantity = 10;
  
    // Stub Lot.findOne to return a value for testing
    lotFindOneStub.returns({
      get: (field: string) => {
        if (field === 'totalQuantity') {
          return expectedQuantity; // Return the expected quantity for testing
        } else if (field === 'expiry') {
          return new Date('2023-12-31').getTime(); // Return a future expiry date
        }
      },
    });
  
    // Act
    await addLot('poo', expectedQuantity, 1699737600000);
  
    // Concurrent operations to update the quantity sequentially with a 5-second delay
    const operations = [
      () => sellItem('poo', 3),
      () => new Promise(resolve => setTimeout(() => resolve(sellItem('poo', 2)), 1000)),
      () => new Promise(resolve => setTimeout(() => resolve(sellItem('poo', 4)), 6000)),
    ];
  
    for (const operation of operations) {
      await operation();
    }
  
    // Retrieve updated quantity from cache
    const cachedData = await getItemQuantity('poo');
  
    // Assert
    chai.expect(cachedData.quantity).to.equal(expectedQuantity - 3 - 2 - 4);
  });
  
  

  it('should handle selling more items than available', async () => {
    // Arrange
    const initialQuantity = 5;
    const soldQuantity = 10;

    // Stub Lot.findOne to return a value for testing
    lotFindOneStub.returns({
      get: (field: string) => {
        if (field === 'totalQuantity') {
          return initialQuantity; // Return the initial quantity for testing
        } else if (field === 'expiry') {
          return new Date('2023-12-31').getTime(); // Return a future expiry date
        }
      },
    });

    // Act and Assert
    await addLot('foo', initialQuantity, 1699737600000);
    await chai.expect(sellItem('foo', soldQuantity)).to.be.rejectedWith('Insufficient quantity available');
  });
});
