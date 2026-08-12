"use client";

import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";

type ToggleButtonProps = {
  gwNumber: number;
  label: string;
  direction: "left" | "right";
};

export default function ToggleButton({
  gwNumber,
  label,
  direction,
}: ToggleButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.replace(`?gw=${gwNumber}`, { scroll: false });
  };

  return (
    <button onClick={handleClick}>
      {direction === "left" ? <ArrowBack /> : null}
      <span>
        {label} {gwNumber}
      </span>
      {direction === "right" ? <ArrowForward /> : null}
    </button>
  );
}
