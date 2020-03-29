const EOL = require('os').EOL;
process.stdin.setEncoding('utf8');

function readWriteHandler() {
    let initialInput;
    initialInput = process.stdin.read();
    while (initialInput !== null) {
        process.stdout.write(`${reverseString(initialInput) + EOL}`);
        initialInput = process.stdin.read();
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
