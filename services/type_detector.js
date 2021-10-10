const fs = require("fs")
const path = require('path')
const util = require('util');
const Case = require("../class/case");
const { CaseNature } = require("../utils/Enums")

async function detectViolence(data){

    //Convert to word array
    let sample = data.toString().split(' ');

    //Read file
    const readFile = util.promisify(fs.readFile);
    
    let foundData = await readFile(path.join(__dirname, '../') + '/utils/violence_file.txt');

    if(!foundData){
        console.log('no found data')
        return ''
    }else{
        console.log('found Data')
        let key_words_array = foundData.toString().toLowerCase().split(' ')
        console.log(key_words_array)
        
        var violence_match = false;

        for(var i = 0; i < sample.length; i++){
            
            var testWord = sample[i];
            console.log('checking '+ testWord);
            var match = key_words_array.includes(testWord.toString().toLowerCase());
            if(match){
                violence_match = true;
                break;
            }
        }

        console.log('loop finished')

        if(violence_match){
            return CaseNature.violent
        }else{
            return CaseNature.regularNews
        }
    }
    
}

module.exports = { detectViolence };