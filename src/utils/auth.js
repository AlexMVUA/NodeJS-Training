import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';

export const Authentication = {
    signToken(response, user) {
        const payload = { 'user': user.login, 'isActive': user.isActive };
        const token = jwt.sign(payload, process.env.ENV_SECRET, { expiresIn: process.env.ENV_EXPIRATION_TIME_SECONDS });
        response.send(token);
    },
    verifyToken(request, response, next) {
        const token = request.headers['x-access-token'];

        if (token) {
            jwt.verify(token, process.env.ENV_SECRET, (err) => {
                if (err) {
                    response.status(HttpStatus.FORBIDDEN).send();
                } else {
                    return next();
                }
            });
        } else {
            response.status(HttpStatus.UNAUTHORIZED).send();
        }
    }
};
