# AppScriptOrderManager



## Purpose
Little helper for freelancers to make organising and sending invoices easier

## Scope
This programm uses Google AppsScript and some google service like GMailApp, DriveApp, SpreadsheetApp, DocumentApp


## How To Set Up

- create a folder in google drive 
- create three subfolders 
  - templates
    -  create two google docs templateInvoicefile & templateInvoicefileNoVat
  - invoices
  - trash
- create a google spreadsheet 
- create the following sheets within the spreadsheet
  - Order, Product, Customer, User, InvoiceNumber, OrderNumber
- Set up you inital order and invoicenumber in Cell A1

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


