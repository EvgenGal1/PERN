import { MEGA_DEBUG } from "@/utils/constDebug";

/** console.log > отладки */
export const log = (...args: any[]) => {
  if (MEGA_DEBUG) {
    console.log(...args);
  }
};

/** console.error > ошибок */
export const logErr = (...args: any[]) => {
  if (MEGA_DEBUG) {
    console.error("[MEGA_ERROR]", ...args);
  }
};

/** console.warn > предупреждений */
export const logWarn = (...args: any[]) => {
  if (MEGA_DEBUG) {
    console.warn("[MEGA_WARN]", ...args);
  }
};
