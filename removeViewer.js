function removeViewer() {
  var fileIdPattern = /\/(?<fid>[a-zA-z0-9_-]{5,})\//gm;
  var now = new Date();
//  var newnow = new Date(now.getTime() + 15*60*1000);
  var retnTimeStr = now.toLocaleString([], {dateStyle: 'short', timeStyle: 'short'});
  var searchRange = circLog.getRange(bookSheet.getFrozenRows() + 1, 
                                     bookSheet.getFrozenColumns() + 1, 
                                     bookSheet.getLastRow(), 
                                     bookSheet.getLastColumn())
                                     .getValues();
  
  // filter out all that are (about to) due
  // could be none: empty array
  var filter = searchRange.filter(target => target[6] != "" && target[6] <= retnTimeStr  );
  Logger.log(filter);
//  var queryPara = {
//    "supportsAllDrives": true
//  };
  
  try {
    for (var record of filter) {
      Logger.log(record.length);
      // remove viewer
      var userInfo = record[5];
      var fileId = fileIdPattern.exec(record[4]).groups.fid;
      var file = DriveApp.getFileById(fileId);

      file.removeViewer(userInfo);
      
      // log
      Logger.log('old record: ', record);
      record[7] = 'Regular Return';
      Logger.log('new record: ', record);
      circLog.appendRow(record);
    }
    
    // delete trigger
    deleteTriggers();
  } catch (e) {
    Logger.log('Error found:', e.toString());
  }
}

function deleteTriggers() {
   var triggers = ScriptApp.getProjectTriggers();
   for (var i = 0; i < triggers.length; i++){
      ScriptApp.deleteTrigger(triggers[i]);
  }
}