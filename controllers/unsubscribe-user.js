const { dbDeleteUser } = require('../db/db');

async function unsubscribe(request, response, next) {
  try {
    const { params: { id }} = request;
    await dbDeleteUser(id);
    response.status(204).end();
  } catch (error) {
    next(error)
  }
}

module.exports = unsubscribe;