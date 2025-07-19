const Joi = require('joi');

const userRegistrationSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    preferences: Joi.array().items(Joi.string()).default([])
});

const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const preferencesSchema = Joi.object({
    preferences: Joi.array().items(Joi.string()).required()
});

const validateUserRegistration = (data) => {
    return userRegistrationSchema.validate(data);
};

const validateUserLogin = (data) => {
    return userLoginSchema.validate(data);
};

const validatePreferences = (data) => {
    return preferencesSchema.validate(data);
};

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validatePreferences
}; 