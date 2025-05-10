import React from "react";
import { Dropdown, Option, Text } from "@fluentui/react-components";
import { useWorkbook } from "../context/WorkbookContext";
import { useWorkbookManager } from "../hooks/useWorkbookManager";
import { useCommonStyles } from "../styles/common.styles";

const HeaderSelector: React.FC = () => {
  const commonStyles = useCommonStyles();

  const {
    selectedColumn,
    availableHeaders,
  } = useWorkbook();

  const { onSelectColumn } = useWorkbookManager();

  return (
    <div className={commonStyles.columnContainer}>
      <Text weight="semibold">Wybierz kolumnę z tabeli</Text>

      <Dropdown
        placeholder="Wybierz nagłówek"
        value={selectedColumn ?? ""}
        onOptionSelect={(_, data) => onSelectColumn(data.optionValue)}
        disabled={availableHeaders.length === 0}
        style={{ width: 240 }}
      >
        {availableHeaders.map((header) => (
          <Option key={header} value={header}>
            {header}
          </Option>
        ))}
      </Dropdown>
    </div>
  );
};

export default HeaderSelector;