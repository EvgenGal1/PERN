// declare module "express-serve-static-core" {
//   interface Request {
//     auth?: DecodedToken;
//   }
// }

export interface DecodedToken {
  id?: string;
  role?: string;
}

export interface CustomRequest extends Request {
  auth?: DecodedToken;
}
