import bcrypt from "bcrypt";

export async function hashPassword(raw: string) {
  const saltRounds = 10;
  return bcrypt.hash(raw, saltRounds);
}

export async function comparePassword(raw: string, hash: string) {
  return bcrypt.compare(raw, hash);
}
