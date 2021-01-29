//get the Post Schema
const Post = require('../../models/Post');

//error for user input errors
const { UserInputError,AuthenticationError} = require("apollo-server");

//get the function for checking the authorization token
const checkAuth = require('../../utils/check-auth');


module.exports = {
    //bug found: forgot the colon after mutation
    Mutation: {
        
        createComment: async (_, {postId, body}, context) => {

            //context helps to know if user is logged in
            const {username} = checkAuth(context);

            //empty comments, throw error
            if (body.trim() === '') {
                throw new UserInputError("Error", {
                    //we're sending this payload
                    errors: {
                        body: "Comment Body cannot be empty."
                }
            });
            }

            //if its not empty; find the post by ID
            const post = await Post.findById(postId);

            //mongoose allows us to access the comments like this
            //unshift adds the comment to the top
            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                });
                //save the post
                await post.save();

                return post;
            } else {
                //findById could not find the post
                throw new UserInputError("Post not found");
            }
        },

        //notice how its defined diff than previous function
        async deleteComment(_, {postId, commentId}, context){
            //context helps to know if user is logged in
            const {username} = checkAuth(context);

            const post = await Post.findById(postId);

            //if post exists
            if (post) {
                //find comment where the comment id = the one we are looking for
                const commentIndex = post.comments.findIndex(c => c.id === commentId);

                //users can only remove comments they made
                if (post.comments[commentIndex].username === username) {
                    //start at comment index and just remove one
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    //user isnt authorized to delete the post
                    //safety check, this wont be available as option in frontend
                    throw new AuthenticationError("User is not authorized to delete the post");
                }

            } else {
                //user isnt authorized to delete the post
                throw new UserInputError("Post not found");
            }
        },

        async likePost(_,{postId}, context) {
            const {username} = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                //a post can only have one like per username and if this like exists
                if (post.likes.find(like => like.username === username)) {
                    //unlike it
                    post.likes = post.likes.filter(like => like.username !== username);
                } else {
                    //add like
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save();
                return post;
            } else {
                //user isnt authorized to delete the post
                throw new UserInputError("Post not found");

            } 
        }
    }
}
