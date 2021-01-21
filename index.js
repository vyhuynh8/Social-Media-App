//use npm index => npm start to start application
//get nodenom in order to automatically restart the server whenever theres any changes (npm i -D nodemon, edit package.json)

//requires GraphQL Apollo to run
const { ApolloServer } = require('apollo-server');

//required for mongodb connection
const mongoose = require('mongoose');

//our credientals, good practice to have them in a separate file
const {MONGODB} = require('./config.js');

//importing the typeDefs for graphQL from different file
const typeDefs = require('./graphQL/typeDefs');

//importing the resolvers for the typeDefs for graphQL
//since it is in the index, we dont need to specify the specific file
const resolvers = require('./graphQL/resolvers');

//setting up GraphQL Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers
});

//connecto mongodb database
//we're getting the string from the mongodb dashboard => connect your application for connection string
//pass object useNewUrlParser, will get deprecation if we don't use it
//had to add the useUnifiedTopology because of depreciated changes
mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('MongoDB Connected');
    //start our server, specified a port
    //results  => logs to console so we can see it
    //node index to run our index file
    //running express server in the backend
    return server.listen({ port:5000});
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);});


// to test out the query in graphQL in localhost
// query {
//  sayHi
// }
// ctrl + space for fields in graphQL
// query {
//     getPosts{
//       id
//       body
//       createdAt
//       username
//     }
//   }