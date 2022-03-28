# diglib
A digital library for CDL (Controlled Digital Lending)

## Background
In early 2020, COVID-19 outbroke. Then Campus closed, as well as the library. 

During the lockdown, Head of Access Service preferred to try out the idea of loaning out some library-owned printed copies as digitized materials, i.e, Controlled Digital Lending (CDL).

However, there is no universal implementation of CDL. 

At first, working with the IT department, the library mangaged to use a Apps Script behind a spreadsheet to check expiration time on an hourly basis.

[Implementing Controlled Digital Lending with Google Drive and Apps Script: A Case Study at the NYU Shanghai Library](https://doi.org/10.23974/ijol.2021.vol6.1.193) is the fruit of this pratice.

This project is similar to the above mentioned approach, but only in the sense that they are both implementations of CDL. 

It is a fully-functioning single-page web application that allows patrons to do self-checkout. I developed it independently during my free time from around March to June in 2020.


## Highlights
- Use only [Google Apps Script](https://developers.google.com/apps-script), which resembles pretty much the Web development languages such as HTML, CSS, JavaScrip and PHP.
- Use spreadsheet as its backend database. For a small collection of items ranging from 10 to 50, this works pretty well. 
- Add item with ease (see the 3rd screenshot below). A custom menu allows library staff to fetch metadata from [WorldCat.org](https://www.worldcat.org/). 
- Simple identity authorization. 

## Screenshots
![Homepage](https://github.com/Linerre/diglib/blob/master/CDL-2.png)

![user loan](https://github.com/Linerre/diglib/blob/master/cdl-1.png)

![metadata fetcher](https://github.com/Linerre/diglib/blob/master/CDL-3.png)

## Disclaimer
*The books shown in the screenshots above are just for demenstration purposes*.
They are **NOT** being used by the application. 

This application was used ONLY for a *very* short period because the campus reopened later and in-person access was no longer a problem.  
