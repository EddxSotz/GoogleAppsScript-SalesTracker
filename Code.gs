function doGet () {
  return HtmlService.createHtmlOutputFromFile("index");
}

function getSheetsNames() {
  const allSheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  const allActiveSheetsNames =[]
  for (const sheet of allSheets) {
    const getCurrentSheetName = sheet.getName();
       allActiveSheetsNames.push(getCurrentSheetName);
  }
  return allActiveSheetsNames;
}

function sendSaleToSheet(formData){
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(formData.sheet);

    const fullDateAndTime = new Date();
    const dateOnly = fullDateAndTime.toLocaleDateString('default', {year:'numeric', month:'numeric', day:'numeric'});
    const timeOnly = fullDateAndTime.toLocaleTimeString();
    const monthOnly = fullDateAndTime.toLocaleString('default', {month: 'long'});

    sheet.appendRow([dateOnly,timeOnly,monthOnly, formData.sheet, formData.name, formData.category, formData.quantity,formData.status, formData.price,formData.saleId]);

    return "Data saved"
}

function getProductsList(){
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("Products List");
  const fullDataRange = sheet.getDataRange();
  const numRows = fullDataRange.getNumRows();
  const numColumns = fullDataRange.getNumColumns();

  if (numRows <= 1) {
    return []; // Return an empty array if no data rows
  }
  const dataRangeWithoutHeaders = sheet.getRange(2, 1, numRows - 1, numColumns);
  const data = dataRangeWithoutHeaders.getValues();
  Logger.log(data);
  return data;
}

function getProductHeaders(){
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("Products List");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  Logger.log(headers);
  return headers;
}

function findSale(sheetNameSelected,saleId ) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetNameSelected);
  const lastRow = sheet.getLastRow();
  let saleData={row:0,store:"", product:"", category: "", quantity:"", status:"", price:0};

  for (let i=lastRow; i>= (lastRow-100); i--) {

    if(sheet.getRange(i,11).getDisplayValue() == saleId) {
      saleData.row = i;
      saleData.store = sheet.getRange(i,4).getValue();
      saleData.product = sheet.getRange(i,5).getValue();
      saleData.category = sheet.getRange(i,6).getValue();
      saleData.quantity = sheet.getRange(i,7).getDisplayValue();
      saleData.status = sheet.getRange(i,8).getDisplayValue();
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
