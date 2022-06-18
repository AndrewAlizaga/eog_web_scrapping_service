//Abstract class that delivers rest of the cases

/**
 * Abstract Class Case.
 * 
 * @class Case
 */
class Case {

    constructor (title, party, date, type, img_list){

        if(this.constructor== Case){
            throw new Error("Abstract classes can't be instantiated");
        }

        this.title = title;
        this.party = party;
        this.date = date;
        this.type = type;
        this.img_list = img_list;
    }

    save(){
        throw new Error('Method "say()" must be implemented');
    }

    getTitle(){
        return this.title;
    }

    
}

module.exports = Case;