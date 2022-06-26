// functions takes a sheetname: string as arg | returns a ws
function setSpreadsheet(sheetname){
  spreadSheetId = PropertiesService.getScriptProperties().getProperty('spreadSheetId')
  const ss = SpreadsheetApp.openById(spreadSheetId)
  SpreadsheetApp.setActiveSpreadsheet(ss);
  return ss.getSheetByName(sheetname)
}

// deprecated: returns array with customerdata from invoicecreator

function getCustomerData(id){
  const ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Customer')
  const lastrow = ss.getLastRow()
  customerdata = ss.getRange(2,1,lastrow,1).getValues()
  const index = customerdata.findIndex(r => r[0] == id)
  const indexRow = index + 2 // convert index to googlesheet rows
  customerDataSet = ss.getRange(indexRow,2,1,7).getValues()

  return customerDataSet
}

// returns the current invoiceNumber

function returnInvoiceNumber () {
  const invoiceNumber = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('InvoiceNumber').getRange('A1').getValue()
  return invoiceNumber
}

// sets new invoiceNumber

function setNewInvoiceNumber () {
  let invoiceNumber = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('InvoiceNumber').getRange('A1')
  const updatedInvoiceNumber = invoiceNumber.getValue() + 1
  invoiceNumber.setValue(updatedInvoiceNumber)
}

// sets new orderNumber

function setNewOrderNumber () {
  let orderNumber = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OrderNumber').getRange('A1')
  const updatedOrderNumber = orderNumber.getValue() + 1
  orderNumber.setValue(updatedOrderNumber)
}

// returns the current orderNumber
function returnOrderNumber () {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName('OrderNumber').getRange('A1').getValue()
}

// returns timestamp for database entry

function createTimeStamp () {
  return timestamp = new Date()
}

// returns unique id for each entry

function idSetter(ws){
  // get last Row of DataRange in worksheet
  const lastRow = ws.getLastRow()

  //define date and id for each entry
  let id = ws.getRange('A'+ lastRow).getValue()
  
  // create an ID for each entry
  if(id === 'ID'){
   id = 1 
  } else {
    id = id + 1
  }
 return id
}

//  Delete all the files in a folder // https://www.youtube.com/watch?v=9ZLp3e9ix3Y

function deleteFiles(trashfolderId) {
 
  const folder = DriveApp.getFolderById(trashfolderId)
  const files = folder.getFiles()
  while (files.hasNext()) {
    files.next().setTrashed(true)
  }
}

// recieves a file and a folder - move that file to that folder 

function moveFileToFolder (file, folderId) {

  const openFile = DriveApp.getFileById(file.getId());
  const folderTarget = DriveApp.getFolderById(folderId);
  openFile.moveTo(folderTarget)
}

// takes file and folder as args 
// creates a pdf file // returns the file

function createPDF(file, folder){
  const blobPDF = file.getAs(MimeType.PDF)
  const pdfFile = folder.createFile(blobPDF).setName('Rechnung_'+ createTimeStamp().toDateString().split(' ').join('_') + '' + '_Nr_' + (returnInvoiceNumber()-1).toString())
  return pdfFile 
}

// sendEmail(recipient, subject, body, options)  https://developers.google.com/apps-script/reference/mail/mail-app#sendemailrecipient,-subject,-body

function sendInvoiceByEmail (orderNumber) {
  // get all the data to construct email
    // PDF

  const orderData = getOrderByOrderNumber(orderNumber)
  // col in sheet "Order"
  const pdfFileIDCol = 15
  const pdfFileID = orderData.orderData[0][pdfFileIDCol-1]
  const pdfFile = DriveApp.getFileById(pdfFileID)
    // Customer
    // col userID in sheet Order
  const customerIdCol = 11
  const customerId = orderData.orderData[0][customerIdCol-1].toString()
  const customerInfos = getCustomerByID(customerId)
    
  const first = customerInfos.first
  const last = customerInfos.last
  const mailAdresse = customerInfos.email
  const subject = `Your Invoice is ready.`
  const emailBody = `Hello ${first} ${last}, thank you for your trust. You find your invoice attached to this email.`
  const attachment = pdfFile
  const optionsMail = {
      name: `Invoice_${orderNumber}`,
      attachments: [attachment]
  }

  try {
    MailApp.sendEmail(
    mailAdresse,
    subject,
    emailBody,
    optionsMail
    )
  } catch (err){
    console.log(err)
  }
    setEmailToSentTrue(orderNumber)

    return customerInfos.email
}

//   sets the InvoiceCreated value to 1 for an order

function setInvoiceCreatedTrue(orderNumber,pdfFile) {
  
  const urlPDF = pdfFile.getUrl()
  const urlDownloadPDF = pdfFile.getDownloadUrl()
  const pdfID = pdfFile.getId()

  const ws = setSpreadsheet('Order')
  const orderDataRange = ws.getRange(2,3,ws.getLastRow()-1,1).getValues().map(r=>r[0].toString())
  
  // define cols of order table
  const invoiceCreatedCol = 13
  const pdfIDCol = 15
  const pdfURLCol = 16
  const urlDownloadPDFCol = 17

  // set value of col invoiceCreatedCol to 1
  // save id of PDF, url, and download url
  orderDataRange.forEach((r,index)=>{
    if(r===orderNumber) {
      ws.getRange(index+2,invoiceCreatedCol,1,1).setValue([[1]])
      ws.getRange(index+2,pdfIDCol,1,1).setValue([[pdfID]])
      ws.getRange(index+2,pdfURLCol,1,1).setValue([[urlPDF]])
      ws.getRange(index+2,urlDownloadPDFCol,1,1).setValue([[urlDownloadPDF]])
    }
    return
  })
    const data = {pdfID: pdfID, urlPDF: urlPDF} 
    return data
}


//  sets the setEmailToSentTrue value to 1 for an order
  function setEmailToSentTrue(orderNumber) {
   
  const ws = setSpreadsheet('Order')
  // all orderNumbers
  const orderDataRange = ws.getRange(2,3,ws.getLastRow()-1,1).getValues().map(r=>r[0].toString())
  
  // define relevant cols of order table
  const emailSentCol = 14
  
  // set value of emailSentCol to 1
  orderDataRange.forEach((r,index)=>{
    if(r===orderNumber) {
      ws.getRange(index+2,emailSentCol,1,1).setValue([[1]])
    }
    return
  })
    
  return
}