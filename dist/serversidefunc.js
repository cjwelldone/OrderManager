// TO DO 

// attention - get table of body of doc  is  pitfall because if anyone changes or deletes the first table- it ll break


// gets data of the spreadsheet and returns an array 

function getDataForSearch() {
  const ws = setSpreadsheet('Customer')
  return ws.getRange(2,1,ws.getLastRow()-1,4).getValues()
}

// gets product data of the spreadsheet and returns an array 

function getProductDataForSearch() {
  const ws = setSpreadsheet('Product')
  return ws.getRange(2,1,ws.getLastRow()-1,ws.getLastColumn()-1).getValues()
}

// gets order data of the spreadsheet and returns an array 

function getOrderDataForSearch() {
  const ws = setSpreadsheet('Order')
  const range = ws.getRange(2,1,ws.getLastRow()-1,ws.getLastColumn()).getValues()
  
  // only returning one row/order and the customer lastname
  
  const reducedData = range.reduce((array,row)=>{
    if (array.length == 0) {
      const customerID= row[10].toString()
      const customerData = getCustomerByID(customerID)
      const customerLastName = customerData.last
      
      array.push([row[2],row[7],row[12],row[13],customerLastName])
    }
    if (array.length > 0) {
      
      const customerID= row[10].toString()
      const customerData = getCustomerByID(customerID)
      const customerLastName = customerData.last
    
      if (array[array.length-1][0] !== row[2]) {
        array.push([row[2],row[7],row[12],row[13],customerLastName])
      }
    }
    return array
  },[])
  
  //content of array: [row[2]: ordernumber | row[7]: orderamount | row[12]: invoice created | row[13]: invoice sent | customerLastName
  
  return reducedData
}

// add order to table

function addOrder(data) {
  const ws = setSpreadsheet('Order')
  
  data.forEach(row=>{
      //add those elements to row 
      row.unshift(idSetter(ws),createTimeStamp(),returnOrderNumber())
      row.push(0,0) // set  col "invoicecreated" and invoicesent to 0 
      ws.appendRow(row)
    })
  setNewOrderNumber()
  return true
}

// get Order by getOrderByOrderNumber

function getOrderByOrderNumber(orderNumber) {
  const ws = setSpreadsheet('Order')
  const orderDataRange = ws.getRange(2,1,ws.getLastRow()-1,ws.getLastColumn()).getValues()
  
  // Reduce Method returns only rows with matching invoice number
  const orderData = orderDataRange.reduce((result, r)=>{
    if (r[2] == orderNumber) {
      result.push(r);
    }
    return result;
  }, []);
  
  return {orderNumber: orderNumber, orderData: orderData}
}


// add customer to table

function addCustomer(data) {
  const ws = setSpreadsheet('Customer')
  const id = idSetter(ws)
  const lastrow = ws.getLastRow()
  const lastcol = ws.getLastColumn()
  const range = ws.getRange(lastrow+1,1,1,lastcol)
  
  //set NumberFormat to string - to be able to work with leading zeros
  range.setNumberFormat("@")
  
  //append row does not work thats why setValues is used
  range.setValues([[
      id,
      data.company,
      data.first,
      data.last,
      data.street,
      data.number,
      data.zip,
      data.city,
      createTimeStamp(),
      data.email
    ]])
  return true
}

// delete data from table

function deleteByID(id) {
  const ws = setSpreadsheet('Customer')
  const custID = ws.getRange(2,1,ws.getLastRow()-1,1).getValues().map(r=>r[0].toString().toLowerCase())
  const index = custID.indexOf(id)
  const rowToDelete = index === -1 ? 0 : index+2
  ws.deleteRow(rowToDelete)
}

// get Customer by Id

function getCustomerByID(id) {
  const ws = setSpreadsheet('Customer')
  const custID = ws.getRange(2,1,ws.getLastRow()-1,1).getValues().map(r=>r[0].toString().toLowerCase())
  const index = custID.indexOf(id)
  const custRow = index === -1 ? 0 : index+2
  const customerData = ws.getRange(custRow,1,1,10).getValues()[0]
  return {
    custID: customerData[0],
    company: customerData[1],
    first: customerData[2],
    last: customerData[3],
    street: customerData[4],
    number: customerData[5],
    zip: customerData[6],
    city: customerData[7], 
    email: customerData[9] 
    }
}

// Update Customer Data

function updateCustomerByID(id, customerData) {
  const ws = setSpreadsheet('Customer')
  const custID = ws.getRange(2,1,ws.getLastRow()-1,1).getValues().map(r=>r[0].toString().toLowerCase())
  const index = custID.indexOf(id)
  const custRow = index === -1 ? 0 : index+2
  ws.getRange(custRow,2,1,3).setValues([[
    customerData.company,
    customerData.firstname,
    customerData.lastname]])
    return true
}

// add Product to table

function addProduct(data) {
  const ws = setSpreadsheet('Product')
  const id = idSetter(ws)
  const lastrow = ws.getLastRow()
  const range = ws.getRange(lastrow+1,1,1,6)
  
  //set NumberFormat to string - to be able to work with leading zeros
  range.setNumberFormat("@")
  
  //append row does not work thats why setValues is used
  range.setValues([[
      id,
      data.name,
      data.desc,
      data.price,
      data.vat,
      createTimeStamp()
    ]])
  return true
}



// add User to table

function addUser(data) {
  const ws = setSpreadsheet('User')
  const id = idSetter(ws)
  const lastrow = ws.getLastRow()
  const lastcol = ws.getLastColumn()
  const range = ws.getRange(lastrow,1,1,lastcol)
    
  //set NumberFormat to string - to be able to work with leading zeros
  range.setNumberFormat("@")
  
  //append row does not work thats why setValues is used
  
  range.setValues([[
      data.company,
      data.first,
      data.last,
      data.street,
      data.number,
      data.zip,
      data.city,
      data.email,
      data.fon,
      data.bankaccount,
      data.iban,
      data.bic,
      data.taxnumber,
      data.vatId,
      data.textblock1,
      data.textblock2,
      data.noVatOnInvoice,
    ]])


  return true
}

// get UserData with getUserData()

function getUserData() {
  const ws = setSpreadsheet('User')
  const r = ws.getRange(2,1,ws.getLastRow()-1,ws.getLastColumn()).getValues()[0]
  
  userdata = {
  company:r[0],
  firstName: r[1],
  lastName: r[2],
  street: r[3],
  number: r[4],
  zip: r[5],
  city: r[6], 
  email: r[7],
  fon: r[8],
  bankaccount: r[9],
  iban: r[10],
  bic: r[11],
  taxnumber: r[12],
  vatId: r[13],
  textblock1: r[14],
  textblock2: r[15],
  noVatOnInvoice: r[16],
  }
  return userdata
}
