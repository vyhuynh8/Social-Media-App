//this middleware/helper-function used in multiple routes so check auth has its own function

//used for decoding token
const jwt = require("jsonwebtoken");

//needed to decode the token
const { SECRET_KEY } = require("../config");

//error for auth errors
const { AuthenticationError } = require("apollo-server");

//get the context and do the following
module.exports = (context) => {
    //context has headers in it
    //{...headers}
    //req = request
    //bug found: forgot context.req.headers not just context.req, fixed after putting res => res in the server in index.js
    const authHeader = context.req.headers.authorization;

    //if it exist, we need to  get the token from it
    //convention when working with auth token is "Bearer Token"
    if (authHeader) {
        //Bearer ...
        //get whats after the bearer
        const token = authHeader.split('Bearer ')[1];

        //if token exists
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        //if the token doesn't exist
        throw new Error('Authentication token must be \' Bearer [token]');
    }
    //if we didn't get auth header
    throw new Error('Authorization header must be provided.');

}