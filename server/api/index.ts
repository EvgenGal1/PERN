// точка входа для Serverless FN (обёртка > Node.app.listen т.к. не раб.прямо в Vercel)

import app from '../src/index';

export default app;
