var DatabaseError = require('./../error/errors.js').HttpError;

var HttpUtils = {}

HttpUtils.get = function (url, postProcessCallback) {
    return new Promise((resolve, reject) => {
        const httpLib = url.startsWith('https') ? require('https') : require('http');
        const request = httpLib.get(url, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new HttpError(response.statusCode, 'getContent failed'));
            }
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => {
                try {
                    let result = postProcessCallback(body.join(''));
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            });
        });
        request.on('error', (err) => reject(err))
    })
};

module.exports = HttpUtils;