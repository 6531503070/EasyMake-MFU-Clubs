import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { NotificationModel } from '../Notification.model';

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

test('creates notification with is_read default false', async () => {
  const n = await NotificationModel.create({ user_id: 'u1', type: 'new_post', title: 'Hi' });
  expect(n._id).toBeDefined();
  expect(n.is_read).toBe(false);
});
