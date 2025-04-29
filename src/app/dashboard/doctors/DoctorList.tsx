import { useRouter } from "next/navigation.js";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";

interface DoctorCardProps {
  doctors: any[];
}

export default function DoctorList({ doctors }: DoctorCardProps) {
  const router = useRouter();

  return (
    <ul>
      {doctors.map((doctor) => (
        <li key={doctor.id} className="flex justify-center p-5">
          <div
            onClick={() => router.push(`/dashboard/doctor/${doctor.id}`)}
            className="w-[1225px] block cursor-pointer"
          >
            <Card className="max-w-[1225px] mx-auto h-48">
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  <Avatar
                    isBordered
                    radius="full"
                    size="lg"
                    showFallback
                    src={
                      doctor.image
                    }
                  />
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {doctor.firstName} {doctor.lastName}
                    </h4>
                    <h5 className="text-small tracking-tight text-default-400">
                      {doctor.email}
                    </h5>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="px-3 py-0 text-small text-default-400">
                {/* <p>{doctor.description}</p> */}
              </CardBody>
              <CardFooter className="gap-3">
                <div className="flex gap-1">
                  <p className="font-semibold text-default-400 text-small">
                     {doctor.subscriptions.length}
                  </p>
                  <p className=" text-default-400 text-small">Подписки</p>
                </div>
                <div className="flex gap-1">
                  <p className="font-semibold text-default-400 text-small">
                     {doctor.followers.length}
                  </p>
                  <p className="text-default-400 text-small">Подписчики</p>
                </div>
                <div className="flex gap-3 mr-0 ml-auto">
                  <Button
                    color="default"
                    variant="solid"
                    onPress={() =>
                      router.push(`/dashboard/doctor/${doctor.id}`)
                    }
                  >
                    Перейти в профиль
                  </Button>
                  <Button
                    color="primary"
                    variant="solid"
                    onPress={() =>
                      router.push(`/dashboard/doctor-details/${doctor.id}`)
                    }
                  >
                    Записаться на прием
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </li>
      ))}
    </ul>
  );
}
