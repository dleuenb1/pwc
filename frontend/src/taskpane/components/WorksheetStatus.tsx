import React from "react";
import { useWorkbook } from "../context/WorkbookContext";
import { Text } from "@fluentui/react-components";
import { useCommonStyles } from "../styles/common.styles";

const WorkbookStatusBar: React.FC = () => {

    const commonStyles = useCommonStyles();
    const { selectedColumnStatus, worksheetDataStatus } = useWorkbook();

    const renderStatus = (status: typeof selectedColumnStatus | null) => {
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
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column" }}>
            {renderStatus(worksheetDataStatus)}
            {renderStatus(selectedColumnStatus)}
        </div>
    );
};

export default WorkbookStatusBar;
