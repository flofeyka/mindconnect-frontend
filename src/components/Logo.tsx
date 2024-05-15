import Icon from "./Icon";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <Icon width="43px" height="18px" color="bg-primary" path="/logo.svg" />
      <h4 className="text-2xl font-semibold">mindconnect</h4>
    </div>
  );
};

export default Logo;
