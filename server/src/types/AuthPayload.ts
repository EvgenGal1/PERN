export interface AuthPayload {
  id: number; // обязат.число
  role: string; // обязат.строка
}

export interface CustomAuthPayloadRequest extends Request {
  auth?: AuthPayload;
}
