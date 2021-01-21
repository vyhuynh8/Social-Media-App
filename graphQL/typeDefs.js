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

    type User {
        #reqires means user can opt out, but we must return it
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }

    #input to resolver for it to return something to us
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Query {
        #sayHi: String!
        getPosts: [Post]
    }

    #used for registering users, mutation bc change in db
    type Mutation {
        #user type is returned
        register(registerInput: RegisterInput): User!
        #login type definition, only takes username and password
        login(username: String!, password: String!): User!
    }
`;