import Popover from "./popover/popover";

interface PageHeaderWithPopoverProps {
  title: string;
  description: string;
  iconSize?: number;
  iconPosition?: [number, number, number, number];
  alignLeft?: boolean;
}

export default function PageHeaderWithPopover({
  title,
  description,
  iconSize = 14,
  iconPosition = [-10, 0, 0, 3],
  alignLeft = true,
}: PageHeaderWithPopoverProps) {
  return (
    <h1>
      {title}
      <Popover
        popoverTitle={title}
        iconSize={iconSize}
        iconPosition={iconPosition}
        alignLeft={alignLeft}
      >
        {description}
      </Popover>
    </h1>
  );
}
