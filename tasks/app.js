var endOfLine = require('os').EOL;
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  let initialInput;

  while ((initialInput = process.stdin.read()) !== null) {
    process.stdout.write(`${reverseString(initialInput) + endOfLine}`);
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});

function reverseString(string) {
  var reversedString = string.trim().split('').reverse();
  return reversedString.join('');
}
