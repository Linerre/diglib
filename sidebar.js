function loadSidebar() {
  var htmlServ = HtmlService.createTemplateFromFile('form-side');
  const html = htmlServ.evaluate();
  html.setWidth(200);
  html.setTitle('Add Book');
  const ui = SpreadsheetApp.getUi();
  ui.showSidebar(html);
}

function createMenu_() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('Custome Options');
  menu.addItem('Add Book', 'loadForm');
  menu.addItem('Add Item', 'loadSidebar');
  menu.addToUi();
}


function onOpen(){
  createMenu_();
  
}