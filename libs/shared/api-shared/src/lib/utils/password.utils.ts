import * as bcrypt from 'bcryptjs';
import * as cryptoRandomString from 'crypto-random-string';
import { Password } from '../classes/password';

export const generateRandonPassword = (password?: string): Password => {
  let plainText = cryptoRandomString({ length: 5, type: 'hex' });

  if (password) {
    plainText = password;
  }

  const hash = bcrypt.hashSync(plainText, 5);

  return { plainText, hash };
};

export const comparePasswordHash = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
