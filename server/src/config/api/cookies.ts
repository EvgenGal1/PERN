// парам.cookie.
// ^ domain - управ.поддомен.использования, path - маршр.действ., maxAge - вр.жизни, secure - только по HTTPS, httpOnly - измен.ток.ч/з SRV, signed - подписан

export const COOKIE_OPTIONS = {
  refreshToken: {
    maxAge: 60 * 60 * 1000 * 24 * 30, // 1 месяц
    httpOnly: true,
    signed: true,
  },
  basketId: {
    maxAge: 60 * 60 * 1000 * 24 * 365, // 1 год
    httpOnly: true,
    signed: true,
  },
};
