import { ObjectId } from "mongodb";
import { Readable } from "stream";
import type { GridFSFile } from "mongodb";
import { getGridFsBucket } from "../utils/gridfs";

export async function saveBufferToGridFS(
  buffer: Buffer,
  opts: { filename?: string; contentType?: string; metadata?: Record<string, any> } = {}
): Promise<string> {
  const bucket = getGridFsBucket();
  const filename = opts.filename || `file-${Date.now()}`;
  const uploadStream = bucket.openUploadStream(filename, {
    contentType: opts.contentType,
    metadata: opts.metadata,
  });

  await new Promise<void>((resolve, reject) => {
    Readable.from(buffer).pipe(uploadStream)
      .on("error", reject)
      .on("finish", () => resolve());
  });

  return uploadStream.id.toString();
}

export async function readFileInfo(id: string): Promise<GridFSFile | null> {
  const bucket = getGridFsBucket();
  const _id = new ObjectId(id);
  const cursor = bucket.find({ _id });
  const file = await cursor.next();
  return (file as GridFSFile) || null;
}

export function openDownloadStreamById(id: string) {
  const bucket = getGridFsBucket();
  const _id = new ObjectId(id);
  return bucket.openDownloadStream(_id);
}

export async function deleteById(id: string) {
  const bucket = getGridFsBucket();
  const _id = new ObjectId(id);
  await bucket.delete(_id);
}

export const FileService = {
  saveBufferToGridFS,
  readFileInfo,
  openDownloadStreamById,
  deleteById,
};
