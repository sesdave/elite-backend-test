import { expect } from 'chai';
import sinon from 'sinon';
import { addLot, getItemQuantity, sellItem } from '../../src/services/itemService';
import LockMock from '../integration/model/LotMock'; // Import your Lot model
import RedisMock from 'ioredis-mock';

describe('Inventory Management Test', function () {
  this.timeout(30000); // Adjust the timeout as needed
  let redisMock: any;

  before(() => {
    redisMock = new RedisMock();
    // Mock Redis operations
    redisMock.get = async (key: string) => JSON.stringify(redisMock.data[key] || null);
    redisMock.setex = async (key: string, expiresInSeconds: number, value: string) => {
      redisMock.data[key] = value;
      setTimeout(() => {
        delete redisMock.data[key];
      }, expiresInSeconds * 1000);
    };
  });

  beforeEach(async () => {
    // Clear the cache and reset any mock data before each test
    await redisMock.flushall(); // Clear the mock cache
    sinon.restore(); // Restore the stubs
  });

  it('should add lots, sell items, and retrieve quantities as expected', async () => {
    const t0 = Date.now();

    // Mock database operations
    const lotFindOneStub = sinon.stub(LockMock, 'findOne');
    lotFindOneStub.resolves({ get: () => ({ totalQuantity: 15 }) });

    // Step 1
    await addLot('foo', 10, t0 + 10000);

    // Step 2
    const t2 = t0 + 5000; // Time t=t0+5000
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const cachedData2 = await getItemQuantity('foo');
    expect(cachedData2.quantity).to.equal('10');

    // Step 3
    const t3 = t0 + 7000; // Time t=t0+7000
    await new Promise((resolve) => setTimeout(resolve, 7000));
    await addLot('foo', 5, t0 + 20000);

    // Step 4
    const t4 = t0 + 8000; // Time t=t0+8000
    await new Promise((resolve) => setTimeout(resolve, 8000));
    const cachedData4 = await getItemQuantity('foo');
    expect(cachedData4.quantity).to.equal('15');

    // Step 5
    const t5 = t0 + 10000; // Time t=t0+10000
    await new Promise((resolve) => setTimeout(resolve, 10000));
    const cachedData5 = await getItemQuantity('foo');
    expect(cachedData5.quantity).to.equal('5');

    // Step 6
    const t6 = t0 + 12000; // Time t=t0+12000
    await new Promise((resolve) => setTimeout(resolve, 12000));
    await sellItem('foo', 3);

    // Step 7
    const t7 = t0 + 13000; // Time t=t0+13000
    await new Promise((resolve) => setTimeout(resolve, 13000));
    const cachedData7 = await getItemQuantity('foo');
    expect(cachedData7.quantity).to.equal('2');

    // Step 8
    const t8 = t0 + 20000; // Time t=t0+20000
    await new Promise((resolve) => setTimeout(resolve, 20000));
    const cachedData8 = await getItemQuantity('foo');
    expect(cachedData8.quantity).to.equal(0);
    expect(cachedData8.validTill).to.be.null;
  });

  after(() => {
    redisMock.quit();
  });
});
