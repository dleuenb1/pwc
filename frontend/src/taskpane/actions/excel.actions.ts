export async function processSingleTableAndSendToApi(): Promise<string> {
    try {
      return await Excel.run(async (context) => {
        const workbook = context.workbook;
        const tables = workbook.tables;
        tables.load("items/name");
        await context.sync();
  
        const tableCount = tables.items.length;
  
        if (tableCount === 0) {
          return "❌ Brak tabel w skoroszycie.";
        }
  
        if (tableCount > 1) {
          return "❌ W skoroszycie znajduje się więcej niż jedna tabela.";
        }
  
        const table = tables.items[0];
        const dataRange = table.getDataBodyRange();
        dataRange.load("values, rowCount, columnCount");
        await context.sync();
  
        const inputData: any[][] = dataRange.values;
  
        // Wywołanie API
        const response = await fetch("https://your-api-url.com/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: inputData }),
        });
  
        if (!response.ok) {
          return `❌ API zwróciło błąd: ${response.statusText}`;
        }
  
        const result = await response.json();
  
        if (!Array.isArray(result?.data)) {
          return "❌ Nieprawidłowy format odpowiedzi z API.";
        }
  
        const newData: any[][] = result.data;
  
        if (
          newData.length !== dataRange.rowCount ||
          newData[0].length !== dataRange.columnCount
        ) {
          return "❌ Rozmiar danych z API nie pasuje do tabeli.";
        }
  
        dataRange.values = newData;
        await context.sync();
  
        return "✔️ Tabela została zaktualizowana.";
      });
    } catch (error: any) {
      return `❌ Błąd: ${error?.message || "Nieznany problem"}`;
    }
  }

export async function getTablesHeaders(): Promise<string[][]> {
  return await Excel.run(async (context) => {
    const tables = context.workbook.tables;
    tables.load("items");
    await context.sync();

    const ranges = tables.items.map((table) => table.getHeaderRowRange());
    ranges.forEach((range) => range.load("values"));
    await context.sync();

    return ranges.map((range) => range.values[0].map((val) => String(val)));
  });
}

export async function getTablesData(): Promise<any[][][]> {
  return await Excel.run(async (context) => {
    const tables = context.workbook.tables;
    tables.load("items");
    await context.sync();

    const ranges = tables.items.map((table) => table.getDataBodyRange());
    ranges.forEach((range) => range.load("values"));
    await context.sync();

    return ranges.map((range) => range.values);
  });
}

  