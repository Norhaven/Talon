var fs = require('fs');

console.log('Incrementing build number...');

const buildInfoContent = fs.readFileSync('build-info.json');

var metadata = JSON.parse(buildInfoContent);
metadata.build = metadata.build + 1;

fs.writeFileSync('build-info.json', JSON.stringify(metadata));

console.log(`Current build number: ${metadata.major}.${metadata.minor}.${metadata.build}`);
console.log('Converting example library/story...');

const exampleLibraryContent = fs.readFileSync('example.library.tln');
const exampleStoryContent = fs.readFileSync('example.story.tln');

const formatContents = function(content){
    const replaceQuotesRegex = new RegExp('"', "g");
    const replaceCarriageReturnRegex = new RegExp("\r", "g");
    const replaceNewlineRegex = new RegExp("\n", "g");

    return content.toString()
        .replace(replaceQuotesRegex, '\\\"')
        .replace(replaceCarriageReturnRegex, "")
        .split("\n")
        .map(x => x.replace(replaceNewlineRegex, ""))
        .map(x => `\"${x}\\n\"`)
        .join(" + \n");          
};

const outputWarning = "// WARNING: This file is autogenerated, do not edit manually!";
const formattedLibraryContents = formatContents(exampleLibraryContent);
const formattedStoryContents = formatContents(exampleStoryContent);

const getLibraryFunction = `export function getExampleLibraryCode(){\n    return ${formattedLibraryContents};\n}`;
const getStoryFunction = `export function getExampleStoryCode(){\n    return ${formattedStoryContents};\n}`;

const output = `${outputWarning}\n\n${getLibraryFunction}\n\n${getStoryFunction}`;

fs.writeFileSync("talon/TalonExamples.ts", output);

console.log("Converted examples!");

fs.copy