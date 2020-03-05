const csv = require('csvtojson/v2');
const csvFilePath = './csv/nodejs-hw1-ex1.csv';
const outputTxtFile = './output/new_file2.txt';
const fs = require('fs');
const { pipeline } = require('stream');

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
