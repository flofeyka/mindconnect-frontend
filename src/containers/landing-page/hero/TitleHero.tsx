import React, { FC } from "react";

const TitleHero: FC = () => {
  return (
    <div className="text-center pt-[140px] sm:pt-[100px]">
      <h1 className="font-semibold text-[42px] mb-[19px] sm:text-[35px]">
        Начните следить за своим <br /> психическим здоровьем
      </h1>
      <p className="opacity-70 leading-[24px] w-[551px] mx-auto aling-center sm:w-[95vw]">
        В сложной и нестабильной ситуации в мире каждый заслуживает возможности
        оставаться психически здоровым. Наша миссия — помогать населению Земли,
        независимо от того, из какой вы страны.
      </p>
    </div>
  );
};

export default TitleHero;
