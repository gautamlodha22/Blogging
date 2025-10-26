require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); 
const Blog = require('./models/blog.js')
const userRouter = require('./routes/user.js');
const blogRouter = require('./routes/blog.js')
const { checkForAuthentication } = require('./middlewares/authentication.js');
const app = express();
const PORT = process.env.PORT || 8000 ;
mongoose.connect(process.env.MONGO_URL).then(function(e){
    console.log("mongoDb is connected"); 
})
app.set('view engine','ejs');
app.set('views',path.resolve("./views"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthentication("token"));
app.use(express.static(path.resolve('./public')))
app.use(express.urlencoded({extended : true}))

app.get('/',async(req,res)=>{
    const allblog = await Blog.find({})
    // console.log('user',req.user);
    res.render('home',{
        user : req.user,
        blogs : allblog
    });
})
app.use('/user',userRouter);
app.use('/blog',blogRouter);


app.listen(PORT,()=>console.log(`server running at PORT ${PORT}`))