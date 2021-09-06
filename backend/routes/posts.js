const express = require('express');
const Post = require('../models/post');
const router = express.Router();

//re-organizing all the api calls from router.js
router.post('',(req, res, next) => { //api/posts is removed here, bcz it is add in the use method in app.js, anthing after that can be included here like /:id
  //const post = req.body;
  const post = new Post({   //using the model
    title: req.body.title,
    content: req.body.content
  });
  // console.log(post);
  post.save()  //since it is schema, the collection name would automatically will be plural form of model name(Post) from post.js -> Posts
  .then(createdPost => {
    res.status(201).json({
      message: 'Posts added successfully',
      postId: createdPost._id
    });
  });
});
//can use put/patch
//put: to completely replace a resource
//patch to update the existing with values
router.put('/:id',(req, res, next) => {
  const post = new Post({
    _id: req.body.id,   //since we cannot post without id
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: 'Update successful',})
  })
})
router.get('', (req, res, next) => {   //use -> get here to be more precise
  // raw form of getting the posts
  // const posts = [
  //   {
  //     id: '01',
  //   title: 'First server-side post',
  //   content: 'This is coming from server'
  // },
  // {
  //   id: '02',
  //   title: 'Second server-side post',
  //   content: 'This is coming from server!'
  // }
  // ];

  //using mongodb
  Post.find()    //then works like a promise, then holds our results
  .then(documents => {
    console.log(documents)
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    });
  });

});

router.get("/:id", (req, res, next) => [
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    }else{
      res.status(404).json({ message: 'Post not found'})
    }
  })
])
// api/posts/someid will be fetched by express
router.delete("/:id", (req, res, next) => {
  //console.log(req.params.id);
  Post.deleteOne({_id: req.params.id})
  .then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Posts deleted successfully'
    });
  })
});

module.exports = router;
