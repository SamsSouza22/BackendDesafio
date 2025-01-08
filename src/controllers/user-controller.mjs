import prismaClient from '../utils/prismaClient.mjs';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6)
});

class UserController{
    async register(req, res){
        const { email} = req.body; 
        const user = userSchema.parse(req.body);

        const userExists = await prismaClient.user.findUnique({where: {email}});

        if(userExists){
            return res.status(400).json({error: 'User already exists'});
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(user.password, salt);

        const newUser = await prismaClient.user.create({
            data: {
                ...user,
                password: hashPassword
            }
        });

        delete newUser.password;

        res.send(newUser);
    }

    async login(req, res){

    }

    async post(req, res){

    }
}

export default UserController;