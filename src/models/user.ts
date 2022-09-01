import { Schema, model } from "mongoose"
import { UsuarioInterface } from "../interfaces/user"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface UsuarioModel extends UsuarioInterface, Document {
    compararSenhas(senha: string): Promise<boolean>;
    gerarToken(): string;
}

const UsuarioSchema = new Schema({
    nome: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required: true,
    },
    senhaResetToken: {
        type: String,
        required: true,
        select: false,
    },
    senhaRestExpires: {
        type: Date,
        required: true,
        select: false,
    },
    email: {
        type: String,
        required: true,
    }
});

UsuarioSchema.pre<UsuarioModel>('save', async function criptografarSenha() {
    this.senha = await bcrypt.hash(this.senha, 8);
})

UsuarioSchema.methods.compararSenhas = function(senha: string): Promise<boolean> {
    return bcrypt.compare(senha, this.senha);
}

UsuarioSchema.methods.gerarToken = function(): string {
    const decodedToken = {
        _id: String(this._id),
        nome: this.nome,
        email: this.email
    };

    return jwt.sign(decodedToken, 'secret', {
        expiresIn: '1d'
    });
}

export default model<UsuarioModel>('Usuario', UsuarioSchema);