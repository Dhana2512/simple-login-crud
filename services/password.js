'use strict';
const bcrypt = require('bcrypt');
const argon2 = require('argon2');

const hash = async (plainPassword) => {
    return argon2.hash(plainPassword);
    //    return bcrypt.hash(plainPassword, 12);
}

const compare = (plainPassword, passwordHash) => {
    return argon2.verify(passwordHash, plainPassword);
    //  return bcrypt.compare(plainPassword, passwordHash);
}

module.exports = {
    hash,
    compare,
}