const Joi = require('@hapi/joi');

const config = {
  errorMessages: {
    password: 'You must provide a valid password which has to be at least 8 character, including an uppercase, a lowercase and a number',
    email: 'You must provide a valide email adress',
    first_name: 'You must provide a first name',
    last_name: 'You must provide a last name',
    default: 'invalid credentials',
  }
};

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  last_name: Joi.string().required(),
  first_name: Joi.string().required(),
  password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required(),
});

function validateEmail(email) {
  const { error } = Joi.validate(email, userSchema.email);
  if (error) {
    return config.errorMessages.email;
  }
  return false;
}

function validatePassword(password) {
  const { error } = Joi.validate(password, userSchema.password);
  if (error) {
    return config.errorMessages.password;
  }
  return false;
}

function validateUser(user) {
  const { error } = userSchema.validate(user);
  if (error) {
    switch (error.details[0].context.key) {
      case 'email':
        return config.errorMessages.email;
      case 'first_name':
        return config.errorMessages.first_name;
      case 'last_name':
        return config.errorMessages.last_name;
      case 'password':
        return config.errorMessages.password;
      case 'default':
        return config.errorMessages.default;
    }
  }
  return false;
}

module.exports = {
  validateEmail,
  validatePassword,
  validateUser,
};
