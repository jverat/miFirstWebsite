import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    token: { type: String, unique: true }
},
    {
        timestamps: true,
    });

export interface UserInt {
    username: string;
    password: string;
    salt: string;
    email: string;
    toke: string;
    createdAt: Date;
    updatedAt: Date;
}

export default model('User', userSchema);