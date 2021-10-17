const fs = require("fs")
const path = require('path');
const { hasUncaughtExceptionCaptureCallback } = require("process");
const util = require('util');
const Case = require("../class/case");
const { CaseNature } = require("../utils/Enums")

async function readFileToWords(path_){

    const readFile = util.promisify(fs.readFile);
    
    let foundData = await readFile(path_);

    if(!foundData){
//        console.log('no found data')
        return Error;
    }

    return foundData.toString().toLocaleLowerCase();

}

function characterKiller(word, characterToKill){

  //  console.log('entered character killer')
    var new_word = word.split(characterToKill).join(' ');
    
  //  console.log('new word after character ejection');
   // console.log(new_word);
    return new_word;
}

async function accentRemoval(wordsArray){

    var new_accentless_array = await wordsArray.map(e => {
        e = e.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        return e;
    });

    return new_accentless_array;
}

async function detectNames(data){
    
    //Delete character ','
    data = characterKiller(data.toString(), ',');

    //Convert to word array
    let sample = data.toString().split(' ');
    //Remove accent
    sample = await accentRemoval(sample);

    const foundData = await readFileToWords(path.join(__dirname, '../') + '/utils/name_file.txt')

    if(!foundData){
        return Error('file read failed')
    }

   // console.log('Data read')

    let key_words_array = foundData.toString().toLowerCase().split('\n')

    //console.log(key_words_array);

    let party_names = [];

    //Name is found if two matches in a row happen.
    for(var i = 0; i < sample.length; i++){

        //Imposible match check
        if(i >= sample.length -1){
            break;
        }

      //  console.log('evaluating: '+sample[i].toString().toLowerCase());
        var match = false;
        var possible_name = '';

        //First name level match
        if(key_words_array.includes(sample[i].toString().toLowerCase())){
        //    console.log('first duple matched');
            
            //Second name level match
            if(key_words_array.includes(sample[i+1].toString().toLowerCase())){
          //      console.log('double match, party member found');
            
                possible_name = sample[i].toLowerCase();
                //Extra increment applied
                i++;
                possible_name = possible_name + ' '+sample[i].toLowerCase();
                
                //Offically matched
                match = true;

                //Imposible third name check
                if(i >= sample.length -2){
                    party_names.push(possible_name);
                    break;
                }
                
            //    console.log('checking for extended name');

                //Third name level match
                if(key_words_array.includes(sample[i + 1].toString().toLowerCase())){
              //      console.log('third match appeared')

                    //Second extra increment applied
                    i++;
                    possible_name = possible_name + ' '+sample[i].toLowerCase();
                    
                    //Imposible fourth name check
                    if(i >= sample.length -3){
                        party_names.push(possible_name);
                        break;
                    }

                    //Fourth name level match
                    if(key_words_array.includes(sample[i + 1].toString().toLowerCase())){
                //        console.log('third match appeared')
                        
                        //Second extra increment applied
                        i++;
                        possible_name = possible_name + ' '+sample[i].toLowerCase();
                        
                    }

                }

                //Else eject party member onto the next check
            }

        }

        //Check for member found
        if(match){
            //Adding the match
            console.log('adding match')
            console.log(possible_name);
            party_names.push(possible_name);
        }
    }

    return party_names;
} 

async function detectViolence(data){

    //Convert to word array
    let sample = data.toString().split(' ');

    //Accent removal
    sample = await accentRemoval(sample)

    //Read file
    const foundData = await readFileToWords(path.join(__dirname, '../') + '/utils/violence_file.txt');
    
    if(!foundData){
       // console.log('no found data')
        return ''
    }else{
      //  console.log('found Data')
        let key_words_array = foundData.split(' ')
       // console.log(key_words_array)
        
        var violence_match = false;

        for(var i = 0; i < sample.length; i++){
            
            var testWord = sample[i];
         //   console.log('checking '+ testWord);
            var match = key_words_array.includes(testWord.toString().toLowerCase());
            if(match){
                violence_match = true;
                break;
            }
        }

        //console.log('loop finished')

        if(violence_match){
            return CaseNature.violent
        }else{
            return CaseNature.regularNews
        }
    }
    
}

module.exports = { detectViolence, detectNames};
