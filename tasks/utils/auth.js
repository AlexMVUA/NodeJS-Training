import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';
import { Constants } from './constants.js';

export const Authentication = {
    signToken(response, user) {
        const payload = { 'user': user.login, 'isActive': user.isActive };
        const token = jwt.sign(payload, 'secret_', { expiresIn: Constants.Configuration.EXPIRATION_TIME_SECONDS });
        response.send(token);
    },
    verifyToken(request, response, next) {
        const token = request.headers['x-access-token'];

        if (token) {
            jwt.verify(token, 'secret_', (err) => {
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
