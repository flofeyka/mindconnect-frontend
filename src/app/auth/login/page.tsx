"use client";

import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Checkbox, Input } from "@nextui-org/react";
import Link from "next/link";
import InputForm from "@components/InputForm";
import { signIn } from "@lib/redux/auth/authSlice";
import Vector from "@components/Vector";
import Title from "@components/Title";

export default function Login() {
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
      window.open("/test", "_self");
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="max-w-[300px]">
        <div className="text-center mb-5">
          <Title>Log in</Title>
          <div className="text-[14px]">
            If you do not have an account, you can create one in a few clicks
          </div>
        </div>
        <div className={"mb-[10px]"}>
          <InputForm
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            type="email"
            InnerIconSrc="/email.svg"
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
      <div className="mt-2 flex">
        <Button onClick={() => window.history.back()}>
          <Vector />
        </Button>
        <Button
          className="w-[220px] text-white font-semibold"
          color="success"
          type="submit"
        >
          Log in account
        </Button>
      </div>
    </form>
  );
}
