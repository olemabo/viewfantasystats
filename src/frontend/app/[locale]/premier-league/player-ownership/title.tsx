import Popover from "@/components/shared/popover/popover";
import { getTranslations } from "next-intl/server";

export default async function Title() {
  const t = await getTranslations("Statistics.PlayerOwnership");
  const ownershipDescription = t("OwnershiptDescriptionFPL");

  return (
    <h1>
      {t("Title")}
      <Popover
        popoverTitle={t("Title")}
        iconSize={14}
        iconPosition={[-10, 0, 0, 3]}
        alignLeft
      >
        {ownershipDescription}
      </Popover>
    </h1>
  );
}
