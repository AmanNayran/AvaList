import express from 'express'
import userRoute from './routes/user'
import readRoute from './routes/read'
import { connect } from 'mongoose'


export class App{
    private express: express.Application
    private port = 8080

    constructor(){
        this.express = express()
        this.database()
        this.middlewares()
        this.routes()
        this.listen()
    }

    public getApp(): express.Application {
        return this.express
    }

    private middlewares(){
        this.express.use(express.json())
    }

    private listen(){
        this.express.listen(this.port, () => {
            console.log('Server is on door: ' + this.port)
        })
    }

    private async database(){
        await connect('mongodb+srv://Nayran:avalist123@cluster0.0dg7xzx.mongodb.net/?retryWrites=true&w=majority')
    }

    private routes(){
        this.express.use('/user', userRoute)
        this.express.use('/read', readRoute)
    }
}