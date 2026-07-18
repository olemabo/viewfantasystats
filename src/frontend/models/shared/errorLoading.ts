import { MessageType, emptyState } from "../../components/shared/messages/messages";

export type ErrorLoading = {
    messageType: MessageType;
    errorMessage: string;
}

export const emptyErrorLoadingState: ErrorLoading = {
    messageType: 'empty',
    errorMessage: '',
}

export const isEmptyErrorLoadingState = (state: ErrorLoading | undefined): boolean => {
    if (state === undefined) {
        return true;
    }
    return state.messageType === emptyState && !state.errorMessage;
}