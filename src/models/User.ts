import { Schema, model} from 'mongoose';

const userSchema = new Schema ({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    email: { type: String, required: true, unique:true, lowercase: true}
},
{
   timestamps: true,
});

userSchema.methods.validate = (inputPassword: String): boolean => {
    return inputPassword === userSchema.get('password');
}

export default model('user', userSchema);