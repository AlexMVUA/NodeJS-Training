export function getLimit(limit) {
    if (isNaN(limit)) {
        return 0;
    }
    return limit;
}

export function containStringIgnoreCase(string, stringToSearch) {
    return string.toLowerCase().indexOf(stringToSearch.toLowerCase()) !== -1;
}
