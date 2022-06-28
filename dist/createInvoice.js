function createInvoice (id){

  const trashfolderId = PropertiesService.getScriptProperties().getProperty('trashfolderId')
  const templateInvoicefileID = PropertiesService.getScriptProperties().getProperty('templateInvoicefileID')
  const templateInvoicefileNoVatID = PropertiesService.getScriptProperties().getProperty('templateInvoicefileNoVatID')
  const invoiceFolderID = PropertiesService.getScriptProperties().getProperty('invoiceFolderID')

  // get the invoice folder - id is set up in globals 
  const invoiceFolder = DriveApp.getFolderById(invoiceFolderID)
  const invoiceTemplate = DriveApp.getFileById(templateInvoicefileID)
  const invoiceNoVatTemplate = DriveApp.getFileById(templateInvoicefileNoVatID)

/*--------------------------------------------------------- UserData ----------------------------------------------------------------------------*/
// get UserData with getUserData()

    const userInfo = getUserData()


/*------------------------------------------------------ Create Temp Doc  ----------------------------------------------------------------*/
// check in UserData if noVat is true - according to setting assign one of the two provided templates
let tempFile
// make copy of templatefile

if(userInfo.noVatOnInvoice === 'true') {
  tempFile = invoiceNoVatTemplate.makeCopy();
} else {
  tempFile = invoiceTemplate.makeCopy();
}

  // open the file
  const openDoc = DocumentApp.openById(tempFile.getId());
  // get the body
  const body = openDoc.getBody();
  // get the footer
  const footer = openDoc.getFooter()
  // get all tables of the document
  const documentTables = body.getTables()
  // The template Doc has 2 Tables:
  // documentTables[0] returns the headerdata table
  // documentTables[1] returns the articleoverview table
  const articleTable = documentTables[1]
  
/*-------------------------------------------  OrderData -------------------------------------------------------------------*/
// // get the orderData and write to cells append to tablerow

// orderNumber to be found in the function args
  
  const orderNumber = id.toString()
  const data =  getOrderByOrderNumber(orderNumber)

// Currency Format
  const options= { style: 'currency', currency: 'EUR' }

// get the invoiceAmount
  const invoiceAmount = data.orderData[0][7].toLocaleString('de-DE', options)
  
// check VAT amounts
  let invoiceNETAmount19 = ''
  let invoiceNETAmount07 = ''
  let ustText19 = ''
  let ustText7 = ''

  if(data.orderData[0][8].length > 0 && data.orderData[0][8] !== '0.00'  ) {
     invoiceNETAmount19 = data.orderData[0][8]
     ustText19 = 'enthaltene USt. 19%'
  }
  if(data.orderData[0][9].length > 0 && data.orderData[0][9] !== '0.00') {
      invoiceNETAmount07 = data.orderData[0][9]
      ustText7 = 'enthaltene USt. 7%'
  }

// get the invoicenumber
const invoiceNumber = returnInvoiceNumber()

// construct the product table on the invoice
  const arr = data.orderData
  arr.forEach(r=>{
    const product = r[3]
    const quantity = r[4].toString()
    const price = r[5].toLocaleString('de-DE', options)
    const total = r[6].toLocaleString('de-DE', options)
    
    // create new TR element
    const tr = articleTable.appendTableRow();
    
    // Style the TD element by getting the child
  
    // Define a custom style for TD
    const style = {};
    style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] =
        DocumentApp.HorizontalAlignment.CENTER
    style[DocumentApp.Attribute.BOLD] = false
      
    // get the TD & insert DATA
    const td0 = tr.appendTableCell(product)
    const td1 = tr.appendTableCell(price)
    if(userInfo.noVatOnInvoice !== 'true') {
      const vat = r[11].toString()
      tr.appendTableCell(vat).getChild(0).editAsText().setAttributes(style)
    }
    const td3 = tr.appendTableCell(quantity)
    const td4 = tr.appendTableCell(total)

    // Apply the custom style
    td0.getChild(0).editAsText().setAttributes(style)
    td1.getChild(0).editAsText().setAttributes(style)
    td3.getChild(0).editAsText().setAttributes(style)
    td4.getChild(0).editAsText().setAttributes(style)

  })

