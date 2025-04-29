"use client";

import Icon from "@components/Icon";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { Button, Input, Link, Spinner } from "@nextui-org/react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import InputForm from "@components/InputForm";
import InputCheckBox from "@components/InputCheckBox";
import { signUp } from "@lib/redux/slices/auth/authSlice";
import Vector from "@components/Vector";
import Title from "@components/Title";
import { useState } from "react";

export default function Register() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      isDoctor: false,
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().trim().email().required(),
      firstName: Yup.string().trim().required(),
      password: Yup.string().trim().required().min(8),
      lastName: Yup.string().trim().required().min(4),
      repeatPassword: Yup.string()
        .trim()
        .required()
        .oneOf([Yup.ref("password")], "Пароли должны совпадать"),
      isDoctor: Yup.boolean(),
    }),
    onSubmit: async (values: FormikValues) => {
      setLoading(true);
      const { firstName, email, password, lastName, isDoctor } = values;
      await dispatch(
        signUp({ firstName, email, password, lastName, isDoctor })
      );
      setLoading(false);
      // setTimeout(() => {
      //   window.open("/auth/login", "_self");
      // }, 1000);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex h-[10vh] items-center">
        <Icon
          path="/icon/auth/logo-sm.svg"
          color="#aaaaaa"
          height="30px"
          width="190px"
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-center max-w-[80%] mb-7">
          <Title>Регистрация</Title>
          <div className="text-[14px]">
            Если у вас нет учетной записи, вы можете создать ее за несколько
            кликов
          </div>
        </div>
        <div className="flex flex-col gap-[10px]">
          <InputForm
            disabled={loading}
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            placeholder="Имя"
            type="text"
            InnerIconSrc="/user.svg"
            height="50px"
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div className="error">{formik.errors.firstName as any}</div>
          )}
          <InputForm
            disabled={loading}
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            placeholder="Фамилия"
            type="text"
            InnerIconSrc="/user.svg"
            height="50px"
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div className="error">{formik.errors.lastName as any}</div>
          )}
          <InputForm
            disabled={loading}
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="Электронная почта"
            type="email"
            InnerIconSrc="/email.svg"
            height="50px"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error">{formik.errors.email as any}</div>
          )}
          <InputForm
            disabled={loading}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="Пароль"
            type="password"
            InnerIconSrc="/password.svg"
            height="50px"
          />
          {formik.touched.password && formik.errors.password && (
            <div className="error">{formik.errors.password as any}</div>
          )}
          <InputForm
            disabled={loading}
            name="repeatPassword"
            value={formik.values.repeatPassword}
            onChange={formik.handleChange}
            placeholder="Повторите пароль"
            type="password"
            InnerIconSrc="/password.svg"
            height="50px"
          />
          {formik.touched.repeatPassword && formik.errors.repeatPassword && (
            <div className="error">{formik.errors.repeatPassword as any}</div>
          )}
          <InputCheckBox
            disabled={loading}
            name="isDoctor" // Link this checkbox to formik's state
            checked={formik.values.isDoctor}
            onChange={formik.handleChange}
            color="success"
          >
            <span className="text-sm">Вы врач?</span>
          </InputCheckBox>
          <InputCheckBox disabled={loading} color="success">
            <span className="text-sm">Я согласен с </span>
            <a
              href="#"
              className="underline text-sm decoration-green-600 text-green-600"
            >
              политикой конфиденциальности
            </a>
          </InputCheckBox>
          <div className="flex gap-2">
            <Button disabled={loading} onPress={() => window.history.back()}>
              <Vector />
            </Button>
            <Button
              disabled={loading}
              className="w-full text-white font-bold border-green-600 border-1"
              color="success"
              type="submit"
            >
              {loading ? <Spinner color="white" /> : "Создать аккаунт"}
            </Button>
          </div>
          <div className="text-center mt-2">
            Уже есть аккаунт?{" "}
            <Link href="/auth/login" className={"font-simebold"}>
              {" "}
              Войти
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
