const { dbGetUser, dbGetAllUser } = require('../db/db');

async function getUser(request, response, next) {
  try {
    const { params: { id } } = request;
    const user = await dbGetUser(id);
    // If the user does not exist based on the provided id
    if (!user) {
      response.status(404).send({'developerMessage': 'Resource does not exists'});
      return;
    }
    response.send({'data': user});
  } catch (error) {
    next(error);
  }
}

async function getAllUser(request, response, next) {
  try {
    const users = await dbGetAllUser();
    response.send({'data': users})
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUser,
  getAllUser,
};
