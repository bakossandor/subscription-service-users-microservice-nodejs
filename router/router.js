const registerUser = require('../controllers/register-user');
const unsubscribeUser = require('../controllers/unsubscribe-user');
const { getUser, getAllUser} = require('../controllers/get-users');
const { updatePassword, updateEmail } = require('../controllers/patch-user');

module.exports = (app) => {
  app.get('/users', getAllUser);
  app.post('/users', registerUser);
  app.get('/users/:id', getUser);
  app.delete('/users/:id', unsubscribeUser);
  // app.patch('/:id/password', updatePassword);
  // app.patch('/:id/email', updateEmail);
};
