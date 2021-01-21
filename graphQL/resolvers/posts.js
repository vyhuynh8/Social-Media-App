//get the Post Schema
//when moved over, noticed bug with incorrect file path bc new location
const Post = require('../../models/Post');

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
                const posts = await Post.find();
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        }
    }
}