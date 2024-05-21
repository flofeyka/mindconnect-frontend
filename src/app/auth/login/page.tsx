"use client";

import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Checkbox, Input } from "@nextui-org/react";
import Link from "next/link";
import InputForm from "@components/InputForm";
import { signIn } from "@lib/redux/auth/authSlice";
import Vector from "@components/Vector";

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
            If you do not have an account, you can create one in a few clicks
          </div>
        </div>

        <div className="w-[300px]">
          <div className={"mb-[10px]"}>
            <InputForm
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              type="email"
              InnerIconSrc="/email.svg"
              InnerIconHeight="23px"
              InnerIconWidth="22px"
              width="300px"
              height="40px"
            />
          </div>
          <div className={"mb-[10px]"}>
            <InputForm
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              type="password"
              InnerIconSrc="/password.svg"
              InnerIconHeight="23px"
              InnerIconWidth="22px"
              width="300px"
              height="40px"
            />
          </div>
          <div className="flex justify-start">
            <Checkbox color="success" size="sm">
              Remember me
            </Checkbox>
            <div className="ml-auto">
              <Link href="/auth/forgot-password" className="text-[13px]">
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
        <div className="flex justify-center align-center items-center mt-2">
            <Button onClick={() => window.history.back()}><Vector/></Button>
          <Button
            className="w-[225px] text-white font-semibold"
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
