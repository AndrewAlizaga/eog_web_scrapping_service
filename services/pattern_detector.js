const fs = require("fs")
const path = require('path');
const { hasUncaughtExceptionCaptureCallback } = require("process");
const util = require('util');
const Case = require("../class/case");
const { CaseNature } = require("../utils/Enums")

//sentiment nlp implementation
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var Analyzer = natural.SentimentAnalyzer;
var stemmer = natural.PorterStemmer;

//topic nlp implementation
var {NlpManager} = require('node-nlp');
const { request } = require("http");
var manager = new NlpManager({ languages: ['es'], forceNER: true});


// trains topics nlp
async function trainManager(){
    console.log("Invoke - trainManager")
    // utterances and intentions / intents
    //crime
    manager.addDocument('es', 'entro a robar', 'nature.crime')
    manager.addDocument('es', 'lo mato', 'nature.crime')
    manager.addDocument('es', 'asesino', 'nature.crime')
    manager.addDocument('es', 'estafaron a las personas', 'nature.crime')
    manager.addDocument('es', 'estafa', 'nature.crime')
    manager.addDocument('es', 'mataron', 'nature.crime')
    manager.addDocument('es', 'carcel', 'nature.crime')
    manager.addDocument('es', 'mato', 'nature.crime')
    manager.addDocument('es', 'encarcelaron', 'nature.crime')
    manager.addDocument('es', 'encarcelado', 'nature.crime')
    manager.addDocument('es', 'los encarcelaron', 'nature.crime')
    manager.addDocument('es', 'asesinato', 'nature.crime')

    //heroism
    manager.addDocument('es', 'lo salvaron', 'nature.heroism')
    manager.addDocument('es', 'ayudo a los niños', 'nature.heroism')
    manager.addDocument('es', 'donaron', 'nature.heroism')
    manager.addDocument('es', 'dono', 'nature.heroism')
    manager.addDocument('es', 'salvar al pais', 'nature.heroism')
    manager.addDocument('es', 'ayudar a la gente', 'nature.heroism')
    manager.addDocument('es', 'dio una mano', 'nature.heroism')
    manager.addDocument('es', 'buen samaritano', 'nature.heroism')

    //politics
    manager.addDocument('es', 'el presidente dijo', 'nature.politics')
    manager.addDocument('es', 'politicos', 'nature.politics')
    manager.addDocument('es', 'los diputados', 'nature.politics')
    manager.addDocument('es', 'el candidato', 'nature.politics')
    manager.addDocument('es', 'candidato oficial', 'nature.politics')
    manager.addDocument('es', 'candidato', 'nature.politics')
    manager.addDocument('es', 'los candidatos', 'nature.politics')
    manager.addDocument('es', 'la alcaldia', 'nature.politics')
    manager.addDocument('es', 'alcaldia', 'nature.politics')
    manager.addDocument('es', 'el presidente', 'nature.politics')
    manager.addDocument('es', 'sector empresarial', 'nature.politics')
    manager.addDocument('es', 'sector privado', 'nature.politics')
    manager.addDocument('es', 'alianza', 'nature.politics')


        await manager.train();
        manager.save();
        const responseTest = await manager.process('es', 'entro y los mato a todos')
        console.log('training response test: ', responseTest.classifications)

}

trainManager()


async function detectCaseNature(data){
    console.log("invoke detectCaseNature - ", data)
    let processManagerResponse = []
    if (data.length == 0){
        processManagerResponse =  'no clasificado'
    }else {

        let requestString = ""
        data.map(async segment => {
            requestString = requestString + " " + segment
        })

        console.log("string to check: ", requestString)

        const nlpResponse = await manager.process('es', requestString)
        console.log(nlpResponse)

        processManagerResponse = nlpResponse.classifications
   
    }
 
    console.log('manager results: ', processManagerResponse)

    return processManagerResponse

}

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

async function detectPositivity(data){

    console.log("invoke - detectPositivity")
    //Convert to word array
    let sample = data.toString().split(' ');

    //nlp call
    var analyzerInstance = new Analyzer("Spanish", stemmer, "afinn");

    console.log("sentiment found: ", analyzerInstance.getSentiment(sample))





    
    return analyzerInstance.getSentiment(sample)

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

module.exports = { detectPositivity, detectNames, detectCaseNature};
