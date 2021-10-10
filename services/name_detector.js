const fs = require("fs");
const { type } = require("os");
const path = require("path")
const util = require('util')

function findName(sample){
    
    const readFile = util.promisify(fs.readFile)
    
    const data = await readFile(path.join(__dirname, '../') + '/utils/name_file.txt');

    if(!data){
        return Error('file read failed')
    }

    console.log('Data read')

    let 
} 



module.exports = {findName};