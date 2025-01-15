// парам.cookie.
// ^ domain - управ.поддомен.использования, path - маршр.действ., maxAge - вр.жизни, secure - только по HTTPS, httpOnly - измен.ток.ч/з SRV, signed - подписан

export const COOKIE_OPTIONS = {
  refreshToken: {
    maxAge: +process.env.REFRESH_TOKEN_LIFETIME!,
    httpOnly: true,
    signed: true,
  },
  basketId: {
    maxAge: +process.env.BASKET_LIFETIME!,
    httpOnly: true,
    signed: true,
  },
};
