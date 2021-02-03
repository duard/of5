import * as jwt from 'jsonwebtoken';
export function prepareToken(payload: any, expiresIn: string | number = '3d'): string {
  const secret = process.env.TOKEN_SECRET;

  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, process.env.TOKEN_SECRET);
}

export function decoteToken(token: string) {
  return jwt.decode(token);
}
