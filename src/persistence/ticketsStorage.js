const TicketModel = require('../dao/models/ticket.model');

class TicketsStorage {

    constructor(){}

    async getAll(){
        return await TicketModel.find();
    }

    async getById(id){
        const ticket = await TicketModel.findOne({ _id: id }).populate('products.product')
        if(!ticket){
            throw new Error('not found')
        }
        return ticket
    }

    async createOne(ticketData){
        return await TicketModel.create(ticketData)
    }

    async deleteById(id){
        const ticket = await TicketModel.findById(id)
        if(!ticket){
            throw new Error('not found')
        }
        await TicketModel.deleteOne({ _id: id })

        return (ticket, ' deleted')
    }
}

module.exports = TicketsStorage