import { add, get } from "lodash";
import http from "../utils/http";
import { SuccessResponse } from "../types/utils.type";
import exp from "constants";
import userApi from './user.api';
import { PaypalPayment } from "../types/paypal.type";

export const URL_PURCHASE_SLOT = "api/v1/users/use-post-slot"
export const URL_GET_WALLET = "api/v1/payments/wallet"
export const URL_THEMTIEN_WALLET = "api/v1/payments/vn-pay"

const paymentAPI = {
    purchaseSlot(body: { amount: number}) {
        return http.post<SuccessResponse<any>>(URL_PURCHASE_SLOT, body)
    },
    getWallet(userId: number) {
        return http.get<SuccessResponse<any>>(`${URL_GET_WALLET}/${userId}`)
    },
    addMoneyToWallet(userId: number, amount: number) {
        return http.get<SuccessResponse<PaypalPayment>>(`${URL_THEMTIEN_WALLET}?amount=${amount}&userId=${userId}&bankCode=NCB`)
    }

}

export default paymentAPI;