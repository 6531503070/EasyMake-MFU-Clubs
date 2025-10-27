import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ActivityModel } from '../Activity.model';

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

test('creates an activity with defaults', async () => {
  const a = await ActivityModel.create({
    club_id: 'club1',
    title: 'Test',
    start_time: new Date(),
    capacity: 10,
  });
  expect(a._id).toBeDefined();
  expect(a.visibility).toBe('public');
  expect(a.status).toBe('published');
});

test('rejects invalid status', async () => {
  // @ts-ignore
  await expect(
    ActivityModel.create({
      club_id: 'c',
      title: 't',
      start_time: new Date(),
      capacity: 1,
      status: 'bad',
    })
  ).rejects.toThrow();
});
