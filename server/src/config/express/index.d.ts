import 'express';
import { TokenDto } from '../../types/auth.interface';

export declare module 'express' {
  export interface Request {
    auth?: TokenDto; // строго типизировано
  }
}
