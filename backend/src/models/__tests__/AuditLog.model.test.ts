import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuditLogModel } from '../AuditLog.model';

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

test('creates audit log and validates target_type enum', async () => {
  const log = await AuditLogModel.create({ actor_user_id: 'u1', action: 'SUSPEND', target_type: 'club' });
  expect(log._id).toBeDefined();

  // @ts-ignore
  await expect(AuditLogModel.create({ actor_user_id: 'u2', action: 'X', target_type: 'invalid' })).rejects.toThrow();
});
