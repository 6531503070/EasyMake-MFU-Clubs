import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ClubFollowerModel } from '../ClubFollower.model';

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

test('creates follower and enforces unique (club_id,user_id)', async () => {
  const f = await ClubFollowerModel.create({ club_id: 'c1', user_id: 'u1' });
  expect(f._id).toBeDefined();

  await expect(ClubFollowerModel.create({ club_id: 'c1', user_id: 'u1' })).rejects.toThrow();
});

test('rejects invalid role_at_club', async () => {
  // @ts-ignore
  await expect(ClubFollowerModel.create({ club_id: 'c', user_id: 'u', role_at_club: 'bad' })).rejects.toThrow();
});
