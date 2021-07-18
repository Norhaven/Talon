var fs = require('fs');
console.log('Incrementing build number...');
fs.readFile('build-info.json',function(err,content) {
    if (err) throw err;
    var metadata = JSON.parse(content);
    metadata.revision = metadata.revision + 1;
    fs.writeFile('build-info.json',JSON.stringify(metadata),function(err){
        if (err) throw err;
        console.log(`Current build number: ${metadata.major}.${metadata.minor}.${metadata.revision}`);
    })
});