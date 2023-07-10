const fs = require("fs");
const { type } = require("os");
const path = require("path")
const util = require('util')

function findName(sample){
    
    const readFile = util.promisify(fs.readFile)
    
    const data = readFile(path.join(__dirname, '../') + '/utils/name_file.txt');

    if(!data){
        return Error('file read failed')
    }

    return
//    console.log('Data read')
} 



module.exports = {findName};
