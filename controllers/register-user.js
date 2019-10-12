const { dbAddUser } = require('../db/db');
const { validateUser } = require('../lib/validate');

async function registerUser(req, res, next) {
  try {
    const { body: { first_name, last_name, email, password }} = req;
    const validationError = validateUser({first_name, last_name, email, password});
    if (validationError) {
      const error = new Error(validationError);
      error.statusCode = 400;
      next(error);
    } 
    await dbAddUser(first_name, last_name, email, password);
    res.status(201).end();
  } catch (error) {
    // if email is already used
    if (error.code === '23505') {
      const uniqeError = new Error(error.detail);
      uniqeError.statusCode = 400;
      next(uniqeError);
      return;
    }
    next(error);
  }
}

module.exports = registerUser;
