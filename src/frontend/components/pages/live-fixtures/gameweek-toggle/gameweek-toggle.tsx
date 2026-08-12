import ToggleButton from "./button";
import { getTranslations } from "next-intl/server";
import { GameWeeks } from "../live-fixtures";

export default async function GameWeekToggle({
  current,
  previous,
  next,
}: GameWeeks) {
  const g = await getTranslations("General");
  const gwLabel = g("gw");

  return (
    <div className="round-container">
      <div className="toggle-button left">
        {previous > 0 && (
          <ToggleButton gwNumber={previous} label={gwLabel} direction="left" />
        )}
      </div>
      <h2>
        {gwLabel} {current}
      </h2>
      <div className="toggle-button right">
        {next > 0 && (
          <ToggleButton gwNumber={next} label={gwLabel} direction="right" />
        )}
      </div>
    </div>
  );
}
