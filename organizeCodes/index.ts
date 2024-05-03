import fs from 'fs';

interface Item {
    code: number;
    text: string;
}

console.log("Start");

// get items

const input = fs.readFileSync("./organizeCodes/input.txt", "utf-8");

const items: Item[] = [];
const lines = input.split("\n");
for(const line of lines)
{
    const code = parseInt(line.slice(0, line.indexOf(" ")));
    const text = line.replace(`${code} `, "");

    const item: Item = {
        code: code,
        text: text
    }   

    items.push(item);
}

// sort

const sortedItems = items.sort((a, b) => { return a.code - b.code });
console.log(sortedItems)

// output

let outputText = "";
for(const item of sortedItems)
{
    outputText += `${item.code} ${item.text}\n`;
}
console.log(outputText);

fs.writeFileSync("./organizeCodes/output.txt", outputText);

console.log(`Successfully organized ${items.length} lines`);