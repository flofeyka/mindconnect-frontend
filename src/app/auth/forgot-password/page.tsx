'use client'

import InputForm from "@/components/Input/InputForm";
import Vector from "@/components/Vector/Vector";
import { Button } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ForgotPassword() {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center max-w-[300px]">
        <div className="mb-2 font-bold text-2xl">Forgot Password</div>
        <div>
          If you don't have an account, you can create one in a few clicks
        </div>
      </div>
      <div>
        <InputForm
          name="email"
          placeholder="E-mail"
          width="15"
          height="15"
          InnerIconHeight="20"
          InnerIconSrc=""
          InnerIconWidth="20"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
      </div>
      <div className="flex">
        <Button>
          <Vector color="#1a1a1a" className="rotate-180" />{" "}
        </Button>
        <Button color="success" className="text-white font-semibold w-[150px]">
          Next
        </Button>
      </div>
    </div>
  );
}
