import { /* $ */ authHost, /* $ */ host } from "./index_UTVst";

export const createType = async (type: string) => {
  const { data } = await /* $ */ authHost.post("api/type", type);
  return data;
};

export const fetchTypes = async () => {
  const { data } = await /* $ */ host.get("api/type");
  return data;
};

export const createBrand = async (brand: string) => {
  const { data } = await /* $ */ authHost.post("api/brand", brand);
  return data;
};

export const fetchBrands = async () => {
  const { data } = await /* $ */ host.get("api/brand");
  return data;
};

export const createDevice = async (device: string) => {
  const { data } = await /* $ */ authHost.post("api/device", device);
  return data;
};

export const fetchDevices = async (
  typeId: number,
  brandId: number,
  page: number,
  limit = 5
) => {
  const { data } = await /* $ */ host.get("api/device", {
    params: {
      typeId,
      brandId,
      page,
      limit,
    },
  });
  return data;
};

export const fetchOneDevice = async (id: number) => {
  const { data } = await /* $ */ host.get("api/device/" + id);
  return data;
};
