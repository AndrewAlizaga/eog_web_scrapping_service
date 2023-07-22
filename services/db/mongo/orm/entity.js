class EntityORM {

    constructor(client) {
        this.client = client
    }

    async checkClient(){

    }

    async checkEmpty(){

    }


    async SaveEntity(data){}

    async SaveEntities(data){}
    
    async DeleteEntityByID(id){}
    
    async GetEntityByID(id){}

    async GetEntitiesByID(id){}
}

module.exports = EntityORM