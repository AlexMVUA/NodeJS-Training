
import csv from "csvtojson/v2";
import fs from 'fs';
import {pipeline} from 'stream';

const csvFilePath = './csv/nodejs-hw1-ex1.csv';
const outputTxtFile = './output/new_file3.txt';

pipeline(
  fs.createReadStream(csvFilePath),
  csv({
    colParser:{
      "amount": "omit",
  		"price":"number",
  	},
    headers: ['book','author','amount','price']
  }),

  fs.createWriteStream(outputTxtFile),
  (err) => {
    if (err) {
      console.error('Pipeline failed.', err);
    } else {
       console.log('file was successfully written');
    }
  }
);
