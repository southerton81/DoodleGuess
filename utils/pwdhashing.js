var crypto = require('crypto');
var fs = require('fs');

var salt = fs.readFileSync('./salt').toString();

var hashPassword = function(password) {
    var hash = crypto.createHmac('sha256', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return value;
};

module.exports = hashPassword;