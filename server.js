var sheetsUrl = 'https://docs.google.com/spreadsheets/d/1ujtfzGHXrU_AY-ABTFHhIfoOS10Yao5a8z8NQu_4Ykg/edit#gid=692067259';
var bookSheet = SpreadsheetApp.openByUrl(sheetsUrl).getSheetByName('books');
var circLog   = SpreadsheetApp.openByUrl(sheetsUrl).getSheetByName('circ-log');

// may need to combine this pattern into the future scrapper
var fileIdPattern = /\/(?<fid>[a-zA-z0-9_-]{5,})\//gm;



function doGet() {

  return HtmlService.createHtmlOutputFromFile('index');
  
}



// tester: Ashley, ys78
function checkOut(){
  
  var barcode = '31124057204449';
  
  /*
   [  0          1           2          3        4          5           6            7       ]
   
      1          2           3          4        5          6           7            8
 1 | title  |  author  |  publisher |  isbn  |  call#  |  barcode  |  cdl url  |  bobcat url |
   -----------------------------------------------------------------------------------------
 2  title1  |  author1 | ...
  ------------------------------------------------------------------------------------------
 3  title2
  ------------------------------------------------------------------------------------------
 4   ...
  ------------------------------------------------------------------------------------------
 5  titlen
  ------------------------------------------------------------------------------------------
  */
   
  // [[b1, dUrl1, bUrl1], [b2, dUrl2, bUrl1], ... [bn, dUrln, bUrl1]]
  // may need to expand to the whole row to cater for email template
  var searchRange = bookSheet.getRange(bookSheet.getFrozenRows() + 1, 
                                       bookSheet.getFrozenColumns() + 1, 
                                       bookSheet.getLastRow(), 
                                       bookSheet.getLastColumn()).getValues();

  //target file information
  //[[barcode, durl, burl]]
  var fileInfo = searchRange.filter(target => target[5] === barcode);
  Logger.log('file Info:', fileInfo);
  
  var fileId = fileIdPattern.exec(fileInfo[0][6]).groups.fid;
  Logger.log('fileId: ', fileId)
  
//  var file = DriveApp.getFileById(fileId);
  
//  file.addViewer('ys78@nyu.edu');
  
  logCirc(fileInfo)
  
//  Logger.log('The file chekced out to Ashley.');

}


function logCirc(fileinfo) {

  
  
  
}

