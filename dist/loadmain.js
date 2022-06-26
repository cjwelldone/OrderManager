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


//https://developers.google.com/apps-script/guides/dialogs
// add a custom menu in the top menu bar
// adds an Item to the Menu Erweiterung

function onOpen () {
  createMenu_()
} 

function createMenu_ () {
  SpreadsheetApp.getUi()
  .createMenu('Custom Menu')
  .addItem("Open Main", "loadMain")
  .addToUi()
}