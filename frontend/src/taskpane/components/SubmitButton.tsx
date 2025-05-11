import React from "react";
import {Button, Spinner, Text} from "@fluentui/react-components";
import {useWorksheetQuery} from "../hooks/useWorkbookQuery";
import {useWorkbookManager} from "../hooks/useWorkbookManager";
import {useCommonStyles} from "../styles/common.styles";
import {useWorkbook} from "../context/WorkbookContext";
import {Status} from "../types/common.types";

const SubmitButton: React.FC = () => {
    const commonStyles = useCommonStyles();
    const {isReadyToSubmit} = useWorkbookManager();
    const {send, loading} = useWorksheetQuery();
    const {queryResponse} = useWorkbook();

    const renderStatus = (status: Status | null) => {
        if (!status) return null;
        return (
            <Text
                size={200}
                style={{
                    marginBottom: 4,
                    color: status.type === "error" ? "red" : "green",
                }}
                className={commonStyles.textWrap}
            >
                {status.message}
            </Text>
        );
    };

    return (
        <div className={commonStyles.columnContainer}>
            <Button
                appearance="primary"
                onClick={send}
                disabled={!isReadyToSubmit || loading}
            >
                {loading ? <Spinner size="tiny" label="Wysyłanie..."/> : "Wyślij dane"}
            </Button>
            {renderStatus(queryResponse?.status)}
        </div>
    );
};

export default SubmitButton;
