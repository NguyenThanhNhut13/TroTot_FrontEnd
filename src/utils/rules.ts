import type { RegisterOptions, UseFormGetValues } from "react-hook-form";
import * as yup from "yup";

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent as {
    price_min: string;
    price_max: string;
  };
  if (price_min !== "" && price_max !== "") {
    return Number(price_max) >= Number(price_min);
  }
  return price_min !== "" || price_max !== "";
}

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required("Nhập lại password là bắt buộc")
    .min(6, "Độ dài từ 6 - 160 ký tự")
    .max(160, "Độ dài từ 6 - 160 ký tự")
    .oneOf([yup.ref(refString)], "Nhập lại password không khớp");
};

export const schema = yup.object({
  credential: yup
  .string()
    .required("Email là bắt buộc")
    .email("Email không đúng định dạng")
    .min(5, "Độ dài từ 5 - 160 ký tự")
    .max(160, "Độ dài từ 5 - 160 ký tự"),
fullName: yup
  .string()
  .required('Họ tên là bắt buộc')
  .max(160, 'Họ tên tối đa 160 ký tự'),
  email: yup
    .string()
    .required("Email là bắt buộc")
    .email("Email không đúng định dạng")
    .min(5, "Độ dài từ 5 - 160 ký tự")
    .max(160, "Độ dài từ 5 - 160 ký tự"),
  password: yup
    .string()
    .required("Password là bắt buộc")
    .min(6, "Độ dài từ 6 - 160 ký tự")
    .max(160, "Độ dài từ 6 - 160 ký tự"),
    confirmPassword: handleConfirmPasswordYup("password"),
  price_min: yup.string().test({
    name: "price-not-allowed",
    message: "Giá không phù hợp",
    test: testPriceMinMax,
  }),
  price_max: yup.string().test({
    name: "price-not-allowed",
    message: "Giá không phù hợp",
    test: testPriceMinMax,
  }),
  displayName: yup
    .string()
    .required("Tên là bắt buộc")
    .max(160, "Độ dài tối đa là 160 ký tự"),
  username: yup
    .string()
    .required("Username là bắt buộc")
    .min(5, "Độ dài từ 5 - 160 ký tự")
    .max(160, "Độ dài từ 5 - 160 ký tự"),
});

export const userSchema = yup.object({
  id: yup.string().required("ID là bắt buộc"),
  fullName: yup.string().max(255, "Tên đầy đủ không được vượt quá 255 ký tự").required("Tên đầy đủ là bắt buộc"),
  address: yup.string().max(500, "Địa chỉ không được vượt quá 500 ký tự").required("Địa chỉ là bắt buộc"),
  dob: yup.date().max(new Date(), "Ngày sinh không hợp lệ").required("Ngày sinh là bắt buộc"),
});

export const loginSchema = yup.object({
  credential: yup
    .string()
    .required("Email hoặc số điện thoại là bắt buộc")
    .min(5, "Độ dài từ 5 - 160 ký tự")
    .max(160, "Độ dài từ 5 - 160 ký tự"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Độ dài từ 6 - 160 ký tự")
    .max(160, "Độ dài từ 6 - 160 ký tự"),
});

export type UserSchema = yup.InferType<typeof userSchema>;

export type Schema = yup.InferType<typeof schema>;

export type LoginSchema = yup.InferType<typeof loginSchema>;
