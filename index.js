//requires GraphQL Apollo to run
const { ApolloServer } = require('apollo-server');

//requires graphQL Apollo dependency
const gql = require('graphql-tag');

//required for mongodb connection
const mongoose = require('mongoose');

//our credientals, good practice to have them in a separate file
const {MONGODB} = require('./config.js');

//get the Post Schema
const Post = require('./models/Post');

//type definition (tag template string)
//queries for graphQL
//! means its required
const typeDefs = gql`
    type Query {
        sayHi : String! 
    }
`

//each of these queries need resolvers
const resolvers = {
    Query: {
        sayHi: () => 'Hello World'
    }
}

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


//to test out the query in graphQL in localhost
//query {
// sayHi
//}