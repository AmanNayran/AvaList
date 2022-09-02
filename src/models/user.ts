import { Schema, model } from "mongoose"
import { UserInterface } from "../interfaces/user"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface UserModel extends UserInterface, Document {
    compararSenhas(senha: string): Promise<boolean>
    gerarToken(): string
}

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    fone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    validEmailToken: {
        type: String,
        required: true,
        select: false,
    },
    validEmailExpires: {
        type: Date,
        required: true,
        select: false,
    }
})

UserSchema.pre<UserModel>('save', async function criptografarSenha() {
    this.password = await bcrypt.hash(this.password, 12)
})

UserSchema.methods.compararSenhas = function(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
}

UserSchema.methods.gerarToken = function(): string {
    const decodedToken = {
        _id: String(this._id),
        name: this.name,
        email: this.email
    }

    return jwt.sign(decodedToken, 'secret', {
        expiresIn: '1d'
    })
}

export default model<UserModel>('User', UserSchema)