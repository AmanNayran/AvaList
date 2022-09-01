import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/user';
import { connect } from 'mongoose';
import config from 'config';
require('dotenv').config();

export class App{
    private express: express.Application;
    //private porta = config.get<number>('porta');
    private porta = 8000;

    constructor(){
        this.express = express();
        this.database();
        this.middlewares();
        this.routes();
        this.listen();
    }

    public getApp(): express.Application {
        return this.express;
    }

    private middlewares(): void {
        this.express.use(express.json());
    }

    private listen(): void{
        this.express.listen(this.porta, () => {
            console.log('Servidor ta na porta ' + this.porta);
        });
    }

    private async database() {
        await connect('mongodb+srv://nayran:instacon123@cluster0.rrgc6.mongodb.net/?retryWrites=true&w=majority');
    }

    private routes(): void{
        this.express.use('/user', userRoute)
    }
}