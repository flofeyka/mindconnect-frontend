"use client";

import CustomButton from "@components/CustomButton";
import {
  findUsersByEmails,
  getAuthUserData,
} from "@lib/redux/slices/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import {
  useStreamVideoClient,
  Call,
  MemberRequest,
} from "@stream-io/video-react-sdk";
import { Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";
import {
  Card,
  Checkbox,
  DatePicker,
  Radio,
  RadioGroup,
  Textarea,
} from "@nextui-org/react";
import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";

export default function CreateMeetingPage() {
  const [descriptionInput, setDescriptionInput] = useState("");
  const [startTimeInput, setStartTimeInput] = useState<string>("");
  const [startTimeValue, setStartTimeValue] = useState<ZonedDateTime | null>(
    null
  );
  const [participantsInput, setParticipantsInput] = useState("");
  const [userName, setUserName] = useState("Гость");

  const [call, setCall] = useState<Call>();

  const client = useStreamVideoClient();

  const user = useAppSelector((state) => state.Auth.usersData);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAuthUserData());
  }, [dispatch]);

  async function createMeeting() {
    if (!client) {
      return;
    }
    try {
      const id = crypto.randomUUID();

      // Установим тип вызова как default для простоты
      const callType = "default";
      
      const call = client.call(callType, id);

      // Не используем поиск пользователей для анонимного режима
      const starts_at = new Date(startTimeInput || Date.now()).toISOString();

      // Создаем вызов с минимальными данными
      await call.getOrCreate({
        data: {
          starts_at,
          custom: { 
            description: descriptionInput,
            createdBy: userName 
          },
        },
      });
      setCall(call);
    } catch (error) {
      console.error("Детальная ошибка создания встречи:", error);
      alert("Ошибка создания встречи: " + (error.message || JSON.stringify(error)));
    }
  }

  if (!client) {
    return <Loader2 className="mx-auto animate-spin" />;
  }
  
  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Добро пожаловать, {userName}
      </h1>
      <Card className="w-80 mx-auto space-y-6 p-5">
        <h2 className="text-xl font-bold">Создать новую встречу</h2>
        <div className="space-y-2">
          <label className="block space-y-1">
            <span className="font-medium">Ваше имя</span>
            <Textarea
              labelPlacement="outside"
              placeholder="Введите ваше имя"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>
        </div>
        <div className="space-y-2">
          <div className="font-medium">Информация о встрече</div>
          <label className="block space-y-1">
            <span className="font-medium">Описание</span>
            <Textarea
              labelPlacement="outside"
              placeholder="Введите описание встречи"
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
            />
          </label>
        </div>
        <StartTimeInput
          value={startTimeValue}
          setValue={setStartTimeValue}
          onChange={setStartTimeInput}
        />
        <CustomButton onPress={createMeeting} className="w-full">
          Создать встречу
        </CustomButton>
      </Card>
      {call && <MeetingLink call={call} userName={userName} />}
    </div>
  );
}

interface StartTimeInputProps {
  value: ZonedDateTime | null;
  setValue: (value: ZonedDateTime) => void;
  onChange: (value: string) => void;
}

function StartTimeInput({ value, onChange, setValue }: StartTimeInputProps) {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState("immediate");

  const dateTimeLocalNow = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60_000
  )
    .toISOString()
    .slice(0, 16);

  const handleSelection = (val: string) => {
    setSelected(val);
    if (val === "immediate") {
      setActive(false);
      onChange("");
    } else {
      setActive(true);
      onChange(dateTimeLocalNow);
    }
  };

  return (
    <div className="space-y-2">
      <div className="font-medium">Начало встречи:</div>

      <RadioGroup value={selected} onValueChange={handleSelection}>
        <Radio value="immediate">Начать встречу сейчас</Radio>
        <Radio value="scheduled">Запланировать на определённое время</Radio>
      </RadioGroup>
      {active && (
        <label className="block space-y-1">
          <span className="font-medium">Время начала</span>
          <DatePicker
            className="max-w-md"
            granularity="second"
            label="Дата и время"
            value={value as any}
            onChange={(date: any) => {
              if (date) setValue(date);
            }}
          />
        </label>
      )}
    </div>
  );
}

interface MeetingLinkProps {
  call: Call;
  userName: string;
}

function MeetingLink({ call, userName }: MeetingLinkProps) {
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/fast-connect/meeting/${call.id}`;

  return (
    <div className="text-center flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <span>Ссылка для приглашения: </span>
        <Link target="_blank" href={meetingLink} className="font-medium">
          {meetingLink}
        </Link>
        <button
          title="Скопировать ссылку"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            alert("Скопировано в буфер обмена");
          }}
        >
          <Copy />
        </button>
      </div>
      <a
        href={getMailToLink(
          meetingLink,
          call.state.startsAt,
          call.state.custom.description,
          userName
        )}
        target="_blank"
        className="text-blue-500 hover:underline"
      >
        Отправить приглашение по почте
      </a>
    </div>
  );
}

function getMailToLink(
  meetingLink: string,
  startsAt?: Date,
  description?: string,
  createdBy?: string
) {
  const startDateFormatted = startsAt
    ? startsAt.toLocaleString("ru-RU", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : undefined;

  const subject =
    "Присоединиться к моей встрече" + (startDateFormatted ? ` в ${startDateFormatted}` : "");

  const body =
    `Приглашаю вас на встречу по ссылке: ${meetingLink}.` +
    (createdBy ? `\n\nСоздатель: ${createdBy}` : "") +
    (startDateFormatted
      ? `\n\nВстреча начинается в ${startDateFormatted}.`
      : "") +
    (description ? `\n\nОписание: ${description}` : "");

  return `mailto:?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
