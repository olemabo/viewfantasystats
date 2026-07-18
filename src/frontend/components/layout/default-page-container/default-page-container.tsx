"use server";

import React, { CSSProperties } from "react";
import { MessageErrorLoading } from "../../shared/messages/messages";
import { Spinner } from "../../shared/ui/spinner/Spinner";
import {
  ErrorLoading,
  isEmptyErrorLoadingState,
} from "../../../models/shared/errorLoading";

type DefaultPageContainerProps = {
  heading: string;
  pageClassName?: string;
  children?: React.ReactNode;
  renderTitle?: () => React.ReactNode;
  errorLoading?: ErrorLoading;
  isLoading?: boolean;
  pageTitle?: string;
  style?: CSSProperties;
};

export default async function DefaultPageContainer({
  heading,
  pageClassName = "",
  children,
  renderTitle,
  errorLoading,
  isLoading,
  pageTitle,
  style,
}: DefaultPageContainerProps) {
  return (
    <div style={style} className={pageClassName} key={`${heading}-container`}>
      {renderTitle ? renderTitle() : pageTitle && <h1>{pageTitle}</h1>}
      {isLoading ? (
        <Spinner />
      ) : isEmptyErrorLoadingState(errorLoading) ? (
        children
      ) : (
        <MessageErrorLoading errorLoading={errorLoading} />
      )}
    </div>
  );
}
