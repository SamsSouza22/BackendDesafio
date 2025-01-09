import jsonwebtoken from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets.mjs';

export default function authMiddleware(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).send({ message: 'Token not provided' });
    }
    const [, token] = authorization.split(' ');

    try {
        const decoded = jsonwebtoken.verify(token, JWT_SECRET);
        req.logged_user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Token invalid' });
    }
}