import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ClubPostModel } from '../ClubPost.model';

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

test('creates club post with defaults', async () => {
  const p = await ClubPostModel.create({ club_id: 'c1', author_user_id: 'u1', title: 'Hello' });
  expect(p._id).toBeDefined();
  expect(p.published).toBe(true);
});
