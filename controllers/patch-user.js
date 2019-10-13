const { dbPatchProjectOwner, dbGetUserPassword } = require('../db/db');
const { validateEmail, validatePassword } = require('../lib/validate');
const { comparePassoword, encryptPassword } = require('../lib/encrypt');

async function updateEmail(request, response, next) {
  try {
    const { params: { id } } = request;
    const { body: { email, password } } = request;
    
    // if the request body has not contain the required fields
    if (!(email && password)) {
      response.status(400).send({'developerMessage': 'Bad Request'});
      return;
    }

    const validationError = validateEmail(email);
    if (validationError) {
      response.status(400).send({'developerMessage': validationError});
      return;
    }

    // if the stored password doesn't match the provided password return 400
    const storedPassword = await dbGetUserPassword(id);
    const validPassword = await comparePassoword(password, storedPassword);
    if (!validPassword) {
      response.status(400).send({'developerMessage': 'Invalid credentials'});
      return;
    }

    const data = await dbPatchProjectOwner(id, 'email', email);
    if (!data) {
      response.status(404).send({'developerMessage': 'Resource does not exists'});
      return;
    }
    response.send({data});
  } catch(error) {
    next(error);
  }
}

async function updatePassword (request, response, next) {
  try {
    const { params: { id } } = request;
    const { body: { newPassword, oldPassword } } = request;

    // if the request body has not contain the required fields
    if (!(newPassword && oldPassword)) {
      response.status(400).send({'developerMessage': 'Bad Request'});
      return;
    }

    // if the new password same as the old one return 400
    if (newPassword === oldPassword) {
      response.status(400).send({'developerMessage': 'Invalid credentials'});
      return;
    }

    // if the new password doesn't match the conditions return 400
    const validationError = validatePassword(newPassword);
    if (validationError) {
      response.status(400).send({'developerMessage': validationError});
      return;
    }

    // if the stored password doesn't match the provided password return 400
    const storedPassword = await dbGetUserPassword(id);
    const validPassword = await comparePassoword(oldPassword, storedPassword);

    if (!validPassword) {
      response.status(400).send({'developerMessage': 'Wrong credentials'});
      return;
    }

    const encryptedPassword = await encryptPassword(newPassword);
    await dbPatchProjectOwner(id, 'password', encryptedPassword);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateEmail,
  updatePassword
};
