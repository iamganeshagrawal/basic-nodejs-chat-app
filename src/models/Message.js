const {Schema, model}  = require('mongoose');
// const shortid = require('shortid');

let Message = new Schema({
    // _id: {
    //     type: String,
    //     default: shortid.generate
    // },
    name: String,
    message: String
});

module.exports = model('message', Message)