import { Request, Response } from "express"
import ReadModel from "../models/read"
import UserModel from "../models/user"

class ReadController {
 
    
    public async listaRead(req: Request, res: Response){
        try {
            const read = await ReadModel.find()
            res.send({ read })
        } catch (error) {
            return res.status(400).send({ error: 'Error loading readings!' })
        }
    }
    public async CreateRead(req: Request, res: Response){
        try {
            const { title, description, _id } = req.body
            const read = await ReadModel.create({ title, description, _id })
            await read.save()
            
            return res.send({ read })
        } catch (error) {
            return res.status(400).send({ error: 'Error create new reading!' })
        }
    }
    public async deleteRead(req: Request, res: Response){
        try {
            await ReadModel.findByIdAndRemove()
            res.send()
        } catch (error) {
            return res.status(400).send({ error: 'Error delete reading!' })
        }
    }

}

export default new ReadController()