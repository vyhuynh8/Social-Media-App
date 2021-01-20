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
    type Post {
        id: ID! 
        body: String!
        username: String!
        createdAt: String!
    }
    type Query {
        #sayHi: String!
        getPosts: [Post]
    }
`;

//each of these queries need resolvers
const resolvers = {
    Query: {
        //sayHi: () => 'Hello World'
        async getPosts() {
            //needed just in case post fails, you dont want the server to be stopped
            //await needed bc async
            //debugging bug found: forgot to return posts and post -> posts
            try {
                const posts = await Post.find();
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        }
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