import React from "react";
import { Button, Spinner } from "@fluentui/react-components";
import { useWorksheetQuery } from "../hooks/useWorkbookQuery";
import { useWorkbookManager } from "../hooks/useWorkbookManager";

const SubmitButton: React.FC = () => {
  const { isReadyToSubmit } = useWorkbookManager();
  const { send, loading } = useWorksheetQuery();

  return (
    <Button
      appearance="primary"
      onClick={send}
      disabled={!isReadyToSubmit || loading}
    >
      {loading ? <Spinner size="tiny" label="Wysyłanie..." /> : "Wyślij dane"}
    </Button>
  );
};

export default SubmitButton;
