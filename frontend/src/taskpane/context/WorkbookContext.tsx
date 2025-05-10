import React, { createContext, useContext, useState } from "react";
import { Status } from "../types/common.types";

export interface QueryResponse {
  content: {
    message: string;
    debugInfo: Record<string, any>;
  };
  status: Status | null;
}

export interface WorkbookContextProps {
  selectedColumn: string | null;
  setSelectedColumn: (col: string | null) => void;

  worksheetData: any[][];
  setWorksheetData: (data: any[][]) => void;

  selectedColumnStatus: Status | null;
  setSelectedColumnStatus: (s: Status | null) => void;

  worksheetDataStatus: Status | null;
  setWorksheetDataStatus: (s: Status | null) => void;

  availableHeaders: string[];
  setAvailableHeaders: (headers: string[]) => void;

  queryResponse: QueryResponse | null;
  setQueryResponse: (res: QueryResponse | null) => void;
}

const WorkbookContext = createContext<WorkbookContextProps | undefined>(undefined);

export const WorkbookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [worksheetData, setWorksheetData] = useState<any[][]>([]);
  const [selectedColumnStatus, setSelectedColumnStatus] = useState<Status | null>(null);
  const [worksheetDataStatus, setWorksheetDataStatus] = useState<Status | null>(null);
  const [availableHeaders, setAvailableHeaders] = useState<string[]>([]);
  const [queryResponse, setQueryResponse] = useState<QueryResponse | null>(null);

  return (
    <WorkbookContext.Provider
      value={{
        selectedColumn,
        setSelectedColumn,
        worksheetData,
        setWorksheetData,
        selectedColumnStatus,
        setSelectedColumnStatus,
        worksheetDataStatus,
        setWorksheetDataStatus,
        availableHeaders,
        setAvailableHeaders,
        queryResponse,
        setQueryResponse,
      }}
    >
      {children}
    </WorkbookContext.Provider>
  );
};

export const useWorkbook = () => {
  const context = useContext(WorkbookContext);
  if (!context) {
    throw new Error("useWorkbook must be used within a WorkbookProvider");
  }
  return context;
};
