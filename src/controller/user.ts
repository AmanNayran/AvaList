import e, { Request, Response } from "express"
import UsuarioModel from "../models/user"
import crypto from "crypto"
const mailer = require("../models/mailer")


class UsuarioController {
    public async cadastrar(req: Request, res: Response): Promise<Response> {
        const user = await UsuarioModel.create(req.body);
        const mensagem = {
            message: 'Usuario cadastrado com sucesso!',
            _id: user._id,
            nome: user.nome,
            email: user.email,
            senha: user.senha
        }
        return res.json(mensagem);
    }

    public async autenticar(req: Request, res: Response): Promise<Response> {
        const { nome, senha } = req.body;

        const user = await UsuarioModel.findOne({ nome });
        if (!user) {
            return res.status(400).send({ message: 'Usuario nao encontrado!'});
        }
        
        const senhaValida = await user.compararSenhas(senha);
        if (!senhaValida) {
            return res.status(400).send({ message: 'Senha invalida!'});
        }
        
        return res.json({
            user: user,
            token: user.gerarToken()
        });
    }
    
    public async listaUser(req: Request, res: Response): Promise<Response>{
        const users = await UsuarioModel.find(req.body);
        return res.json(users);
    }
    
    public async esqueciSenha(req: Request, res: Response): Promise<Response>{
        const { email } = req.body;
        try {
            const user = await UsuarioModel.findOne({ email });

            if (!user) {
                return res.status(400).send({ message: 'Usuario nao encontrado!' });
            }

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await UsuarioModel.findByIdAndUpdate(user._id, {
                '$set': {
                    senhaResetToken: token,
                    senhaResetExpires: now,
                }
            });

            mailer.sendMail({
                to: email,
                from:'aman@gmail',
                subject: "Esqueci minha senha",
                text: "Para redefinir a senha use o Token: " + token,
            }), (err) => {
                if (err)
                    return res.status(400).send({ message: 'Desculpe algo deu errado!'});
                
                return res.send();
            }
            
            return res.json({
                senhaResetToken: token,
                senhaResetExpires: now
            });

        } catch (error) {
            return res.status(400).send({ message: 'Desculpe algo deu errado!'});
        }
    }

    public async resetSenha(req: Request, res: Response): Promise<Response> {
        const { email, token, senha } = req.body;

        const user = await UsuarioModel.findOne({ email })
            .select('+senhaResetToken senhaResetExpires');
        
        if (!user)
                return res.status(400).send({ message: 'Usuario nao encontrado!' })

        if (token !== user.senhaResetToken)
                return res.status(400).send({ message: 'Token nao valido!' })
        
        const now = new Date();

        if (now > user.senhaResetExpires)
            return res.status(400).send({ message: 'Token Expirou!' })
            
            user.senha = senha;
            
            await user.save();
            
        return res.status(200).send({ message: 'Senha alterada com sucesso!' })
    }    


}

export default new UsuarioController();