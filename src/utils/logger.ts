import pino from 'pino';
import * as cls from 'cls-hooked';
import * as util from 'util';
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Request, Response } from 'express';
const DEBUG_LEVELS = ['error', 'warn', 'info', 'debug'] as const;
const CLS_NAMESPACE = cls.createNamespace(uuidv4());

const { LOG_LEVEL } = process.env;

type LogFn = (message: string) => void;

function debugLog(
  debugFunc: LogFn,
  ns: cls.Namespace<Record<string, any>>,
  msg: string,
  level = 2,
) {
  const e = new Error();
  const frame = e.stack.split('\n')[level];
  const lineNumber = frame?.split(':').reverse()[1];
  const functionName = frame?.split(' ')[5];
  debugFunc(
    `[${functionName}:${lineNumber}]:[${ns.get('requestId') ?? 'REQ_ID'}] ${util.inspect(msg, false, null, true)}`,
  );
}

abstract class BaseLogger {
  constructor(logger: T_DEBUG_LEVELS) {
    DEBUG_LEVELS.forEach((levels: string) => {
      this[levels] = debugLog.bind(
        debugLog,
        logger[levels].bind(logger),
        CLS_NAMESPACE,
      );
    });
  }

  expressMiddleware() {
    try {
      return (req: Request, res: Response, next: NextFunction) => {
        const requestId = uuidv4().substring(0, 4);

        CLS_NAMESPACE.run(() => {
          CLS_NAMESPACE.set('requestId', requestId);
          next();
        });
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}

type T_DEBUG_LEVELS = { [Property in (typeof DEBUG_LEVELS)[number]]: LogFn };

interface Type<T = any> {
  new (...args: any[]): T;
}

function ExtendType() {
  return BaseLogger as Type<BaseLogger & T_DEBUG_LEVELS>;
}

class Logger extends ExtendType() {}

const logger = new Logger(
  pino(
    {
      level: LOG_LEVEL,
    },
    process.stdout,
  ),
);
export default logger;
