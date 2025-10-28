import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ReportModel } from '../Report.model';

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

test('creates report and validates target_type enum', async () => {
  const r = await ReportModel.create({ reporter_user_id: 'u1', target_type: 'post', message: 'spam' });
  expect(r._id).toBeDefined();

  // @ts-ignore
  await expect(ReportModel.create({ reporter_user_id: 'u2', target_type: 'bad', message: 'x' })).rejects.toThrow();
});
