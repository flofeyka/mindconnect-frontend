import type { FC } from "react";

import cn from "@helpers/cn";

interface IconProps {
  width: string;
  height: string;
  color?: string;
  path: string;
}

const Icon: FC<IconProps> = ({ width, height, color = "#FFFFFF", path }) => {
  return (
    <div
      className={cn(`icon`, color.charAt(0) !== "#" ? color : "")}
      style={{
        maskImage: `url("${path}")`,
        backgroundColor: color.charAt(0) === "#" ? color : "",
        width,
        height,
      }}
    ></div>
  );
};

export default Icon;
