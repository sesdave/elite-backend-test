import chai from 'chai';
import sinon from 'sinon';
import { addLot, getItemQuantity, sellItem } from '../../src/services/itemService';
import LockMock from '../integration/model/LotMock'; // Import your Lot model
import RedisMock from 'ioredis-mock';
import { clearTableData } from  '../../src/cleanup'; 
import { clearAllCache } from '../../src/utils/cache'
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('Inventory Management Test Suite', function() {
    this.timeout(20000)
  let redisMock: any;
  let lotFindOneStub: sinon.SinonStub;

  before(() => {
    clearTableData();
    clearAllCache();
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

  afterEach(() =>{
    clearTableData();
    clearAllCache();
  })

  after(() => {
    redisMock.quit();
    sinon.restore();
  });

  it('should add a lot and retrieve its quantity from cache', async () => {
    // Arrange
    const t0 = Date.now();
    const expectedQuantity = 10;
    const expectedValidTill = t0 + 10000;

    // Act
    await addLot('foo', expectedQuantity, 10000);
    const cachedData = await getItemQuantity('foo');
    console.log(`Returned cached ${JSON.stringify(cachedData)}`)

    // Assert
    chai.expect(cachedData.quantity).to.equal(10);
  });

  it('should retrieve quantities from cache if available', async () => {
    // Arrange
    // Act
    const result = await getItemQuantity('foo');

    // Assert
    chai.expect(result.quantity).to.equal(0);
  });

  it('should add a new lot and update cache after expiration', async () => {
    // Arrange
    const t0 = Date.now();
    const initialQuantity = 10;
    const expectedQuantity = 5;
    const expectedValidTill = t0 + 20000;

    // Act
    await addLot('foo', initialQuantity, 10000);
    await new Promise((resolve) => setTimeout(resolve, 15000)); // Simulate t=t0+5000
    await addLot('foo', expectedQuantity, 20000);
    const cachedData = await getItemQuantity('foo');

    // Assert
    chai.expect(cachedData.quantity).to.equal(5);
  });

  it('should sell items and update cache after selling', async () => {
    // Arrange
    const t0 = Date.now();
    const initialQuantity = 15;
    const soldQuantity = 3;
    const expectedQuantity = initialQuantity - soldQuantity;

    // Act
    await addLot('roo', initialQuantity, 10000);
    await sellItem('roo', soldQuantity);
    const cachedData = await getItemQuantity('roo');

    // Assert
    chai.expect(cachedData.quantity).to.equal(12);
   // expect(cachedData.validTill).to.be.within(expectedValidTill - 1000, expectedValidTill + 1000);
  });

  it('should handle concurrent operations', async () => {
    // Arrange
    const t0 = Date.now();
    const initialQuantity = 10;
    const soldQuantity = 4;
    const expectedQuantity = initialQuantity - soldQuantity;
    const expectedValidTill = t0 + 20000;
  
    // Act
    await addLot('con', 10, 10000);
    await new Promise((resolve) => setTimeout(resolve, 5000 )); // Simulate t=t0+5000
    await addLot('con', 5, 20000);
    await new Promise((resolve) => setTimeout(resolve, 7000 )); // Simulate t=t0+7000
    await sellItem('con', soldQuantity);
    const cachedData = await getItemQuantity('con');
  
    // Assert
    chai.expect(cachedData.quantity).to.equal(11);

  });
  

  it('should handle multiple operations and cache updates', async () => {
    // Arrange
    const initialQuantity = 10;
    const addedQuantity = 5;
    const soldQuantity = 3;


    // Act
    await addLot('moo', 1200, 10000);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate t=t0+5000
    await addLot('moo', 52, 20000);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate t=t0+7000
    await sellItem('moo', 20);
    const cachedData = await getItemQuantity('moo');

    // Assert
    chai.expect(cachedData.quantity).to.equal(1232);
  });

  it('should handle expiration of cache and database updates', async () => {
    // Arrange
    const t0 = Date.now();
    const initialQuantity = 10;
    const addedQuantity = 5;
    const expectedQuantity = initialQuantity + addedQuantity;

    // Act
    await addLot('foo', initialQuantity, 10000);
    await new Promise((resolve) => setTimeout(resolve,5000)); // Simulate t=t0+5000
    await addLot('foo', addedQuantity, 20000);
    await new Promise((resolve) => setTimeout(resolve, 11000)); // Simulate t=t0+15000
    const cachedData = await getItemQuantity('foo');

    // Assert
    chai.expect(cachedData.quantity).to.equal(expectedQuantity);
  });

  it('should handle selling more items than available', async() => {
    // Arrange
    const initialQuantity = 10;
    const soldQuantity = 15;
    const sellItemSpy = sinon.spy(sellItem);

    await addLot('foo', initialQuantity, 20000);
  
    await chai.expect(sellItemSpy('foo', soldQuantity)).to.be.rejectedWith('Insufficient quantity available');

    chai.expect(sellItemSpy.calledOnce).to.be.true;
  });
  

});

