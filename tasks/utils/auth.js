import jwt from 'jsonwebtoken';

export const Authentication = {
    signToken(response, user) {
        const payload = { 'user': user.login, 'isActive': user.isActive };
        const token = jwt.sign(payload, 'secret_', { expiresIn: 20 });
        response.send(token);
    },
    verifyToken(request, response, next) {
        const token = request.headers['x-access-token'];

        if (token) {
            jwt.verify(token, 'secret_', (err) => {
                if (err) {
                    response.status(403).send();
                } else {
                    return next();
                }
            });
        } else {
            response.status(401).send();
        }
    }
};
