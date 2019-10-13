const { Pool } = require('pg');
const pool = new Pool();

const { encryptPassword } = require('../lib/encrypt');

async function dbAddUser(first_name, last_name, email, password) {
  const values = [...arguments];
  values[values.length - 1] = await encryptPassword(password);
  const queryString = 'INSERT into users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)';
  await pool.query(queryString, values);
}

async function dbDeleteUser(id) {
  const queryString = 'DELETE FROM users WHERE id = ($1)::uuid';
  await pool.query(queryString, [id]);
}

async function dbGetUser(id) {
  try {
    const queryString = 'SELECT id, first_name, last_name, email FROM users WHERE id = ($1)::uuid';
    const { rows: [userdata] } = await pool.query(queryString, [id]);
    return userdata;
  } catch (error) {
    // if the error come from invalid uuid syntax - meaning the id field is not a valid uuid
    // in that case it handle as the resource does not exists as sending nothing to the controller
    // and the controller handles that case
    if (error.code === '22P02') {
      return undefined;
    }
    throw new Error(error);
  }
}

async function dbGetAllUser() {
  // later as db grows pagination is going to be implemented
  const queryString = 'SELECT id, first_name, last_name, email, created_on FROM users';
  const { rows } = await pool.query(queryString);
  return rows;
}


async function dbGetUserPassword(id) {
  // the controller handles the case where there is no result with the provided id
  const queryString = 'SELECT id, password FROM users WHERE id = ($1)::uuid';
  const { rows: [{ password }] } = await pool.query(queryString, [id]);
  return password;
}

async function dbPatchProjectOwner(id, column, newValue) {
  try {
    const queryString = `UPDATE users SET ${column} = $1 WHERE id = ($2)::uuid RETURNING id, first_name, last_name, email`;
    const { rows : [data]} = await pool.query(queryString, [newValue, id]);
    return data;
  } catch (error) {
    if (error.code === '22P02') {
      return undefined;
    }
    throw new Error(error);
  }
}

module.exports = {
  dbAddUser,
  dbDeleteUser,
  dbGetUser,
  dbGetAllUser,
  dbGetUserPassword,
  dbPatchProjectOwner,
};
