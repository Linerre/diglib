/*
** My version
  * find all the books that are overdue
    * string => time?
  * remove viewers from them
    * removeViewer(emial)?
  * set status to expire on circLog
    * getRange(cell).setValue(expire)
  * set status back to Available on bookSheet
    * using barcode to locate items
    * modularize this func?
    * 
*/




function checkIn() {
  var books = circLog.getRange(circLog.getFrozenRows() + 1, 
                               circLog.getFrozenColumns() + 1, 
                               circLog.getLastRow() - circLog.getFrozenRows(), 
                               circLog.getLastColumn()).getValues();
//  Logger.log(books);
//  Logger.log(books.length);
  
  var now = new Date();
  var nowTimeStr = now;
  
  for (var i = 0; i < books.length; i++) {
    var book = books[i];   // get each book
    var url = book[3];     // get CDL url
    var fileId = url.match(/[-\w]{25,}/);
    var title = book[1];   // get book title
    var patron = book[4];
    var dueTime = book[5]; // get the due time


    
//    Logger.log(fileId);
    
    
    if (nowTimeStr > dueTime) {
      var asset;
      
      // Skip the document if it has any kind of status
      if (book[7]) {continue;}
      
      try {
        if (fileId) {
          asset = DriveApp.getFileById(fileId) ? DriveApp.getFileById(fileId) : DriveApp.getFolderById(fileId);
//        var viewers = asset.getViewers();
//        for (var i=0; i<viewers.length; i++) {
//          Logger.log('Viewer: ', viewers[i].getEmail());
//        }
//        Logger.log(viewers[1].getEmail());
          asset.removeViewer(patron);
          Logger.log(patron);
          circLog.getRange(i + 2, 8).setValue('Expired');
        } 
      } catch(e) {
        Logger.log("Error occurred while removing patron: " + e.toString())
      }
    }
  }
}


function deleteTriggers() {
   var triggers = ScriptApp.getProjectTriggers();
   for (var i = 0; i < triggers.length; i++){
      ScriptApp.deleteTrigger(triggers[i]);
  }
}