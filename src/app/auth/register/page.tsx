"use client";

import Icon from "@components/Icon";
import { useAppDispatch, useAppSelector } from "@libs/redux/hooks";
import { Button, Input } from "@nextui-org/react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import InputForm from "@components/InputForm";
import InputCheckBox from "@components/InputCheckBox";
import { getAuthUserData, signUp } from "@libs/redux/auth/authSlice";

export default function Register() {
  const captchaUrl = useAppSelector((state) => state.auth.captchaUrl);
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().trim().email().required(),
      firstName: Yup.string().trim().required(),
      password: Yup.string().trim().required().min(8),
      repeatPassword: Yup.string()
        .trim()
        .required()
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: (values: FormikValues) => {
      const { firstName, email, password } = values;
      dispatch(signUp({ firstName, email, password }));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col items-center h-screen">
        <div className="flex h-[10vh] items-center">
          <Icon
            path="/icon/auth/logo-sm.svg"
            color="#aaaaaa"
            height="30px"
            width="190px"
          />
        </div>
        <div className="flex flex-col items-center justify-center h-[100%]">
          <div className="text-center max-w-[80%] mb-7">
            <div className="text-2xl font-bold mb-3">Registration</div>
            <div>
              If you do not have an account, you can create one in a few clicks
            </div>
          </div>
          <div className="min-w-[100px] w-[55%]">
            <div>
              <InputForm
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                placeholder="Full name"
                type="text"
                InnerIconSrc="/icon/auth/Fullname.svg"
                InnerIconWidth="21.5px"
                InnerIconHeight="21px"
                width="350px"
                height="50px"
              />
            </div>
            <div>
              <InputForm
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="Email"
                type="email"
                InnerIconSrc="/icon/auth/Email.svg"
                InnerIconWidth="24.5px"
                InnerIconHeight="17px"
                width="350px"
                height="50px"
              />
            </div>
            <div>
              <InputForm
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="Password"
                type="password"
                InnerIconSrc="/icon/auth/Password.svg"
                InnerIconWidth="24.5px"
                InnerIconHeight="21px"
                width="350px"
                height="50px"
              />
            </div>
            <div className="mb-[10px]">
              <InputForm
                name="repeatPassword"
                value={formik.values.repeatPassword}
                onChange={formik.handleChange}
                placeholder="Repeat password"
                type="password"
                InnerIconSrc="/icon/auth/Password.svg"
                InnerIconWidth="24.5px"
                InnerIconHeight="20.8px"
                width="350px"
                height="50px"
              />
            </div>
            <div className="mb-[10px]">
              <InputCheckBox color="success">
                I agree to the{" "}
                <a
                  href="#"
                  className="underline decoration-green-600 text-green-600"
                >
                  privacy policy
                </a>
              </InputCheckBox>
            </div>
            <div className="flex">
              <Button className="w-[1%] ml-1">
                <Icon
                  path="/icon/auth/Vector.svg"
                  color="#1a1a1a"
                  width="10px"
                  height="10px"
                />
              </Button>
              <Button
                className="w-[100%] text-white font-bold border-green-600 border-1"
                color="success"
                type="submit"
              >
                Create an account
              </Button>
            </div>
          </div>
        </div>
        <div>
          {captchaUrl != null && (
            <div>
              <label>Captcha</label>
              <Input variant="underlined" />
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
