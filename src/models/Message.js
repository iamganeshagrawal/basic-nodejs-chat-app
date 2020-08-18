const {Schema, model}  = require('mongoose');


let Message = new Schema({
    name: String,
    message: String
});

module.exports = model('message', Message)