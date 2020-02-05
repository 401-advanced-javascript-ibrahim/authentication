/* eslint-disable strict */
'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

const users = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

users.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 5);
  }
  return Promise.reject();
});

// users.statics.authenticateBasic = function (auth) {
//   let query = { username: auth.username };
//   return this.findOne(query)
//     .then(user => user && user.comparePassword(auth.password))
//     .catch(err => console.error(err));
// };

// users.methods.comparePassword = function (pass) {
//   return bcrypt.compare(pass, this.password)
//     .then(valid => valid ? this : null);
// };

users.statics.authenticateBasic = async function (user, pass) { /// I got confused to use eathier statcs or methods for this function
  let valid = await bcrypt.compare(pass, this.password);
  return valid ? user : Promise.reject();
};

users.methods.tokenGenerator = function () {
  let token = {
    id: this._id,
  };

  return jwt.sign(token, SECRET);
};

module.exports = mongoose.model('users', users);

/// This Code based on class13 starter code