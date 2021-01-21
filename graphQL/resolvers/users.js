//requires the user model schema
const User = require('../../models/Users');

//import bcrypt and jsonwebtoken
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//better to store the secret in config file
const { SECRET_KEY } = require('../../config');

//error messages from apollo
const { UserInputError } = require('apollo-server');

//import validations, need destructuring bc default export
//bug: function not found, just had to redo the paths
const { validateRegisterInput, validateLoginInput } = require('../../utils/validations');

//turn token generation into function
function generateToken(user) {
    //create token for users, encode these fields, need to pass in a secret (in config file)
    //third parameter is options, we are using expire in
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' });

}


module.exports = {
    Mutation: {
        //_ is the parent
        //sample query
        // mutation {
        //     login(username: "user", password: "password") {
        //       id
        //       username
        //       email
        //       token
        //       createdAt
        //     }
        //   }
        async login(_, {username, password}) {
            //validate the user info and make sure its not empty
            const { errors, valid } = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Invalid Entry', {errors});
            }
            
            const user = await User.findOne({username});
            //if user doesn't exist in our system
            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('Wrong Credentials', {errors});
            }

            //compare password with the password in our system, async await
            //current password with system password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Incorrect password';
                throw new UserInputError('Wrong Credentials', {errors});
            }

            //if everything else worked out, we want to issue a token
            const token = generateToken(user);

            return {
                //spread data
                //where document is stored
                ...user._doc,
                //id bc id isnt included in doc
                id: user._id,
                //also give the token
                token
            }

            
        },

        //most of the time we will be using args
        //parent is the result of the last step
        //could have multiple resolvers and get processed in different ways
        //register(parent, args, context, info)
        //destructure the register inputs from args, get access to these fields separately
        async register(_, 
            {registerInput: {username, email, password, confirmPassword}},
            context,info) {
            //TO-DO: Validate user data
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }
            //TO-DO: Make sure user doesn't already exist
            const user = await User.findOne({username});
            //if username exists (findOne)
            if (user) {
                //second arg is the payload to display it on the form
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }


            //DONE: Hash password and create auth token => npm install bcryptjs (script pw) jsonwebtoken (encode data into token)
            
            //bcrypt hashing function is async, turning pw into hash 
            //12 rounds
            password = await bcrypt.hash(password, 12);

            //form our user object
            const newUser = new User({
                email,
                username,
                //found a bug where you try to login and it gives you an error because it cannot find the password
                //by leaving out pw, pw is not being created when the user object is created
                password,
                //turning the date into a string
                createdAt: new Date().toISOString()
            });
            
            //save to db
            const res = await newUser.save();

            //genrate token for registering
            const token = generateToken(res);

            return {
                //spread data
                //where document is stored
                ...res._doc,
                //id bc id isnt included in doc
                id: res._id,
                //also give the token
                token
            }


            //example usage
            // mutation {
            //     register(registerInput: {
            //       username: "user",
            //       password: ___,
            //       confirmPassword: ____,
            //       email: "user@email.com"
            //     }) {
            //       id
            //       email
            //       token
            //       username
            //       createdAt
            //     }
            //   }
        }
    }
}