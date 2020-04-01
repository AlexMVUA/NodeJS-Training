function getLimit(limit) {
    if (isNaN(limit)) {
        return 0;
    }
    return limit;
}

function containStringIgnoreCase(string, stringToSearch) {
    return string.toLowerCase().indexOf(stringToSearch.toLowerCase()) !== -1;
}

export { containStringIgnoreCase, getLimit };
