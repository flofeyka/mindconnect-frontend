"use client";

import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import InputForm from "@components/InputForm";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import Vector from "@components/Vector";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { googleSignIn } from "@lib/redux/slices/auth/authSlice";
import { redirect } from "next/navigation";

export default function Auth() {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().trim().email().required(),
    }),
    onSubmit: (values: FormikValues) => {
      console.log(values);
    },
  });

  const dispatch = useAppDispatch();
  const googleUrl = useAppSelector((state) => state.Auth.googleUrl);
  if (googleUrl) {
    redirect(googleUrl);
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col justify-center items-center"
    >
      <div className="text-center max-w-[350px] mb-2">
        <div className="text-2xl font-bold mb-2">Log in to your account</div>
        <div>
          If you do not have an account, you can create one in a few clicks
        </div>
      </div>
      <div className="w-[300px] my-3">
        <InputForm
          name="email"
          placeholder="Email"
          onChange={formik.handleChange}
          value={formik.values.email}
          InnerIconSrc="/email.svg"
          height="30px"
          width="300px"
          type="email"
        />
      </div>
      <div className="flex mb-3">
        <Button className="w-[50px]" onClick={() => dispatch(googleSignIn())}>
          <Image src="google.svg" alt="cool" width={23} height={23} />
        </Button>
        <Button color="success" className="text-white font-medium w-[220px]">
          <div className={"flex"}>
            Sign in <Vector className="rotate-180" color="1a1a1a" />
          </div>
        </Button>
      </div>
      <div className="flex dark:text-white">
        <Link
          href="/auth/register"
          className={"flex items-center font-semibold"}
        >
          Create an account
          <div className={"rotate-180 mx-2 hover:pr-2 flex"}>
            <Vector />
          </div>
        </Link>
      </div>
    </form>
  );
}
