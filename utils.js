export { joinToString, escapeString }

function joinToString(array) {
    return (array.length > 2) ?
        `\`${array.slice(0, -1).join("\`, \`")}\`, and \`${array[array.length - 1]}\`` :
        (array.length === 2) ?
            `\`${array[0]}\` and \`${array[1]}\`` :
            `\`${array[0]}\``
}

function escapeString(string) {
    return (string
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, "\\n")
        .replace(/\"/g, '\\"')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\;/g, '\\;'));
}