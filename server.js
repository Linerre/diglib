var sheetsUrl = 'https://docs.google.com/spreadsheets/d/1ujtfzGHXrU_AY-ABTFHhIfoOS10Yao5a8z8NQu_4Ykg/edit#gid=692067259';
var bookSheet = SpreadsheetApp.openByUrl(sheetsUrl).getSheetByName('books');
var circLog   = SpreadsheetApp.openByUrl(sheetsUrl).getSheetByName('circ-log');

// may need to combine this pattern into the future scrapper
var fileIdPattern = /\/(?<fid>[a-zA-z0-9_-]{5,})\//gm;




/* -------------- TIME SETTINGS -------------- */
// may need to change to 2 days
var fourHourLoan = 4 * 60 * 60 * 1000;

// possible to be entered via GUI from a spreadsheet?
var semesterLoan = new Date('2020-09-14');



function doGet() {

  return HtmlService.createHtmlOutputFromFile('index');
  
}


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



  /*
   [     0             1          2        3         4          5           6            7       ]
   
         1             2          3        4         5          6           7            8
 1 | loan time  |  PatronID  |  Title |  call#  | barcode  |  Status  |  cdl url  |  Due Date/Time |
   -----------------------------------------------------------------------------------------
 2              |            | ...
  ------------------------------------------------------------------------------------------
 3  
  ------------------------------------------------------------------------------------------
 4  
  ------------------------------------------------------------------------------------------
 5  
  ------------------------------------------------------------------------------------------
  */


// tester: Ashley, ys78
function checkOut(){
  
  var barcode = '31124057204449';
   
  // [[b1, dUrl1, bUrl1], [b2, dUrl2, bUrl1], ... [bn, dUrln, bUrl1]]
  // may need to expand to the whole row to cater for email template
  var searchRange = bookSheet.getRange(bookSheet.getFrozenRows() + 1, 
                                       bookSheet.getFrozenColumns() + 1, 
                                       bookSheet.getLastRow(), 
                                       bookSheet.getLastColumn()).getValues();

  //target file information
  var filter = searchRange.filter(target => target[5] === barcode);
  
  // to be used for email template and circlog
  var fileInfo = filter[0];
  Logger.log('file Info:', fileInfo);
  
  


  
  // to check out
  try {

    var fileId = fileIdPattern.exec(fileInfo[6]).groups.fid;
    Logger.log('fileId: ', fileId); 
//  var file = DriveApp.getFileById(fileId);
//  Logger.log('The file chekced out to Ashley.');
//  file.addViewer('ys78@nyu.edu');
  
  
    // time stamp
    var loanTime = new Date();
    var dueTime = semesterLoan;
    var loanTimeStr = loanTime.toLocaleString([], {dateStyle: 'short', timeStyle: 'short'});
    var dueTimeStr = dueTime.toLocaleString([], {dateStyle: 'short', timeStyle: 'short'})
    
    
    // still lacking PatronID
    var record = [loanTimeStr, fileInfo[0], fileInfo[4], fileInfo[5], fileInfo[6], 'None', dueTimeStr, 'Self Check Loan'];
    circLog.appendRow(record);
    
  } catch (e) {
    Logger.log('Failed to check out. Error: ', e.toString());
  }
}

function changePermission() {
  //
}

function logCirc(record) {   
}

function timeStamp() {
}