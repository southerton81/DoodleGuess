var crypto = require('crypto');
var fs = require('fs');

var salt = fs.readFileSync('config/salt').toString();

var hashPassword = function(password) {
    const key = crypto.pbkdf2Sync(password, salt, 100000, 128, 'sha512');
    var value = key.toString('hex').substr(0, 256);
    return value;
};

module.exports = hashPassword;