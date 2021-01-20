//the resolvers for graphQL
const postResolvers = require("./posts");
const userResolvers = require("./users");

module.exports = {
    Query: {
        ...postResolvers.Query
    }
}