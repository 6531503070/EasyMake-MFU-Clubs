import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ClubModel } from '../Club.model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: 'test' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    // @ts-ignore
    await collections[key].deleteMany({});
  }
});

test('creates club and enforces unique name', async () => {
  const c = await ClubModel.create({ name: 'Chess', leader_user_id: 'u1' });
  expect(c._id).toBeDefined();
  expect(c.min_members).toBeDefined();

  await expect(ClubModel.create({ name: 'Chess', leader_user_id: 'u2' })).rejects.toThrow();
});
