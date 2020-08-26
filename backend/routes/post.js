const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

/**
 * @Route Post api/post/create-post
 * @Create post
 */
router.post("/create-post", (req, res) => {
  const post = new Post(req.body);
  // console.log(this.post);
  post
    .save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(400).send(`Something warning ${err}`);
    });
});

/**
 * @Route Get api/post
 * @Get post
 */
router.get("/", (req, res, next) => {
  Post.find((err, data) => {
    if (err) {
      return next(err);
    } else {
      res.json(data);
    }
  });
});

/**
 * @Route Get api/post/update-post
 * @Update post
 */
router.post('/update-post/:id', (req, res, next) => {
    Post.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (err, data) => {
        if(err){
            return next(err)
        }else{
            res.json(data)
            console.log('Post updated!');
        }
    })
});

router.delete('/delete-post/:id', (req, res, next) => {
    Post.findByIdAndRemove(req.params.id, (err, data) => {
        if(err){
            return next(err);
        }else{
            res.status(201).json({
                msg: data
            })
        }
    })
})

module.exports = router;
