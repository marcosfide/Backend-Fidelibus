const { Router } = require('express')

class BaseRouter {
    constructor(){
        this.router = Router()
        this.init()
    }

    init(){}

    getRouter(){
        return this.router
    }

    get(path, ...callbacks){
        this.router.get(path, this.customizeCallbacks(callbacks))
    }

    post(path, ...callbacks){
        this.router.post(path, this.customizeCallbacks(callbacks))
    }

    put(path, ...callbacks){
        this.router.put(path, this.customizeCallbacks(callbacks))
    }

    delete(path, ...callbacks){
        this.router.delete(path, this.customizeCallbacks(callbacks))
    }

    customizeCallbacks(callbacks){
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                console.log(error);
                params[1].status(500).send(error)
            }
        })
    }
}


module.exports = BaseRouter