function loadPartialHTML_(partial) {
  const htmlServ = HtmlService.createTemplateFromFile(partial)
  return htmlServ.evaluate().getContent()
}

function loadSearchView() {
  return loadPartialHTML_('_searchCustomer')
}

function loadSearchOrderView() {
  return loadPartialHTML_('_searchOrders')
}

function loadAddCustomerView() {
  return loadPartialHTML_('_addCustomerModal')
}

function loadEditCustomerView() {
  return loadPartialHTML_('_editCustomerModal')
}

function loadAddProductView() {
  return loadPartialHTML_('_addProductModal')
}

function loadAddOrderView() {
  return loadPartialHTML_('_addOrderModal')
}

function loadAddUserView() {
  return loadPartialHTML_('_addUserModal')
}