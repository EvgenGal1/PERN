export const getCookie = (name: string): string | undefined => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
};

export const setCookie = (name: string, value: string, options: any) => {
  document.cookie = `${name}=${value}; ${Object.entries(options)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ")}`;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};
