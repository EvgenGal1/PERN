import 'express';
import { TokenDto } from './auth.interface';

declare module 'express' {
  export interface Request {
    auth?: TokenDto; // строго типизировано
  }
}
