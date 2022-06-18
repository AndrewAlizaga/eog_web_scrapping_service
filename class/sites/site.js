//Abstract class that works as base for sites to scrapon
/**
 * 
 * Abstract Class Site
 * 
 * @class Site
 * 
 */

const { exists } = require("fs");

class Site {

    constructor(name, date = null, type = null) {

        if (this.constructor == Site){
            throw new Error("ABSTRACT CLASS CANNOT BE INSTANTIATED")
        }

        this.name = name;
        this.date = date;
        this.type = type;
        this.leads = [];
    }


    //main scrapping method for the sites, abstract since each site has its ways
    scrap(){}

    saveLeads(leads){
        this.leads = leads
    }

    removeLead(lead){
        this.leads.filter((element) => {
            if (element != lead) {
                return true
            }
        })
    }

    addLead(lead){
        
        leadFound = false
        added = true

        for(var i=0; i < this.leads.length; i++){
            if (this.leads[i] == lead){
                leadFound = true
                break
            }
        }


        leadFound?this.leads.push(lead):added=false

        return added
    }

}