import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ActivityRegistrationModel } from '../ActivityRegistration.model';

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

test('creates registration and enforces unique (activity_id,user_id)', async () => {
  const r = await ActivityRegistrationModel.create({ activity_id: 'a1', user_id: 'u1' });
  expect(r._id).toBeDefined();

  await expect(
    ActivityRegistrationModel.create({ activity_id: 'a1', user_id: 'u1' })
  ).rejects.toThrow();
});
