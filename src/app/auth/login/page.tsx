"use client";

import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Checkbox, Input } from "@nextui-org/react";
import Link from "next/link";
import InputForm from "@components/InputForm";
import { getAuthUserData, signIn } from "@lib/redux/auth/authSlice";

export default function Login() {
  const captchaUrl = useAppSelector((state) => state.auth.captchaUrl);
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      captcha: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().trim().email().required(),
      password: Yup.string().trim().required(),
    }),
    onSubmit: (values) => {
      dispatch(signIn({ email: values.email, password: values.password }));
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex justify-center items-center"
    >
      <div className="flex justify-center items-center flex-col h-screen max-w-[400px]">
        <div className="max-w-[80%] flex flex-col text-center mb-5">
          <div className="text-5xl flex justify-center align-center relative font-bold mb-3">
            Log in
          </div>
          <div>
            If you don't have an account, you can create one in a few clicks
          </div>
        </div>

        <div className="w-[300px]">
          <div>
            <InputForm
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              type="email"
              InnerIconSrc="/icon/auth/Email.svg"
              InnerIconHeight="23"
              InnerIconWidth="22"
              width="250px"
              height="30px"
            />
          </div>
          <div>
            <InputForm
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              type="password"
              InnerIconSrc="/icon/auth/Password.svg"
              InnerIconHeight="23"
              InnerIconWidth="22"
              width="250px"
              height="30px"
            />
          </div>
          <div className="flex justify-start">
            <Checkbox color="success" size="sm">
              Remember me
            </Checkbox>
            <div className="ml-auto">
              <Link href="#" className="text-[13px]">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        {captchaUrl !== null && (
          <div>
            <Input />
          </div>
        )}
        <div className="flex justify-center align-center h-[25%]">
          <Button
            className="mt-2 w-[300px] text-white "
            color="success"
            type="submit"
          >
            Log in account
          </Button>
        </div>
      </div>
    </form>
  );
}
