import http from '../utils/http';
import { Address } from '../types/address.type';
import { SuccessResponse } from '../types/utils.type';

export const URL_GET_ADDRESSES = 'api/v1/addresses';

const addressApi = {
  getAddresses(params: { street?: string; district?: string; province?: string } = {}) {
    const { street, district, province } = params;
    return http.get<SuccessResponse<Address[]>>(`${URL_GET_ADDRESSES}/search`, {
      params: { street, district, province },
    });
  },

  getAllAddresses() {
    return http.get<SuccessResponse<Address[]>>(URL_GET_ADDRESSES);
  },

  getAddressById(id: number) {
    return http.get<SuccessResponse<Address>>(`${URL_GET_ADDRESSES}/${id}`);
  },

  saveAddress(address: Address) {
    return http.post<SuccessResponse<Address>>(URL_GET_ADDRESSES, address);
  },

  updateAddress(id: number, address: Address) {
    return http.put<SuccessResponse<Address>>(`${URL_GET_ADDRESSES}/${id}`, address);
  },

  deleteAddress(id: number) {
    return http.delete<SuccessResponse<void>>(`${URL_GET_ADDRESSES}/${id}`);
  },
};

export default addressApi;