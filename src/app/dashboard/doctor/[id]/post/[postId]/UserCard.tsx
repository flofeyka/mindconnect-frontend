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

export default function UserCard() {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector(
    (state) => state.doctorProfile
  );
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const params = useParams();

  const currentUserId = useAppSelector((state) => state.Auth.usersData.id);
  useEffect(() => {
    dispatch(getAuthUserData());
  }, [dispatch]);
  const doctorId = params.id as string;

  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorProfileById(doctorId));
      dispatch(fetchPostsFromDoctor(doctorId));
    }
  }, [dispatch, doctorId]);

  useEffect(() => {
    if (profile && currentUserId) {
      setIsSubscribed(profile.followers.includes(currentUserId));
      setSubscriberCount(profile.followers.length);
    }
  }, [profile, currentUserId]);

  const handleSubscribeToggle = async () => {
    const doctorId = params.id as string;
    if (isSubscribed) {
      await dispatch(unsubscribeFromDoctor(doctorId));
      setSubscriberCount((prev) => prev - 1);
    } else {
      await dispatch(subscribeToDoctor(doctorId));
      setSubscriberCount((prev) => prev + 1);
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
    <div className="relative w-[340px]">
      <Card className="max-w-[340px] h-40 fixed">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar
              isBordered
              radius="full"
              size="md"
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
            size="sm"
            variant={isSubscribed ? "bordered" : "solid"}
            onPress={handleSubscribeToggle}
          >
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
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
            <p className=" text-default-400 text-small">Following</p>
          </div>
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">
              {subscriberCount}
            </p>
            <p className="text-default-400 text-small">Followers</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
