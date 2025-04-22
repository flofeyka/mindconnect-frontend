'use client';
import LoadingButton from "@components/LoadingButton";
import { usersDataType } from "@lib/types";
import { ArrowLeft } from "lucide-react";
import { resolve } from "path";
import { useEffect, useState } from "react";
import { Channel, UserResponse } from "stream-chat";
import {
  Avatar,
  useChatContext,
  LoadingChannels as LoadingUsers,
} from "stream-chat-react";

interface UsersMenuProps {
  user: usersDataType;
  onClose: () => void;
  onChannelSelected: () => void;
}

export default function UsersMenu({
  user,
  onClose,
  onChannelSelected,
}: UsersMenuProps) {
  const { client, setActiveChannel } = useChatContext();

  const [users, setUsers] = useState<(UserResponse & { image?: string })[]>();

  const [moreUsersLoading, setMoreUsersLoading] = useState(false);

  const [endOfPaginationReached, setEndOfPaginationReached] =
    useState<boolean>();

  const pageSize = 2;

  useEffect(() => {
    async function loadInitialUsers() {
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const response = await client.queryUsers(
          {
            id: { $ne: user.id },
          },
          { id: 1 },
          { limit: pageSize + 1 }
        );
        setUsers(response.users.slice(0, pageSize));
        setEndOfPaginationReached(response.users.length <= pageSize);
      } catch (error) {
        console.error(error);
        alert("Error loading users");
      }
    }
    loadInitialUsers();
  }, [client, user.id]);

  async function loadMoreUsers() {
    setMoreUsersLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const lastUserId = users?.[users.length - 1].id;

      if (!lastUserId) return;

      const response = await client.queryUsers(
        {
          $and: [{ id: { $ne: user.id } }, { id: { $gt: lastUserId } }],
        },
        { id: 1 },
        { limit: pageSize + 1 }
      );
      console.log(response);
      setUsers([...users, ...response.users.slice(0, pageSize)]);
      setEndOfPaginationReached(response.users.length <= pageSize);
    } catch (error) {
      console.error(error);
      alert("Error loading users");
    } finally {
      setMoreUsersLoading(false);
    }
  }

  function handleChannelSelected(channel: Channel) {
    setActiveChannel(channel);
    onChannelSelected();
  }

  async function startChatWithUser(userId: string) {
    try {
      const channel = client.channel("messaging", {
        members: [userId, user.id],
      });
      await channel.create();
      handleChannelSelected(channel);
    } catch (error) {
      console.error(error);
      alert("Error channel creating");
    }
  }

  return (
    <div className=" str-chat bg-white absolute z-10 h-full w-full border-e-[#DBDDE1]">
      <div className="flex items-center gap-3 text-lg font-bold text-black">
        <ArrowLeft onClick={onClose} className="cursor-pointer" color="black" />{" "}
        Users
      </div>
      <div>
        {!users && <LoadingUsers />}
        {users?.map((user) => (
          <UserResult
            user={user}
            onUserClicked={startChatWithUser}
            key={user.id}
          />
        ))}
        {endOfPaginationReached === false && (
          <LoadingButton
            loading={moreUsersLoading}
            className="m-auto mb-3 w-[80%]"
            onClick={loadMoreUsers}
          >
            Load more users
          </LoadingButton>
        )}
      </div>
    </div>
  );
}

interface UserResultProps {
  user: UserResponse & { image?: string };
  onUserClicked: (userId: string) => void;
}

function UserResult({ user, onUserClicked }: UserResultProps) {
  return (
    <button
      className=" mb-3 w-full flex items-center p-2 gap-2 hover:bg-[#e9eaed]"
      onClick={() => onUserClicked(user.id)}
    >
      <span>
        <Avatar image={user.image} name={user.name || user.id} size={40} />
      </span>
      <span className=" whitespace-nowrap overflow-hidden text-ellipsis text-black">
        {user.name || user.id}
      </span>
      {user.online && (
        <span className="text-xs" color="primary">
          Online
        </span>
      )}
    </button>
  );
}
