import { Button, Spinner } from "@nextui-org/react";
import { ComponentPropsWithoutRef } from "react";

interface LoadingButtonProps extends ComponentPropsWithoutRef<"button"> {
  loading: boolean;
  onClick: () => void;
}

export default function LoadingButton({
  loading,
  onClick,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      color="primary"
      isDisabled={loading}
      className="w-[200px]"
      onClick={onClick}
    >
      {loading ? <Spinner color="default" /> : props.children}
    </Button>
  );
}
