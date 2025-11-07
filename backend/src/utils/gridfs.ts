import mongoose from "mongoose";
import type { GridFSBucket, GridFSFile } from "mongodb";

let bucket: GridFSBucket | null = null;

export function getGridFsBucket(): GridFSBucket {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("MongoDB is not connected yet. Make sure mongoose.connect() is awaited before using GridFS.");
  }
  if (!bucket) {
    bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
  }
  return bucket;
}
