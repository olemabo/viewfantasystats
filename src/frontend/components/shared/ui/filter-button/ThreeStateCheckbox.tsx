import React from "react";

import "./filter-button.css";

type ThreeStateCheckboxProps = {
  checked: boolean;
  mustBeInSolution: boolean;
  buttonText: string;
  onclick: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  labelClassName?: string;
};

export const ThreeStateCheckbox = ({
  checked,
  mustBeInSolution,
  buttonText,
  onclick,
  labelClassName = "filter-button",
}: ThreeStateCheckboxProps) => {
  let defaultFilter = "can-be-in-solution";

  if (!checked) {
    defaultFilter = "not-in-solution";
  } else if (mustBeInSolution) {
    defaultFilter = "must-be-in-solution";
  }

  return (
    <div className={`three-state-checkbox-container ${labelClassName}`}>
      <span
        className={`checkbox ${defaultFilter}`}
        onClick={onclick}
        id={buttonText}
      >
        {buttonText.charAt(0) + buttonText.substring(1).toLocaleLowerCase()}
      </span>
    </div>
  );
};

export default ThreeStateCheckbox;
