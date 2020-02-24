const EOL = require('os').EOL;
process.stdin.setEncoding('utf8');

function readWriteHandler() {
    let initialInput;
    while ((initialInput = process.stdin.read()) !== null) {
      process.stdout.write(`${reverseString(initialInput) + EOL}`);
    }
}

process.stdin.on('readable', readWriteHandler);

function endEventHandler() {
    process.stdout.write('end');
}

process.stdin.on('end', endEventHandler);

function reverseString(string) {
  const reversedString = string.trim().split('').reverse();
  return reversedString.join('');
}
