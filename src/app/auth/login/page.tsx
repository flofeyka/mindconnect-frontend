"use client";

import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Checkbox, Input, Link, Spinner } from "@nextui-org/react";
import InputForm from "@components/InputForm";
import { signIn } from "@lib/redux/slices/auth/authSlice";
import Vector from "@components/Vector";
import Title from "@components/Title";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    onSubmit: async (values) => {
      setIsLoading(true);
      await dispatch(
        signIn({ email: values.email, password: values.password })
      );
      setIsLoading(false);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="max-w-[300px]">
          <div className="text-center mb-5">
            <Title>Вход</Title>
            <div className="text-[14px]">
              Если у вас нет учетной записи, вы можете создать ее за несколько
              кликов
            </div>
          </div>
          <div className={"mb-[10px]"}>
            <InputForm
              name="email"
              disabled={isLoading}
              placeholder="Электронная почта"
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
              disabled={isLoading}
              placeholder="Пароль"
              value={formik.values.password}
              onChange={formik.handleChange}
              type="password"
              InnerIconSrc="/password.svg"
              width="300px"
              height="40px"
            />
          </div>
          <div className="flex justify-start">
            <Checkbox disabled={isLoading} color="success" size="sm">
              Запомнить меня
            </Checkbox>
            <div className="ml-auto">
              <Link href="/auth/forgot-password" className="text-[13px]">
                Забыли пароль?
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <Button disabled={isLoading} onPress={() => window.history.back()}>
            <Vector />
          </Button>
          <Button
            disabled={isLoading}
            className="w-[220px] text-white font-semibold"
            color="success"
            type="submit"
          >
            {isLoading ? <Spinner color="white" /> : "Войти в аккаунт"}
          </Button>
        </div>
        <div className="text-center mt-2">
          Нет аккаунта?{" "}
          <Link href="/auth/register" className={"font-simebold"}>
            Регистрация
          </Link>
        </div>
      </form>
    </>
  );
}
