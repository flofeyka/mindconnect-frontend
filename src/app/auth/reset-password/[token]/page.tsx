"use client";

import { useParams } from "next/navigation";
import { Button } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { FormikValues, useFormik } from "formik";
import {
  checkVerifyToken,
  resetPasswordSystem,
} from "@lib/redux/slices/auth/authSlice";
import InputForm from "@components/InputForm";
import * as Yup from "yup";
import Title from "@components/Title";
import { useEffect } from "react";
import Logo from "@components/Logo";

export default function ResetPassword() {
  const params = useParams<{ token: string }>();
  const dispatch = useAppDispatch();
  const [tokenIsValid, isPending] = useAppSelector((state) => [
    state.Auth.tokenIsValid,
    state.Auth.isPending,
  ]);
  useEffect(() => {
    dispatch(checkVerifyToken({ token: params.token }));
  }, [tokenIsValid, dispatch, params.token]);

  const formik = useFormik<FormikValues>({
    initialValues: {
      newPassword: "",
      repeatNewPassword: "",
    },
    validationSchema: Yup.object().shape({
      newPassword: Yup.string().trim().required().min(8),
      repeatNewPassword: Yup.string().oneOf(
        [Yup.ref("newPassword")],
        "Пароли должны совпадать"
      ),
    }),
    onSubmit: (values: FormikValues) =>
      dispatch(
        resetPasswordSystem({
          token: params.token,
          newPassword: values.newPassword,
        })
      ),
  });

  if (isPending) {
    return (
      <div>
        <Logo />
      </div>
    );
  }

  return tokenIsValid ? (
    <form
      onSubmit={formik.handleSubmit}
      className={"flex flex-col items-center"}
    >
      <Title>Сбросить пароль</Title>
      <InputForm
        className={"mb-2"}
        placeholder={"Пароль"}
        width={"300px"}
        height={"50px"}
        name={"newPassword"}
        InnerIconSrc={"/password.svg"}
        type={"password"}
        value={formik.values.newPassword}
        onChange={formik.handleChange}
      />
      <InputForm
        className={"mb-2"}
        placeholder={"Повторите пароль"}
        width={"300px"}
        height={"50px"}
        name={"repeatNewPassword"}
        InnerIconSrc={"/password.svg"}
        type={"password"}
        value={formik.values.repeatNewPassword}
        onChange={formik.handleChange}
      />
      <Button type={"submit"}>Сбросить</Button>
    </form>
  ) : (
    <div>Токен недействителен</div>
  );
}
