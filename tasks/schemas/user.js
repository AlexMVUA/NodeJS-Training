import Joi from '@hapi/joi';

export const schemas  = {
    user: {
        get: Joi.object({
            id: Joi.string().alphanum().min(2).max(20).required()
        }),
        delete: Joi.object({
            id: Joi.string().alphanum().min(2).max(20).required()
        }),
        update: Joi.object({
            login: Joi.string().alphanum().min(4).max(20).required(),
            password: Joi.string().pattern(new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){3,30}$')).required(),
            age: Joi.number().integer().min(4).max(130).required(),
            isDeleted: Joi.boolean()
        })
    }
};
