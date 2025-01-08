import 'express';
import { AuthPayload } from './AuthPayload';

declare module 'express' {
  export interface Request {
    auth?: AuthPayload; // строго типизировано
  }
}
