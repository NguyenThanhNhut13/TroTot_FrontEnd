import { SuccessResponse } from "../types/utils.type";
import { Province, District, Ward, GetAddressResponse } from "../types/address.type";
import axios from "axios";

// External API URLs
export const URL_GET_PROVINCES =
  "provinces/getAll";
export const URL_GET_DISTRICTS_BY_PROVINCE =
  "districts/getByProvince";
export const URL_GET_WARDS_BY_DISTRICT =
  "wards/getByDistrict";

// Create a separate axios instance for the external API
const externalHttp = axios.create({
  baseURL: "https://vn-public-apis.fpo.vn/",
  headers: {
    "Content-Type": "application/json",
  },
});

const addressAPI = {
  getProvinces() {
    return externalHttp.get<GetAddressResponse>(URL_GET_PROVINCES, {
      params: { limit: -1 },
    });
  },

  getDistricts(provinceCode: string) {
    return externalHttp.get<GetAddressResponse>(
      URL_GET_DISTRICTS_BY_PROVINCE,
      {
        params: { provinceCode, limit: -1 },
      }
    );
  },

  getWards(districtCode: string) {
    return externalHttp.get<GetAddressResponse>(URL_GET_WARDS_BY_DISTRICT, {
      params: { districtCode, limit: -1 },
    });
  },
};

export default addressAPI;
