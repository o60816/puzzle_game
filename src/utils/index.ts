import * as crypto from 'crypto';

export function encodeData(
  hashMethod: string,
  digest: crypto.BinaryToTextEncoding,
  data: string,
) {
  return crypto.createHash(hashMethod).update(data).digest(digest);
}

export function hash512Encode(
  digest: crypto.BinaryToTextEncoding,
  data: string,
) {
  return encodeData('sha512', digest, data);
}

export function hash512WithBase64Encode(data: string) {
  return encodeData('sha512', 'base64', data);
}

export const encodePassword = hash512WithBase64Encode;
