import { Schema, model } from "mongoose";
import { UsuarioInterface } from "../interfaces/user";
import bcrypt from 'bcrypt'

interface UsuarioModel extends UsuarioInterface, Document {
    compararSenhas(senha: string): Promise<boolean>;
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

export default model<UsuarioModel>('Usuario', UsuarioSchema);