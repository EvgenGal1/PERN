import { RoleLevels } from './role.interface';

export interface AuthPayload {
  id: number; // обязат.число
  roles: RoleLevels[]; // обязат.масс.
}

export interface CustomAuthPayloadRequest extends Request {
  auth?: AuthPayload;
}
