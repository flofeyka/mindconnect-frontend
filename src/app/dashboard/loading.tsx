import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="absolute top-1/2 left-1/2 ">
      <Spinner size="lg" />
    </div>
  );
}
