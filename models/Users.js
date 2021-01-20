//will hold details about user schema
//mongodb is schemaless but we can still specify it with mongoose

//grabbing components from mongoose
const { model, Schema } = require('mongoose');

//defining the user schema
const userSchema = new Schema ({
    //passing in the fields, could specify if required
    //graphQL can be used to handle required fields rather than mongoose
    username: String,
    password: String,
    email: String,
    createdBy: String
});

//export the module
module.exports = model('User', userSchema);