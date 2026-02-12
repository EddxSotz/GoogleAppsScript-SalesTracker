function doGet () {
  return HtmlService.createHtmlOutputFromFile("index");
}

function sendSaleToSheet(formData){
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(formData.sheet);
  const now = new Date();

  sheet.appendRow([
    now.toLocaleDateString(),
    now.toLocaleTimeString(),
    now.toLocaleString('default', {month: 'long'}),
    formData.sheet,
    formData.name,
    formData.category,
    formData.quantity,
    formData.status,
    formData.price,
    formData.saleId
  ]);

  return "Data saved";
}

function getInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const productSheet = ss.getSheetByName("Products List");
  const allData = productSheet.getDataRange().getValues();
  const headers = allData.shift();
  const sheetNames = ss.getSheets().map(s => s.getName());

  return {
    headers: headers,
    products: allData,
    validSheets: sheetNames
  };
}

function getSalesStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const allSheets = ss.getSheets();
  const stats = [];

  allSheets.forEach(sheet => {
    const name = sheet.getName();
    if (name !== "Products List") {
      const saleCount = Math.max(0, sheet.getLastRow() - 1);
      stats.push({
        storeName: name,
        count: saleCount
      });
    }
  });

  return stats;
}

function findSale(sheetNameSelected,saleId ) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetNameSelected);
  const lastRow = sheet.getLastRow();
  let saleData = { found: false };

  for (let i=lastRow; i>= (lastRow-100); i--) {

    if(sheet.getRange(i,10).getDisplayValue() == saleId) {
      saleData.found = true;
      saleData.row = i;
      saleData.store = sheet.getRange(i,4).getValue();
      saleData.product = sheet.getRange(i,5).getValue();
      saleData.category = sheet.getRange(i,6).getValue();
      saleData.quantity = sheet.getRange(i,7).getValue();
      saleData.status = sheet.getRange(i,8).getValue();
      saleData.price = sheet.getRange(i, 9).getValue();
      return saleData;
    }
  }
  return saleData;
}

function editSale(sheetNameSelected, saleNewData, saleRowIndex){
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetNameSelected);
  const rowOfSale = saleRowIndex;

  sheet.getRange(rowOfSale,4).setValue(saleNewData.store);
  sheet.getRange(rowOfSale,5).setValue(saleNewData.product);
  sheet.getRange(rowOfSale,6).setValue(saleNewData.category);
  sheet.getRange(rowOfSale,7).setValue(saleNewData.quantity);
  sheet.getRange(rowOfSale,8).setValue(saleNewData.status);

  return rowOfSale;
}
