import Icon from "./Icon";

export default function Vector({
  className = "",
  color,
}: {
  className?: string;
  color?: string;
}) {
  return (
    <span className={className}>
      <Icon
        path="/icons/Vector.svg"
        color={color}
        width="15px"
        height="15px"
      />
    </span>
  );
}
