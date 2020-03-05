import helper from 'csvtojson/v2/index.js';
import fs from 'fs';
import { pipeline } from 'stream';

const csv = helper.csv;
const csvFilePath = './csv/nodejs-hw1-ex1.csv';
const outputTxtFile = './output/new_file3.txt';

const csvConfiguration = {
    colParser: {
        'amount': 'omit',
        'price': 'number'
    },
    headers: ['book', 'author', 'amount', 'price']
};

function resultExecutionHandler(err) {
    if (err) {
        console.error('Pipeline failed.', err);
    } else {
        console.log('file was successfully written');
    }
}

pipeline(
    fs.createReadStream(csvFilePath),
    csv(csvConfiguration),
    fs.createWriteStream(outputTxtFile),
    resultExecutionHandler
);
