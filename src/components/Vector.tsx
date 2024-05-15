import Icon from "./Icon";

export default function Vector({
  className,
  color,
}: {
  className?: string;
  color?: string;
}) {
  return (
    <span className={className}>
      <Icon
        path="../../../public/icon/auth/Vector.svg"
        color={color}
        width="13"
        height="13"
      />
    </span>
  );
}
