//get the Post Schema
//when moved over, noticed bug with incorrect file path bc new location
const Post = require('../../models/Post');

//get the function for checking the authorization token
const checkAuth = require('../../utils/check-auth');

//error for auth errors
const { AuthenticationError } = require("apollo-server");

//what you're exporting out of this file to the main index file
//each of these queries need resolvers
module.exports = {
    Query: {
        //sayHi: () => 'Hello World'
        async getPosts() {
            //needed just in case post fails, you dont want the server to be stopped
            //await needed bc async
            //debugging bug found: forgot to return posts and post -> posts
            try {
                //we want to get the latest post first
                const posts = await Post.find().sort({createdAt:-1});
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },

        //get specfic post
        async getPost(_, {postId}) {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    //if post is found, return it
                    return post;
                } else {
                    //else return an error
                    throw new Error("Post not found");
            }} catch (err) {
                throw new Error("Post not found");
            }
        }},

        //mutation because we are changing the code
        //doesnt make a diff if its in the post or the user resolvers
        //bug resolved: the mutation was in the query bracket

        //Sample Query:
        // mutation{
        //     createPost(body:"This is a new post") {
        //       id
        //       body
        //       createdAt
        //       username
        //     }
        //   }
        //HTTP HEADER 
        // {
        //     "Authorization":"Bearer 2222"
        // }
    Mutation: {
        async createPost(_, { body }, context) {
            //the way this works is user login to get an authentication token and send it via the header
            //decode and make sure it is a valid token

            //user is returned if theres no errors
            const user = checkAuth(context);

            console.log(user);

            //creating the new post
            const newPost = new Post({
                body,
                //post model has user in it
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            //save this post, async
            const post = await newPost.save();

            return post;
        },

        async deletePost (_, {postId}, context)  {
            //make sure its valid user
            const user = checkAuth(context);

            //make sure user is the same one who created the post, in order to delete the post
            try {
                const post = await Post.findById(postId);
                if (user.username === post.username) {
                    //if the user matches the one attached to the post
                    await post.delete();
                    return "Post deleted successfully";
                } else {
                    //if not, they're not authorized to delete the post
                    throw new AuthenticationError("Action is not allowed");
                }
            } catch(err) {
                throw new Error(err);
            }
        }

    }
    
}