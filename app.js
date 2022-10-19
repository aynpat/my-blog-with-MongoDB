//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
let fs = require("fs")
const path = require("path")

const multer = require("multer");
const { ObjectId } = require("mongodb");
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();


const app = express();
// app.use('/uploads', express.static('uploads'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect('mongodb://127.0.0.1:27017/postDB')

const postSchemas = new mongoose.Schema({
  title : String,
  posts : String,
  
})

const postSchema = new mongoose.Schema({
  title : String,
  post : String,
  img : {
    data : Buffer,
    contentType : String
  },
  date: { type: Date, required: true }
});

const blogPost = new mongoose.model('blogPost',postSchema);

const blogPostsss = mongoose.model('blogpost',postSchema);

var storage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, "uploads")
  },
  filename : (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-'))
  }
});

let upload = multer({ storage: storage });

///////////////////////////////////////////////////////////////////////////////////////////

app.get('/',(req,res) =>{
    blogPost.find({},(err,items) =>{
      if(err){
        console.log(err)
        res.status(500).send('An error occured', err)
      }
      else {
        res.render('home', {items: items });
      }
    });
});

// ///////////////////////////////////////////////////////////////////////////////////////

app.post('/compose',upload.single('image'),(req, res) => {
  let obj = {
     title : req.body.postTitle,
     post : req.body.postMessage,
     img : {  data : fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      contentType : 'image/png'
    },
    date : today.toLocaleDateString("en-US", options)
  
    
  }


   blogPost.create(obj,(err,item) => {
      if(err){
        console.log(item);
      }
      else {
        //this item is save();
        res.redirect('/compose')
      }
   })
})

///////////////////////////////////////////////////////////////////////////////////////



  
// });

app.get("/about",(req,res)=>{
  res.render('about',{
    aboutContent :aboutContent
  })
});

app.get("/contact",(req,res)=>{
  res.render('contact',{
    contactContent : contactContent
  })
});

app.get('/compose',(req,res)=>{
  res.render('compose')
})

// app.post('/compose',(req,res)=>{
//   const postMessage = req.body.postMessage;
//   let postTitle = req.body.postTitle;
  
//   const post = {
//     title : postTitle,
//     message : postMessage
//   }


//   const createPost = new blogPost({
//     title : post.title,
//     posts : post.message
//   })

  
//   createPost.save()
//   res.redirect('/compose')
// })

////////////////////////////////////////////////////////////////

app.get('/posts/:postId',(req,res)=>{
  const postId = req.params.postId;
  blogPost.findOne({_id : ObjectId(postId)},function(err,post){

    if(!err){
      console.log('walang error')
      res.render('post',{
        postTitle : post.title,
        postContent : post.post
      })
    }
    else{
      console.log('may error')
    }

  })

})

//////////////////////////////////////////////////////////////

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
