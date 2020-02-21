const csv=require("csvtojson/v2");
const csvFilePath='./csv/nodejs-hw1-ex1.csv';
const outputTxtFile='./output/new_file2.txt';
const fs = require('fs');
const { pipeline } = require('stream');

pipeline(
  csv({
    colParser:{
      "amount": "omit",
  		"price":"number",
  	},
    headers: ['book','author','amount','price']

  }).fromStream(fs.createReadStream(csvFilePath)),

  fs.createWriteStream(outputTxtFile),
  (err) => {
    if (err) {
      console.error('Pipeline failed.', err);
    } else {
       console.log('file was successfully written');
    }
  }
);
