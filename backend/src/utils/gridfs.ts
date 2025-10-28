import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let bucket: GridFSBucket | null = null;

export function getGridFSBucket(): GridFSBucket {
  if (bucket) return bucket;

  const db = mongoose.connection.db!;
  if (!db) {
    throw new Error("MongoDB not connected");
  }

  bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "club_covers" });
  return bucket;
}
