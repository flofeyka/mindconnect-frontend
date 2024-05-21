"use client";

import Icon from "@components/Icon";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { Button, Input, Link } from "@nextui-org/react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import InputForm from "@components/InputForm";
import InputCheckBox from "@components/InputCheckBox";
import { signUp } from "@lib/redux/auth/authSlice";
import Vector from "@components/Vector";

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
            <div className="text-2xl font-bold mb-3">Registration</div>
            <div>
              If you do not have an account, you can create one in a few clicks
            </div>
          </div>
          <div className="min-w-[100px] w-[55%]">
            <div className={"mb-[10px]"}>
              <InputForm
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                placeholder="Full name"
                type="text"
                InnerIconSrc="/user.svg"
                width="300px"
                height="50px"
              />
            </div>
            <div className={"mb-[10px]"}>
              <InputForm
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="Email"
                type="email"
                InnerIconSrc="/email.svg"
                width="300px"
                height="50px"
              />
            </div>
            <div className={"mb-[10px]"}>
              <InputForm
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                placeholder="Password"
                type="password"
                InnerIconSrc="/password.svg"
                width="300px"
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
                InnerIconSrc="/password.svg"
                width="300px"
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
              <Button onClick={() => window.history.back()}>
                <Vector/>
              </Button>
              <Button
                className="w-[225px] text-white font-bold border-green-600 border-1"
                color="success"
                type="submit"
              >
                Create an account
              </Button>
            </div>
            <div>Already have an account? <Link href="/auth/login" className={"font-simebold"}> Sign in</Link></div>

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
    </form>
  );
}
