var sheetsUrl;
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
function checkOut(barcode, netId){
  
  var patron = netId + '@nyu.edu';
  var searchRange = bookSheet.getRange(bookSheet.getFrozenRows() + 1, 
                                       bookSheet.getFrozenColumns() + 1, 
                                       bookSheet.getLastRow(), 
                                       bookSheet.getLastColumn())
                                       .getValues();

  // fetch the file comlum&row
  var filter = searchRange.filter(target => target[4] === barcode);
  
  // get the target item row number
  // for status change later
  var itemRowNum = searchRange.findIndex(item => item[4] === barcode) + 2; //offset frozen row(s) and array index
  var itemType = bookSheet.getRange(itemRowNum, 7).getValue();
 
  

  
  // to be used for email template and circlog
/*
**  col
**   1        2          3            4          5         6           7           8           9
** Title    Author    Publisher    ISBN-13    Barcode    Status    Item type    CDL url    Bobcat url
**
**  [0]      [1]        [2]          [3]        [4]       [5]         [6]         [7]         [8]
*/ 
  var fileInfo = filter[0];
  Logger.log('file Info:', fileInfo);
  Logger.log('target row num: ', itemRowNum);
  
  
  
  // to check out
  try {

    var fileId = fileInfo[7].match(/[-\w]{25,}/);
    Logger.log('fileId: ', fileId); 
    
    
    // check out and disable email notification
    updateFilePermission(patron, fileId);
    // change corresponding status on the book sheet
    bookSheet.getRange(itemRowNum, 6).setValue(ITEMSTATUS[0][1]); 
     
    // time stamp
    var loanTime = new Date();
    
//    var dueTime = new Date(loanTime.getTime() + temp);
    var dueTime;
    itemType == ITEMTYPE[0][0] ? dueTime = semesterLoan : dueTime = new Date(loanTime.getTime() + fourHourLoan);
    
    var loanTimeStr = loanTime.toLocaleString([], {dateStyle: 'short', timeStyle: 'short'});
    var dueTimeStr = dueTime.toLocaleString([], {dateStyle: 'short', timeStyle: 'short'});

    Logger.log(dueTimeStr);

    var loanRecord = [loanTime, fileInfo[0], fileInfo[4], fileInfo[7], patron, dueTime, 'Self Check Loan'];
//    var retnRecord = [loanTimeStr, fileInfo[0], fileInfo[4], fileInfo[5], fileInfo[6], user, dueTimeStr, 'Regular Return'];
    circLog.appendRow(loanRecord);

    // If the patron wants to check in before due date
    // ask him/her to forward the check-out receipt email to us?
    
  } catch (e) {
    Logger.log('Failed to check out. Error: ', e.toString());
  }
}


function updateFilePermission(userinfo, fileId) {
 Drive.Permissions.insert(
  {
    "role": "reader",
     "type": "user",
     "value": `${userinfo}`
   },
   fileId,
  {
   "supportsAllDrives": true,
   "sendNotificationEmails": false,
  });
}