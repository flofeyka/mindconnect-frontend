"use client";
import Container from "@components/Container";
import CustomButton from "@components/CustomButton";
import Icon from "@components/Icon";
import Logo from "@components/Logo";
import ContentOver from "@containers/landing-page/content-over/ContentOver";
import FooterBottom from "@containers/landing-page/footer/FooterBottom";
import QuickActions from "@containers/landing-page/footer/QuickActions";
import HeaderHav from "@containers/landing-page/header/HeaderNav";
import TotalVolunteers from "@containers/landing-page/header/TotalVolunteers";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { getAuthUserData } from "@lib/redux/slices/auth/authSlice";
import Link from "next/link";
import { Suspense, useLayoutEffect, type ReactNode } from "react";
import Loading from "./loading";
import LandingPage from "./page";

const LandingLayout = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.Auth.usersData);

  useLayoutEffect(() => {
    dispatch(getAuthUserData());
  }, [dispatch, JSON.stringify(user)]);

  console.log(user);

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Container>
          <header className="flex items-center  h-[104px] sm:px-6">
            <Link href={`/`}>
              <Logo />
            </Link>
            <HeaderHav />
            <div className="flex gap-4 items-center ml-auto">
              <TotalVolunteers />
              <Link
                className="sm:hidden"
                href={"/fast-connect"}
                target="_blank"
              >
                <CustomButton
                  color="default"
                  startContent={
                    <Icon
                      width="16px"
                      height="17px"
                      path="/icons/quick-support.svg"
                    />
                  }
                >
                  Быстрая поддержка
                </CustomButton>
              </Link>
              {Object.keys(user).length === 0 ? (
                <Link href={"/auth/login"}>
                  <CustomButton color="primary">Войти</CustomButton>
                </Link>
              ) : (
                <Link href={"/dashboard"}>
                  <CustomButton color="primary">Дашборд</CustomButton>
                </Link>
              )}
            </div>
          </header>
          <main>
            <LandingPage />
          </main>
        </Container>
        <footer className="bg-[url(/images/footer-bg.png)] h-[497px] sm:h-full">
          <Container>
            <ContentOver />
            <div className="flex flex-col pt-[150px]">
              <div className="wrapper flex justify-between">
                <div className="">
                  <Logo />
                  <p className="w-[270px] mt-[18px] text-[14px] text-[#FFFFFF]/80">
                    Начните работу над своим психическим здоровьем с нашим
                    приложением.
                  </p>
                </div>
                <div className="">
                  <QuickActions />
                </div>
              </div>
              <FooterBottom />
            </div>
          </Container>
        </footer>
      </Suspense>
    </div>
  );
};

export default LandingLayout;
