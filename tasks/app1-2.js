const csv=require("csvtojson/v2");
const csvFilePath='./csv/nodejs-hw1-ex1.csv'
const fs = require('fs');
var endOfLine = require('os').EOL;


csv()
  .fromFile(csvFilePath)
  .then((jsonObj)=>{
	   console.log(jsonObj);
     var contentToWrite = '';
     for (var i = 0; i < jsonObj.length; i++) {
       delete jsonObj[i].Amount;
       let reducedObject = JSON.stringify(jsonObj[i]);
       contentToWrite = contentToWrite + reducedObject + endOfLine;
     }
     fs.writeFile("./output/new_file2.txt", contentToWrite, (err) => {
       if (err) throw err;
       console.log('file was successfully written');
     });;
  });