/*------------------------------------------- CustomerData -------------------------------------------------------------------*/
// get CustomerData with getCustomerData(customerID)

// id to be found in provided order array 
    const customerIDinOrderTable = 10
    const customerId = data.orderData[0][customerIDinOrderTable].toString()
    const customerInfos = getCustomerByID(customerId)
    
    // Replace the vars of the body of the invoice

    // Build a table from the array for productdata
    body.replaceText('{RNR}', invoiceNumber)
    body.replaceText('{Bestellnummer}', data.orderNumber)
    body.replaceText('{Datum}', createTimeStamp().toDateString())
    body.replaceText('{TotalTotal}', invoiceAmount)
  
    body.replaceText('{VAT7}', invoiceNETAmount07)
    body.replaceText('{VAT19}', invoiceNETAmount19)
    body.replaceText('{ust7}', ustText7)
    body.replaceText('{ust19}', ustText19)

    body.replaceText('{company}',customerInfos.company)
    body.replaceText('{first}', customerInfos.first)
    body.replaceText('{last}', customerInfos.last)
    body.replaceText('{Nummer}',customerInfos.number.toString())
    body.replaceText('{Strasse}',customerInfos.street)
    body.replaceText('{Stadt}',customerInfos.city)
    body.replaceText('{PLZ}',customerInfos.zip.toString())

/*---------------------------------------------------- UserData  Build Table on Doc --------------------------------------------------------------*/
    // Build a table from the array for productdata
    footer.replaceText('{userCompany}', userInfo.company)
    footer.replaceText('{userFirstName}', userInfo.firstName)
    footer.replaceText('{userLastName}', userInfo.lastName)
    footer.replaceText('{userFon}', userInfo.fon)
    footer.replaceText('{userEmail}', userInfo.email)
    footer.replaceText('{bankaccount}', userInfo.bankaccount)
    footer.replaceText('{iban}', userInfo.iban)
    footer.replaceText('{bic}',userInfo.bic)
    footer.replaceText('{userStrasseNummer}',userInfo.number.toString())
    footer.replaceText('{userStrasse}',userInfo.street)
    footer.replaceText('{userOrt}',userInfo.city)
    footer.replaceText('{userPlz}',userInfo.zip.toString())
    footer.replaceText('{steuernummer}',userInfo.taxnumber)
    footer.replaceText('{ustID}',userInfo.vatId)
    body.replaceText('{textblock1}',userInfo.textblock1)
    body.replaceText('{textblock2}',userInfo.textblock2)

/*-------------------------------------------------------Save and Close the doc-------------------------------------------------------------*/

  openDoc.saveAndClose();

/*-------------------------------------------- Update InvoiceNumber ------------------------------------------------------*/

  setNewInvoiceNumber()

/*-------------------------------------------- Create new PDF and save to Invoicefolder ------------------------------------------------------*/
  
// function returns pdf file (pdffile is the link to the document and in respinse cB the link is highlight in alert)
  const pdfFile = createPDF(tempFile,invoiceFolder)

// set InvoiceCreated Col to 1 
  // write pdfID url to order table returns the url of the pdf and the id of the pdf
  const dataPDF = setInvoiceCreatedTrue(orderNumber,pdfFile)

/*---------------------------------------- Move the tempoary file to Trash Folder & Remove ---------------------------------------------------*/
/* Remove all files from trash folder */

  moveFileToFolder (tempFile, trashfolderId)
  deleteFiles(trashfolderId)
  
  // returns an object: {pdfID: pdfID, urlPDF: urlPDF} 
  return dataPDF
}