import Link from "next/link";
import React, { FC } from "react";

const FooterBottom: FC = () => {
  return (
    <div className="pt-[80px]">
      <div className="w-full h-[2px] bg-[#ffff]/10"></div>
      <div className=" flex justify-between mt-8">
        <Link className="text-[14px] text-[#ffff]/50" href="#">
          © 2024 mindconnect. All rights reserved.
        </Link>
        <div className="flex gap-5">
          <Link href="#">
            <img src="/icons/youtube.svg" alt="" />
          </Link>
          <Link href="#">
            <img src="/icons/facebook.svg" alt="" />
          </Link>
          <Link href="#">
            <img src="/icons/instagram.svg" alt="" />
          </Link>
          <Link href="#">
            <img src="/icons/x.svg" alt="" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
