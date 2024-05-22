import React, { FC } from "react";
import CustomButton from "@components/CustomButton";

const FindSpecialist: FC = () => {
  return (
    <div className="text-center mt-[105px] mb-40">
      <h2 className="text-[26px] font-semibold">
        Find a specialist for yourself
      </h2>
      <p className="text-[14px] mt-[12px] mb-[28px] w-[299px] mx-auto">
        We carefully select the specialists you can turn to at a difficult
        moment in your life
      </p>
      <CustomButton color="primary">List of specialists</CustomButton>
    </div>
  );
};

export default FindSpecialist;
