const express = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog.js');
const Comment = require('../models/comment.js');
const User = require('../models/user');
const router = express.Router();

const storage = multer.diskStorage({
    destination : function(req,res,cb){
        cb(null,path.resolve(`./public/uploads/`));
    },
    filename : function(req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName)
    }

})
const upload = multer({storage : storage})
router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user : req.user,
    })
})
router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    if (!blog) {
        // Blog not found, handle gracefully
        return res.status(404).send('Blog not found');
    }
    const comment = await Comment.find({ blogId: req.params.id }).populate('createdBy');
    res.render('blog.ejs', {
        user: req.user,
        blog: blog,
        comment,
    });
});
router.post('/comment/:blogId',async (req,res)=>{
    const comm = await Comment.create({
        content : req.body.content,
        blogId : req.params.blogId,
        createdBy : req.user._id,
    })
    return res.redirect(`/blog/${req.params.blogId}`);
})
router.post('/',upload.single("coverImage"),async(req,res)=>{
    const {title,body} = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy : req.user._id,
        coverImageURL : `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`);
})

module.exports =   router;