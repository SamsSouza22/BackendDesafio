import prismaClient from '../utils/prismaClient.mjs';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jsonwebtoken from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets.mjs';

const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6)
});

const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

const postSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1)
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
        const { email, password } = req.body;
        authSchema.parse({email, password});

        const user = await prismaClient.user.findFirst({where: {email}});

        if(!user){
            return res.status(400).json({error: 'User not found'});
        }

        if(!bcrypt.compareSync(password, user.password)){
            return res.status(401).json({error: 'Invalid password'});
        }
        const newUser = {id: user.id, name: user.name, email: user.email};
        const token = jsonwebtoken.sign(newUser, JWT_SECRET);

        res.send({token});
    }

    async getPosts(req, res){

    }

    async createPost(req, res){
        const userId = req.logged_user.id;
        const post = postSchema.parse(req.body);

        try {
            const newPost = await prismaClient.post.create({
                data: {
                    ...post,
                    author: {
                        connect: {
                            id: userId
                        }
                    }
                }
            });

            res.status(201).json({ message: "Post created", post: newPost });        } catch (error) {
            console.log(error);
            res.status(500).send({error: 'Internal server error'});
        }
    }

    async updatePost(req, res){

    }

    async deletePost(req, res){

    }
}

export default UserController;