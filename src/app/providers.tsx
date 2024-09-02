"use client";

import { makeStore } from "@lib/redux/store";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={makeStore()}>
      <NextUIProvider>{children}</NextUIProvider>
    </Provider>
  );
};

export default Providers;
