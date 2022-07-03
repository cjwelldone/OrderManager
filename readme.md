# AppScriptOrderManager

still in dev


## Purpose
Little helper for freelancers to make organising and sending invoices easier

## Scope
This programm uses Google AppsScript and some google service like GMailApp, DriveApp, SpreadsheetApp, DocumentApp

At the moment it is possible to 
- set up inital user data
- add \ edit products
- add \ edit \ delete customers
- create orders
- create invoices
- send invoices via email


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
- create the following sheets within the spreadsheet
  - Order, Product, Customer, User, InvoiceNumber, OrderNumber
- the sheets should have the following column [headers](https://github.com/cjwelldone/OrderManager/blob/master/sheetheaders.md)

- get the ids of all files and folders
- open extensions appscript
- go to projectsettings ->ScriptProperties
- set up those keys: 
  - spreadSheetId (id of the spreadsheet)
  - invoiceFolderID (id of the invoiceFolder)
  - templateInvoicefileID (id of the google doc)
  - templateInvoicefileNoVatID (id of the google other doc)
  - trashfolderId ((id of the trashFolder)

- copy and paste the content of the sample docs to the docs you just created
- copy the first row of each template sheet into the spreadsheet

## How To Use


