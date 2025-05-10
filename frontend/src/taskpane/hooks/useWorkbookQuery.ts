import { useState } from "react";
import { useWorkbook } from "../context/WorkbookContext";

export interface WorksheetQueryRequest {
  column: string;
  data: Array<{ [key: string]: any }>;
}

const transformData = (
    headers: string[],
    data: any[][],
    column: string
  ): WorksheetQueryRequest => {
    const objects = data.map((row) => {
      const obj: Record<string, any> = {};
      headers.forEach((key, index) => {
        obj[key] = row[index];
      });
      return obj;
    });

    return {
      column,
      data: objects,
    };
};

export const useWorksheetQuery = () => {
  const {
    worksheetData,
    selectedColumn,
    availableHeaders,
    setQueryResponse,
  } = useWorkbook();

  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    setQueryResponse(null);

    try {
      if (!worksheetData.length || !selectedColumn || !availableHeaders.length) {
        throw new Error("Brak danych, nagłówków lub wybranej kolumny.");
      }

      const payload = transformData(availableHeaders, worksheetData, selectedColumn);

      const response = await fetch("https://api.example.com/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      setQueryResponse({
        content: {
          message: result.message,
          debugInfo: result.debugInfo,
        },
        status: {
          type: "info",
          message: "✔️ Odpowiedź z serwera odebrana.",
        },
      });
    } catch (error: any) {
      setQueryResponse({
        content: {
          message: error.message,
          debugInfo: {},
        },
        status: {
          type: "error",
          message: `❌ Błąd: ${error.message}`,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return { send, loading };
};