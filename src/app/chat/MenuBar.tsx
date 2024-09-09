import Profile from "@containers/dashboard/profile/Profile";
import { usersDataType } from "@lib/types";
import { Avatar, Tooltip } from "@nextui-org/react";
import { Users } from "lucide-react";

interface MenubarProps {
  user: usersDataType;
  onUserMenuClick: () => void;
}

export default function Menubar({ user, onUserMenuClick }: MenubarProps) {
  return (
    <div className="bg-white p-3 flex items-center justify-between border-e border-e-[#dbdde1]">
      <Avatar src={user.image} size="md" />
      <div className="flex gap-6 ">
        <Tooltip content="Show users" placement="bottom">
          <Users
            className="cursor-pointer"
            color="black"
            onClick={onUserMenuClick}
          />
        </Tooltip>
      </div>
    </div>
  );
}
