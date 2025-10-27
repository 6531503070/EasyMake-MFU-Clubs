import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserModel } from '../User.model';

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

test('creates a user with defaults', async () => {
  const user = await UserModel.create({ email: 'a@example.com', role: 'user' });
  expect(user._id).toBeDefined();
  expect(user.email).toBe('a@example.com');
  expect(user.is_active).toBe(true);
  expect(user.created_at).toBeInstanceOf(Date);
});

test('enforces unique email', async () => {
  await UserModel.create({ email: 'dup@example.com', role: 'user' });
  await expect(UserModel.create({ email: 'dup@example.com', role: 'user' })).rejects.toThrow();
});

test('rejects invalid role', async () => {
  // bypass TypeScript checks for invalid role
  // Mongoose should throw a validation error
  // @ts-ignore
  await expect(UserModel.create({ email: 'x@example.com', role: 'invalid' })).rejects.toThrow();
});
