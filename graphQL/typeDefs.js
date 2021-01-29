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
        #[] means its an array; ! inside the array means it has to contain at least one element
        comments: [Comment]!
        likes: [Like]!
        #calculate number of likes and comments, lessen load on client
        likeCount: Int!
        commentCount: Int!
    }

    type Comment {
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }

    type Like {
        id: ID!
        createdAt: String!
        username: String!
    }

    type User {
        #requires means user can opt out, but we must return it
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
        getPost(postId: ID!): Post
    }

    #sample of getPost
    # {
    #    getPost(postId: "___") {
    #        id
    #        body
    #        createdAt
    #        username
    #    }
    #}

    #used for registering users, mutation bc change in db
    type Mutation {
        #user type is returned
        register(registerInput: RegisterInput): User!
        #login type definition, only takes username and password
        login(username: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        #takes in what post has been commented on
        createComment(postId: ID!, body: String!): Post!
        #taking post id provides ability if post is still up; if example, post is deleted and comment is as well
        deleteComment(postId: ID!, commentId: ID!): Post!
        #theres no unlike mutation, this serves as a toggle
        likePost(postId: ID!): Post!
    }

    type Subscription {
        #show those are subscribed, hey this new post was created!
        newPost: Post!
    }
`;