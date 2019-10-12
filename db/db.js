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
  const queryString = 'SELECT id, first_name, last_name, email, created_on FROM users';
  const { rows } = await pool.query(queryString);
  return rows;
}

/*
async function dbGetUserPassword (id) {
  const queryString = 'SELECT _id, password FROM "project-owners" WHERE _id = ($1)::uuid';
  const values = [id];
  const { rows: [data] } = await pool.query(queryString, values);
  if (!data) {
    const message = 'Bad request';
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }
  return data;
}
*/

module.exports = {
  dbAddUser,
  dbDeleteUser,
  dbGetUser,
  dbGetAllUser
}