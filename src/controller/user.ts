import { Request, Response } from "express"
import UserModel from "../models/user"
import crypto from "crypto"
const mailer = require("../models/mailer")


class UserController {
    public async cadastrar(req: Request, res: Response){
        const user = await UserModel.create(req.body);
        const mensagem = {
            message: 'Registration success!',
            _id: user._id,
            name: user.name,
            fone: user.fone,
            email: user.email,
            password: user.password
        }
        return res.json(mensagem)
    }
    
    public async listaUser(req: Request, res: Response): Promise<Response>{
        const users = await UserModel.find(req.body)
        return res.json(users)
    }

    public async autenticar(req: Request, res: Response): Promise<Response> {
        const { name, password } = req.body

        const user = await UserModel.findOne({ name });
        if (!user) {
            return res.status(400).send({ error: 'User not found!'});
        }
        
        const senhaValida = await user.compararSenhas(password);
        if (!senhaValida) {
            return res.status(400).send({ error: 'Password invalid!'});
        }
        
        return res.json({
            user: user,
            token: user.gerarToken()
        })
    }
    
    
    public async enviaValidacaoEmail(req: Request, res: Response): Promise<Response>{
        const { email } = req.body
        try {
            const user = await UserModel.findOne({ email })

            if (!user) {
                return res.status(400).send({ error: 'User not found!' })
            }

            const token = crypto.randomBytes(5).toString('hex')

            const now = new Date()
            now.setHours(now.getHours() + 2)

            await UserModel.findByIdAndUpdate(user._id, {
                '$set': {
                    validEmailToken: token,
                    validEmailExpires: now,
                }
            })

            mailer.sendMail({
                to: email,
                from:'aman@gmail',
                subject: "Validação de email",
                text: "Para validar seu usuário use o Token: " + token,
            }), (err) => {
                if (err)
                    return res.status(400).send({ error: 'There was a problem!' })
                
                return res.send()
            }
            
            return res.json({
                validEmailToken: token,
                validEmailExpires: now
            })

        } catch (error) {
            return res.status(400).send({ error: 'There was a problem!' })
        }
    }
        
    public async validaEmail(req: Request, res: Response){
        const { email, token } = req.body

        try {
            const user = await UserModel.findOne({ email })
                .select('+validEmailToken validEmailExpires')
            
            if (!user)
                    return res.status(400).send({ error: 'User not found!' })
    
                    if (token !== user.validEmailToken)
                    return res.status(400).send({ error: 'Token not valid!' })
                    
            const now = new Date()
            
            if (now > user.validEmailExpires)
                return res.status(400).send({ error: 'Token Expires!' })
                
            if (token == user.validEmailToken)
            return res.status(200).send({ error: 'Email is valid!' })
            
        } catch (error) {
            return res.status(400).send({ error: 'There was a problem!' })
        }

}

export default new UserController()