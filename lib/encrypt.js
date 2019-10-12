const bcrypt = require('bcrypt');

const round = 10;

async function encryptPassword(password) {
  return await bcrypt.hash(password, round);
}

async function comparePassoword(password, encryptedPassword) {
  return await bcrypt.compare(password, encryptedPassword);
}

module.exports = {
  comparePassoword,
  encryptPassword,
}