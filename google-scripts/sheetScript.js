function createAndPopulateSheet(sheetConfig, sheetData) {
    const sheetTitle = sheetConfig.title;
    const columnNames = sheetConfig.columns;
    const data = Object.values(sheetData);
  
    const spreadsheet = SpreadsheetApp.create(sheetTitle);
    const sheet = spreadsheet.getActiveSheet();
    
    // Set column headers
    sheet.getRange(1, 1, 1, columnNames.length).setValues([columnNames]);
  
    // Populate rows
    const numRows = data[0].length;
    const numCols = columnNames.length;
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      const row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(data[j][i]);
      }
      rows.push(row);
    }
    sheet.getRange(2, 1, numRows, numCols).setValues(rows);
  
    Logger.log(`Created and populated sheet with ID: ${spreadsheet.getId()}`);
    return spreadsheet.getId();
  }
  