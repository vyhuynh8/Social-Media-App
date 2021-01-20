//requires GraphQL Apollo to run
const { gql } = require('apollo-server');

//type definition (tag template string)
//queries for graphQL
//! means its required
module.exports = gql`
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