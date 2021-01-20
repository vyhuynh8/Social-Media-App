//grabbing components from mongoose
const { model, Schema } = require('mongoose');

//defining the post schema
const postSchema = new Schema ({
    //passing in the fields, could specify if required
    //graphQL can be used to handle required fields rather than mongoose
    body: String,
    username: String,
    createdAt: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    //mongodb is schemaless, noSQL, no relations
    //but we can relations between our models
    //we could link our users
    //mongoose can autopopulate this user field
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Post', postSchema)