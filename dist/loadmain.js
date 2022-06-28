// webapp 
function doGet(e) {
  return HtmlService.createTemplateFromFile('main')
      .evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent()
}

//creates a modal box 
function loadMain() {
  const htmlService = HtmlService.createTemplateFromFile('main')
  const html = htmlService.evaluate().setWidth(1500).setHeight(1000)
  const ui = SpreadsheetApp.getUi()
  ui.showModalDialog(html, 'Edit Data')
}

function onOpen () {
  createMenu_()
} 

function createMenu_ () {
  SpreadsheetApp.getUi()
  .createMenu('Order Manager')
  .addItem("Open Manager", "loadMain")
  .addToUi()
}