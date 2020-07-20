/* 
  Fetch key info of a title from WorldCat page or
  from Amazon production page.
  
*/


/* ------------- patterns for Google Books ------------- */
  var metaPat = /<table id="metadata_content_table">.*?<\/table>/gm,
  // the quotes in dir="ltr" will be stripped! 
      titlePat = /Title<\/td><td class="metadata_value">[^<i>]?<span dir=ltr>(?<title>.*?)<\/span>/gm,
      authorPat = /<a class="primary" href="[^<>]+"><span dir=ltr>(?<author>.*?)<\/span><\/a>/gm,
      pubPat = /Publisher<\/span><\/td><td class="metadata_value"><span dir=ltr>(?<pub>[\w\s]+), (?<puby>\d+)<\/span>/gm,
      isbnPat = /ISBN<\/span><\/td><td class="metadata_value"><span dir=ltr>\d{10}, (?<isbn13>\d{13})<\/span>/gm;

/* ------------- patterns for World Cat ------------- */
var authorBlock = /<td id="bib-author-cell">.*?<\/td>/gm,
    worldCatAuth = /<a href=['"]?[^ ]+['"]? title=["']?Search for more by this author["']?>(?<auth>.*?)<\/a>/gm,
    worldPub = /<td id="bib-publisher-cell">(?<pub>[^\[\]\d©]+)/gm,
    worldTitle =/<h1 class=['"]title['"]>(?<ti>.*?)<\/h1>/gm,
    worldIsbn = /<td>(?<isbns>[\d ]+)<\/td>/gm;



/* ------------- drive and sheets ------------- */
const driveFolderId = 'id1';
const spreadSheetId = 'id2;
function fetchWorldCat(url, barcode) {
//  var url = 'https://www.worldcat.org/title/digital-design-and-computer-architecture/oclc/1047882417&referer=brief_results';
  // as if the two are passed to the func
  var barcode = 'barcode';
  var barcodePat = new RegExp(barcode);
  var url = 'https://www.worldcat.org/title/how-to-do-nothing-resisting-the-attention-economy/oclc/1120137744&referer=brief_results';
//  var url = 'https://www.worldcat.org/title/desalination-water-from-water/oclc/1097462429';
  
  var content = UrlFetchApp.fetch(url).getContentText('UTF-8');

  
  var authorBox = authorBlock.exec(content)[0],
      authorname, 
      authors = [],
      publisher = worldPub.exec(content),
      title = worldTitle.exec(content),
      isbns = worldIsbn.exec(content);
  
     
  // get all the author(s)
  while ((authorname = worldCatAuth.exec(authorBox)) !== null) {
    Logger.log(authorname);
    authors.push(authorname.groups.auth);
  }
  
   Logger.log(title.groups.ti);
  
  // Array
   Logger.log(authors);

  //string
   Logger.log(publisher.groups.pub);
  
  //string
   Logger.log(isbns.groups.isbns);
  //split method has no default separators!
  var isbn13s = isbns.groups.isbns.split(' ').filter(no => no.length > 10).join(', ');

   addBook(title.groups.ti, authors.join('; '), publisher.groups.pub, isbn13s, barcode);
}



// start with adding one at a time
// may be able to add a batch of books at a time
function addBook(title, author, pub, isbn13, barcode) {
  
  // get the file url
  var files = DriveApp.getFolderById(driveFolderId).getFiles();
  
  while (files.hasNext()) {
    var file = files.next();

    if (file.getName().search(barcode) !== -1) {
      var correctUrl = file.getUrl();
      break
    } else {Logger.log('File not found.')}
  }
  
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var bookRecords = ss.getSheetByName('books');
  bookRecords.appendRow([title, author, pub, isbn13, barcode, correctUrl]);
}





/* ---------------- less useful ---------------- */
function fetchGoogleBooks() {
//  var url = 'https://books.google.com.hk/books?id=F05TvgAACAAJ&dq=Case+in+point.+Graph+analysis+for+consulting+and+case+interviews&hl=en&sa=X&ved=2ahUKEwj6qZSZptbqAhUayYsBHcY7BR0Q6AEwAHoECAAQAg'
  var url = 'https://books.google.com.hk/books?id=01wAoQEACAAJ&dq=Religious+ecology+and+sinofuturism+:+religious+studies+and+modernities+in+contemporary+Chinese+discourse&hl=en&sa=X&ved=2ahUKEwiSv5fXtdbqAhWHUt4KHTU0B8kQ6AEwCXoECAQQAg' 
  var webContent = UrlFetchApp.fetch(url).getContentText('UTF-8');
  
  // string
  var metadata = metaPat.exec(webContent),
      biblio = metadata[0];
  
  Logger.log(biblio);
  
  
  var title = titlePat.exec(biblio),
      publisher = pubPat.exec(biblio),
      author = authorPat.exec(biblio),
      isbn = isbnPat.exec(biblio),
      authorname,
      authors = [];
  
  // the first boolean operation must be bracketed
  // otherwise js will force it to become boolean value and then compare with null!
  while ((authorname = authorPat.exec(biblio)) !== null) {
    authors.push(authorname.groups.author);
  }
  
  
  Logger.log('Title: ', title.groups.title);
 
  Logger.log('Author: ', authors.join('; '));
  
  Logger.log('Publisher: ', publisher.groups.pub);
  
  Logger.log('Publication Year: ', publisher.groups.puby);
    
  Logger.log('ISBN: ', isbn.groups.isbn13);


  var fetchTime = Utilities.formatDate(new Date(), 'Etc/GMT', 'yyyy-MM-dd HH:mm:ssZ');
  Logger.log(fetchTime);
}