"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Image,
  Spinner,
} from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import {
  fetchDoctorProfileById,
  fetchPostsFromDoctor,
  subscribeToDoctor,
  unsubscribeFromDoctor,
} from "@lib/redux/slices/doctorprofile/doctorProfileSlice";
import { useParams } from "next/navigation";
import { getAuthUserData } from "@lib/redux/slices/auth/authSlice";
import { useRouter } from "next/navigation";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { profile, posts, loading, error } = useAppSelector(
    (state) => state.doctorProfile
  );
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/dashboard/add");
  }, [router]);
  const currentUserId = useAppSelector((state) => state.Auth.usersData.id);
  const doctorId = params.id as string;

  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorProfileById(doctorId));
      // dispatch(fetchPostsFromDoctor(doctorId));
    }
  }, [dispatch, doctorId]);

  useEffect(() => {
    if (profile && currentUserId) {
      setIsSubscribed(profile.followers.find(follower => follower.id === currentUserId));
      setSubscriberCount(profile.followers.length);
    }
  }, [profile, currentUserId]);

  console.log(profile?.followers);
  console.log(currentUserId)

  const handleSubscribeToggle = async () => {
    const doctorId = params.id as string;
    if (isSubscribed) {
      await dispatch(unsubscribeFromDoctor(doctorId));
    } else {
      await dispatch(subscribeToDoctor(doctorId));
    }
    setIsSubscribed(!isSubscribed);
  };

  if (loading === "pending") {
    return (
      <div className="absolute top-1/2 left-1/2 ">
        <Spinner size="lg" />
      </div>
    );
  }

  if (loading === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No profile data available</div>;
  }

  return (
    <>
      <Card className="max-w-[836px] mx-auto h-48 mt-14 mb-14">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar
              isBordered
              radius="full"
              size="lg"
              src={profile.image || "https://nextui.org/avatars/avatar-1.png"}
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">
                {profile.firstName || "name not found"}
              </h4>
              <h5 className="text-small tracking-tight text-default-400">
                {profile.email}
              </h5>
            </div>
          </div>
          <Button
            className={
              isSubscribed
                ? "bg-transparent text-foreground border-default-200"
                : ""
            }
            color="primary"
            radius="full"
            size="md"
            variant={isSubscribed ? "bordered" : "solid"}
            onPress={handleSubscribeToggle}
          >
            {isSubscribed ? "Отписаться" : "Подписаться"}
          </Button>
        </CardHeader>

        <CardBody className="px-3 py-0 text-small text-default-400">
          <p>{profile.description}</p>
        </CardBody>
        <CardFooter className="gap-3 items-center flex">
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">
              {profile.subscriptions.length}
            </p>
            <p className=" text-default-400 text-small">Подписки</p>
          </div>
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">
              {profile.followers.length}
            </p>
            <p className="text-default-400 text-small">Подписчики</p>
          </div>
          <Button
            color="primary"
            variant="solid"
            className="mr-0 ml-auto"
            onClick={() => router.push(`/dashboard/doctor-details/${doctorId}`)}
          >
            Забронировать время
          </Button>
          {(params.id as string) === currentUserId && (
            <Button
              color="primary"
              variant="solid"
              className="mr-0 ml-auto"
              onClick={() => router.push(`/dashboard/add`)}
            >
              Добавить пост
            </Button>
          )}
        </CardFooter>
      </Card>
      <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8 mb-14 mx-auto">
        {posts
          .slice()
          .reverse()
          .map((post) => (
            <Card
              key={post.id}
              className="col-span-12 sm:col-span-4 h-[250px] overflow-hidden relative"
            >
              <div
                onClick={() =>
                  router.push(`/dashboard/doctor/${params.id}/post/${post.id}`)
                }
                className="w-full h-full relative block cursor-pointer"
              >
                {/* Black gradient that covers half of the card */}
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/100 to-transparent h-full"></div>

                <CardHeader className="absolute z-20 top-0 left-0 right-0 flex-col !items-start p-4">
                  <h4 className="text-white font-medium text-large">
                    {post.title}
                  </h4>
                </CardHeader>

                <Image
                  removeWrapper
                  alt="Card background"
                  className="z-0 w-full h-full object-cover"
                  src={post.image}
                />
              </div>
            </Card>
          ))}
      </div>
    </>
  );
}
