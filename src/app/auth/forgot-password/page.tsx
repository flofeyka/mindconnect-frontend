'use client'


import InputForm from "@components/InputForm";
import Vector from "@components/Vector";
import { Button } from "@nextui-org/react";
import {FormikValues, useFormik} from "formik";
import * as Yup from "yup";
import {useAppDispatch} from "@lib/redux/hooks";
import {sendRequestToChangePassword} from "@lib/redux/slices/auth/authSlice";

export default function ForgotPassword() {
	const formik = useFormik({
		initialValues: {
			email: '',
		},
		validationSchema: Yup.object().shape({
			email: Yup.string().email('Invalid email address').required('Required'),
		}),
		onSubmit: (values: FormikValues) => {
			dispatch(sendRequestToChangePassword({email: values.email}));
		},
	})


  const dispatch = useAppDispatch();

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col items-center justify-center h-screen">
      <div className="text-center max-w-[300px] mb-[20px]">
        <div className="font-bold text-[26px] mb-[12px]">Forgot Password</div>
        <div className={"text-sm"}>
          If you do not have an account, you can create one in a few clicks
        </div>
      </div>
      <div className={"mt-2 mb-[15px]"}>
        <InputForm
          name="email"
          placeholder="Email"
          width="300px"
          height="30px"
          InnerIconSrc="/email.svg"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
      </div>
      <div className="flex">
        <Button className={"w-[50px]"} onClick={() => window.history.back()}>
          <Vector/>
        </Button>
        <Button type="submit" color="success" className="text-white border-solid border-green-100 font-semibold w-[220px]">
          Next
        </Button>
      </div>
    </form>
  );
}
