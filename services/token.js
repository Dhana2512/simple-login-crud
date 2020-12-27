'use strict';
const jwt = require('jsonwebtoken');
const secret = 'qwertyuiopasdfghjklzxcvbnm';

const generateToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, { expiresIn: '12h' }, (error, token) => {
            if (error) {
                return reject(error);
            }

            resolve(token);
        });
    });
}

const verifyToken = (token) => {
      return new Promise ((resolve,reject) => {
        jwt.verify(token, secret, function(error, decoded) {
            if (error) {
              reject(error)
            } else {
                resolve(decoded);
            }
          });
    }) 
}

module.exports = {
    generateToken,
    verifyToken
}