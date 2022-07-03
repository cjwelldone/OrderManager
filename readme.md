# AppScriptOrderManager

This project is still in development, but you can use it already if you like.

## Purpose

Little helper for freelancers to make organising and sending invoices easier.

## Scope

This programm uses Google AppsScript and other Google services like GMailApp, DriveApp, SpreadsheetApp, DocumentApp

At the moment it is possible to 
- set up inital user data
- add \ edit products
- add \ edit \ delete customers
- create orders
- create invoices
- send invoices via email

- Ordermanager is deployable as webapp or modal in a spreadsheet

## How To Set Up

- create a folder in google drive 
- create three subfolders 
  - **templates**
    -  create two google docs: 
        - templateInvoicefile ( or name it you like )
        - templateInvoicefileNoVat ( or name it you like )

    - you can style the docs however you like but they need to have at least the following structure and vars [structure invoices with VAT](https://github.com/cjwelldone/OrderManager/blob/master/docstructure.md) or [structure invoices without VAT](https://github.com/cjwelldone/OrderManager/blob/master/docstructure_noVat.md)
  - **invoices**
  - **trash**
- create a google spreadsheet 
- create the following sheets within the spreadsheet (make sure you to copy the name from here)
  - Order, Product, Customer, User, InvoiceNumber, OrderNumber
- the sheets should have the following [column headers](https://github.com/cjwelldone/OrderManager/blob/master/sheetheaders.md)

- get the ids of all files and folders
- open a [google appscript](https://script.google.com/home/)
- create a new project
- go to projectsettings -> scriptproperties
- add new scriptproperties:
- set up those keys: 
  - spreadSheetId (id of the spreadsheet)
  - invoiceFolderID (id of the invoiceFolder)
  - templateInvoicefileID (id of the first google doc)
  - templateInvoicefileNoVatID (id of the second google doc)
  - trashfolderId ((id of the trashFolder)
  - create html files and use thes excact naming of this project 
  - create script files and name them like in this project - do not worry about the fact, that in this repo files have a .js ending - google appscript uses .gs
  - you just need the html and js files - nothing else
  - you can also work with [clasp](https://github.com/google/clasp) to make it more convient - but it takes some time to set up 

- apply the structure [structure invoices with VAT](https://github.com/cjwelldone/OrderManager/blob/master/docstructure.md) or [structure invoices without VAT](https://github.com/cjwelldone/OrderManager/blob/master/docstructure_noVat.md) to the docs you just created
- the styling is not important, but make sure, that you have at least three tables in the body section

## How To Use

- once you setup everything, you can now deploy the project as a webapp or also use the programm in your spreadsheet as modal
- once you open the spreadsheet, there will be a new Menu Item - called "Ordermanager"
- when you open the programm for the first time, make sure to grant access to all your google services and 
- go to the "add user" section and set the user data, which will then be printed on the invoice


