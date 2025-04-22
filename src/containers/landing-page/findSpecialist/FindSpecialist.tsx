import React, { FC } from "react";
import CustomButton from "@components/CustomButton";

const FindSpecialist: FC = () => {
  return (
    <div className="text-center mt-[105px] mb-40">
      <h2 className="text-[26px] font-semibold">
        Найдите специалиста для себя
      </h2>
      <p className="text-[14px] mt-[12px] mb-[28px] w-[299px] mx-auto">
        *Только опытные врачи
      </p>
      <CustomButton color="primary">Список специалистов</CustomButton>
    </div>
  );
};

export default FindSpecialist;
