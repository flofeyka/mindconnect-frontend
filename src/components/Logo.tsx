import Icon from "./Icon";

const Logo = ({ title = true }: { title?: boolean }) => {
  return (
    <div className="flex items-center gap-3">
      <Icon width="43px" height="18px" color="bg-primary" path="/logo.svg" />
      {title && <h4 className="text-2xl font-semibold">mindconnect</h4>}{" "}
    </div>
  );
};

export default Logo;
