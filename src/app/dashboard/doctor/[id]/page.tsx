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
      dispatch(fetchPostsFromDoctor(doctorId));
    }
  }, [dispatch, doctorId]);

  useEffect(() => {
    if (profile && currentUserId) {
      setIsSubscribed(profile.followers.find(follower => follower.id === Number(currentUserId)));
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
          <div className="flex gap-3 items-center">
            <Avatar
              isBordered
              radius="full"
              size="lg"
              showFallback
              src={profile.image}
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">
                {profile.firstName || "name not found"} {profile.lastName}
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
            <p className="text-default-400 text-small">Фолловеров</p>
          </div>
          <Button
            color="primary"
            variant="solid"
            className="mr-0 ml-auto"
            onPress={() => router.push(`/dashboard/doctor-details/${doctorId}`)}
          >
            Забронировать время
          </Button>
          {(profile.id) === currentUserId && (
            <Button
              color="primary"
              variant="solid"
              className="mr-0 ml-auto"
              onPress={() => router.push(`/dashboard/add`)}
            >
              Добавить пост
            </Button>
          )}
        </CardFooter>
      </Card>
      <div className="max-w-[900px] gap-2 grid px-8 mb-14 mx-auto">
        {posts
          .slice()
          .reverse()
          .map((post) => (
              <Card key={post.id} className="w-full">
                <CardHeader className="justify-between">
                  <div className="flex gap-5">
                    <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={post.imagePath}
                    />
                    <div className="flex flex-col gap-1 items-start justify-center">
                      <h4 className="text-small font-semibold leading-none text-default-600">{post.user.firstName} {post.user.lastName}</h4>
                      <h5 className="text-small tracking-tight text-default-400"></h5>
                    </div>
                  </div>
                  <Button
                      className={isSubscribed ? "bg-transparent text-foreground border-default-200" : ""}
                      color="primary"
                      radius="full"
                      size="sm"
                      variant={isSubscribed ? "bordered" : "solid"}
                      onPress={handleSubscribeToggle}
                  >
                    {isSubscribed ? "Отписаться" : "Подписаться"}
                  </Button>
                </CardHeader>
                <CardBody className="px-3 py-0 text-small text-default-400">
                  <p>{post.value}</p>
                </CardBody>
                <CardFooter className="gap-3">
                  <div className="flex gap-1">
                    <p className="font-semibold text-default-400 text-small">{profile.followers.length}</p>
                    <p className=" text-default-400 text-small">Подписок</p>
                  </div>
                  <div className="flex gap-1">
                    <p className="font-semibold text-default-400 text-small">{profile.subscriptions.length}</p>
                    <p className="text-default-400 text-small">Фолловеров</p>
                  </div>
                </CardFooter>
              </Card>
          ))}
      </div>
    </>
  );
}
