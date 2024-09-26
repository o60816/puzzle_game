import * as jwt from 'jsonwebtoken';
import logger from './logger';

const { JWT_TOKEN_KEY, JWT_REFRESH_TOKEN_KEY } = process.env;

export function genJWT(data: object) {
  return {
    token: jwt.sign(data, JWT_TOKEN_KEY, { expiresIn: '1d' }),
    refresh_token: jwt.sign({}, JWT_REFRESH_TOKEN_KEY, {
      expiresIn: '30d',
    }),
  };
}

export function verifyToken(token: string) {
  let result = true;
  try {
    jwt.verify(token, JWT_TOKEN_KEY);
  } catch (err: any) {
    logger.error(err.message);
    result = false;
  }

  return result;
}
