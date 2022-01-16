var testFolder = 'data';
var fs = require('fs');

fs.readdir(testFolder, (err, files)=>{
    files.forEach(file =>{
        console.log(file);
    });
})