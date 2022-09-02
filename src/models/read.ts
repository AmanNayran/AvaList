import mongoose, { Schema, model } from "mongoose"
import { ReadInterface } from "../interfaces/read"
import user from "./user"

interface ReadModel extends ReadInterface, Document {
    
}

const ReadSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    page: {
        type: Number,
        required: true,
    },
    _id: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    }
})

export default model<ReadModel>('user', ReadSchema)