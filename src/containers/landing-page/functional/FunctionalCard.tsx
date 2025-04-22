import cn from "@helpers/cn";
import React, { FC } from "react";

const FunctionalCard: FC = () => {
  return (
    <div className="mt-[105px]">
      <div className="flex gap-6 mb-5 sm:flex-col sm:items-center">
        <div
          className={cn(
            "bg-[url(/images/psychologists-bg.png)] bg-cover bg-no-repeat",
            "w-[780px] sm:flex-col sm:w-[95vw] h-[280px] sm:h-full rounded-[22px] border border-[#ffff]/5 bg-[#141414] flex "
          )}
        >
          <div className="p-[42px] sm:p-[30px]">
            <h4 className="font-semibold text-[18px] text-[#EBEBEB] sm:text-2xl">
              Психологи
            </h4>
            <p className="w-[413px] sm:w-full text-[14px] mt-[12px] opacity-80 sm:text-[14px]">
              Наши психологи - образованные специалисты в различных областях
              психологии, именно они смогут действительно решить ваши проблемы
            </p>
          </div>
          <img
            className="w-[211px] h-[196px] mt-10 sm:m-0 sm:w-[150px] sm:h-[140px] sm:mx-auto sm:sm-5"
            src="/images/psychologists.png"
            alt=""
          />
        </div>

        <div className="bg-[url(/images/anonymous-bg.png)] bg-cover bg-no-repeat bg-center sm:w-[95vw] w-[380px] h-[280px] rounded-[22px] border border-[#ffff]/5 bg-[#141414] flex sm:flex-col">
          <div className="p-[42px]">
            <h4 className="font-semibold text-[18px] text-[#EBEBEB]">
              Функция конференции
            </h4>
            <p className="w-[296px] text-[14px] mt-[12px] opacity-80 mb-5">
              Назначайте встречи с вашим врачом
            </p>
            <img
              className="w-[296px] h-[133px]"
              src="/images/anonymous.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="flex gap-6 sm:flex-col sm:items-center">
        <div className="bg-[url(/images/ai-bg.png)] bg-cover bg-no-repeat bg-center sm:w-[95vw] w-[380px] h-[280px] rounded-[22px] border border-[#ffff]/5 bg-[#141414] flex ">
          <div className="p-[42px]">
            <h4 className="font-semibold text-[18px] text-[#EBEBEB]">
              ИИ-ассистент
            </h4>
            <p className="w-[296px] text-[14px] mt-[12px] opacity-80 mb-5">
              Найдите ответы на любые вопросы
            </p>
            <img
              className="w-[296px] h-[133px]"
              src="/images/chat.png"
              alt=""
            />
          </div>
        </div>

        <div
          className={cn(
            "bg-[url(/images/support-bg.png)] bg-cover bg-no-repeat",
            "w-[780px] sm:w-[95vw] h-[280px] rounded-[22px] border border-[#ffff]/5 bg-[#141414] flex "
          )}
        >
          <div className="p-[42px]">
            <h4 className="font-semibold text-[18px] text-[#EBEBEB]">
              Быстрая поддержка
            </h4>
            <p className="w-[413px] sm:w-full text-[14px] mt-[12px] opacity-80 ">
              Быстрая поддержка доступна для всех бесплатно в течение 15 или
              более минут разговора со специалистом, который поддержит и поможет
              вам в экстренной ситуации
            </p>
          </div>
          <img
            className="w-[172px] h-[202px] mt-10 sm:hidden"
            src="/images/suppurt.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default FunctionalCard;
