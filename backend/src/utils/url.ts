import { Request } from "express";

export function makeFileUrl(req: Request, id: string) {
  const base = `${req.protocol}://${req.get("host")}`;
  return `${base}/api/files/${id}`;
}

export function toUrlIfId(req: Request, maybeIdOrUrl: string) {
  if (/^https?:\/\//i.test(maybeIdOrUrl)) return maybeIdOrUrl;
  if (/^[a-f0-9]{24}$/i.test(maybeIdOrUrl)) return makeFileUrl(req, maybeIdOrUrl);
  return maybeIdOrUrl;
}
