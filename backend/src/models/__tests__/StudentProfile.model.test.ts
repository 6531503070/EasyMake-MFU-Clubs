import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { StudentProfileModel } from '../StudentProfile.model';

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

test('creates student profile and enforces unique user_id', async () => {
  const s = await StudentProfileModel.create({ user_id: 'u1', major: 'CS' });
  expect(s._id).toBeDefined();

  await expect(StudentProfileModel.create({ user_id: 'u1' })).rejects.toThrow();
});
