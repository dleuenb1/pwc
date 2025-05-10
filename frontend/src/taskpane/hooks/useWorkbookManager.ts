import { useEffect, useState, useCallback, useRef } from "react";
import { useWorkbook } from "../context/WorkbookContext";
import { getTablesHeaders, getTablesData } from "../actions/excel.actions";
import { ValidationResult } from "../types/common.types";

const validateHeaders = (headers: string[][]): ValidationResult<string[]> => {
  if (headers.length !== 1) {
    return {
      status: {
        type: "error",
        message:
          headers.length === 0
            ? "❌ Nie znaleziono tabel."
            : "❌ W skoroszycie musi być dokładnie jedna tabela z nagłówkami.",
      },
    };
  }

  const extracted = headers[0];
  return {
    result: extracted,
    status: {
      type: "info",
      message: `✔️ Nagłówki: ${extracted.join(", ")}`,
    },
  };
};

const validateTableData = (tablesData: any[][][]): ValidationResult<any[][]> => {
  if (tablesData.length !== 1) {
    return {
      status: {
        type: "error",
        message:
          tablesData.length === 0
            ? "❌ Brak danych w tabeli."
            : "❌ W arkuszu jest więcej niż jedna tabela.",
      },
    };
  }

  const data = tablesData[0];
  return {
    result: data,
    status: {
      type: "info",
      message: `✔️ Załadowano ${data.length} wierszy.`,
    },
  };
};

const validateSelectedColumn = (col: string | null): ValidationResult<string | null> => {
  if (!col) {
    return {
      result: null,
      status: {
        type: "error",
        message: "❌ Nie wybrano kolumny.",
      },
    };
  }

  return {
    result: col,
    status: {
      type: "info",
      message: `✔️ Wybrano kolumnę: ${col}`,
    },
  };
};

const snapshot = (obj: any) => JSON.stringify(obj);

export const useWorkbookManager = () => {
  const {
    setWorksheetData,
    setWorksheetDataStatus,
    setSelectedColumn,
    setSelectedColumnStatus,
    setAvailableHeaders,
    worksheetData,
    selectedColumn,
    selectedColumnStatus,
    worksheetDataStatus,
  } = useWorkbook();

  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  const prevHeadersSnap = useRef<string>("");
  const prevHeadersStatus = useRef<string>("");
  const prevDataSnap = useRef<string>("");
  const prevDataStatus = useRef<string>("");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const headersRaw = await getTablesHeaders();
        const headersValidation = validateHeaders(headersRaw);
        const headersSnap = snapshot(headersValidation.result);

        if (headersSnap !== prevHeadersSnap.current) {
          prevHeadersSnap.current = headersSnap;
          setAvailableHeaders(headersValidation.result ?? []);
        }

        if (headersValidation.status.message !== prevHeadersStatus.current) {
          prevHeadersStatus.current = headersValidation.status.message;
          setSelectedColumnStatus(headersValidation.status);
        }

        if (!headersValidation.result) {
          setSelectedColumn(null);
          setIsReadyToSubmit(false);
          return;
        }

        const dataRaw = await getTablesData();
        const dataValidation = validateTableData(dataRaw);
        const dataSnap = snapshot(dataValidation.result);

        if (dataSnap !== prevDataSnap.current) {
          prevDataSnap.current = dataSnap;
          setWorksheetData(dataValidation.result ?? []);
        }

        if (dataValidation.status.message !== prevDataStatus.current) {
          prevDataStatus.current = dataValidation.status.message;
          setWorksheetDataStatus(dataValidation.status);
        }

        setIsReadyToSubmit(
          Boolean(
            selectedColumn &&
            dataValidation.result &&
            dataValidation.result.length > 0
          )
        );
      } catch (err: any) {
        setWorksheetData([]);
        setSelectedColumn(null);
        setIsReadyToSubmit(false);

        const errMsg = "❌ Błąd przy odczycie danych: " + err?.message;

        if (worksheetDataStatus?.message !== errMsg) {
          setWorksheetDataStatus({ type: "error", message: errMsg });
        }
        if (selectedColumnStatus?.message !== errMsg) {
          setSelectedColumnStatus({ type: "error", message: errMsg });
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedColumn]);

  const onSelectColumn = useCallback(
    (col: string | null) => {
      const validation = validateSelectedColumn(col);

      if (validation.status.message !== selectedColumnStatus?.message) {
        setSelectedColumn(validation.result ?? null);
        setSelectedColumnStatus(validation.status);
        setIsReadyToSubmit(
          Boolean(validation.result && worksheetData.length > 0)
        );
      }
    },
    [selectedColumnStatus, worksheetData]
  );

  return {
    onSelectColumn,
    isReadyToSubmit,
  };
};
