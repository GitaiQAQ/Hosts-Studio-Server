/**
 * Created by ken.xu on 14-1-27.
 */
var crypto = require('crypto');
module.exports = {
    md5: function (text,encoding) {
        //return crypto.createHash('md5').update(text).digest('hex');
        return crypto.createHash('md5').update(this.bufferStr(text)).digest(encoding || 'hex');
    },

    bufferStr:function(value) {
        return Buffer.isBuffer(value) ? value : this.toStr(value);
    },

    toStr:function (value) {
        return (value || value === 0) ? (value + '') : '';
    },

    d: function (crypted,secret) {

        var decipher = crypto.createDecipher('aes-256-cbc', secret||Configs.secret);
        var dec = decipher.update(crypted, 'hex', 'utf8')
        dec += decipher.final('utf8')
        return dec;
    },

    e: function (text,secret) {
        var cipher = crypto.createCipher('aes-256-cbc', secret||Configs.secret);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },

    base64:  function (text) {
        return new Buffer(text).toString('base64');
    },

    Hashsha1:  function (text) {
        var shasum = crypto.createHash('sha1');
        shasum.update(text);
        var d = shasum.digest('hex');
        return d.toString('base64');
    },
    Hmacsha1:  function (text,secret) {
        var shasum = crypto.createHmac('sha1',secret||Configs.secret);
        shasum.update(text);
        var d = shasum.digest('hex');
        return d.toString('base64');
    },
}