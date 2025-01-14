import prismaClient from '../utils/prismaClient.mjs';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets.mjs';
import { userSchema, authSchema } from '../utils/schemas.mjs';

class UserController {
    async register(req, res) {
        const { email } = req.body;
        const user = userSchema.parse(req.body);

        const userExists = await prismaClient.user.findUnique({ where: { email } });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
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

    async login(req, res) {
        const { email, password } = req.body;
        authSchema.parse({ email, password });

        const user = await prismaClient.user.findFirst({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        const newUser = { id: user.id, name: user.name, email: user.email };
        const token = jsonwebtoken.sign(newUser, JWT_SECRET);

        res.send({ token, user: newUser });
    }

}

export default UserController;