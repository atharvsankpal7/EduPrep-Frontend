import type { SubmitTestPayload } from "@/types/global/interface/test.apiInterface";

interface SubmitWithRecoveryArgs {
  submitted: boolean;
  controlsLocked: boolean;
  payload: SubmitTestPayload;
  onSubmit: (payload: SubmitTestPayload) => Promise<void>;
  setControlsLocked: (locked: boolean) => void;
  setSubmitted: () => void;
}

export const submitWithRecovery = async ({
  submitted,
  controlsLocked,
  payload,
  onSubmit,
  setControlsLocked,
  setSubmitted,
}: SubmitWithRecoveryArgs): Promise<boolean> => {
  if (submitted || controlsLocked) {
    return false;
  }

  setControlsLocked(true);

  try {
    await onSubmit(payload);
    setSubmitted();
    return true;
  } catch (error) {
    setControlsLocked(false);
    throw error;
  }
};
