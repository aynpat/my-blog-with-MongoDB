//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
let fs = require("fs")
const path = require("path")

const multer = require("multer")
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const app = express();
// app.use('/uploads', express.static('uploads'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect('mongodb://127.0.0.1:27017/postDB')

const postSchema = new mongoose.Schema({
  title : String,
  posts : String
})

const imageSchema = new mongoose.Schema({
  name : String,
  desc : String,
  img : {
    data : Buffer,
    contentType : String
  }
});

const Image = new mongoose.model('Image',imageSchema);

const blogPost = mongoose.model('blogpost',postSchema);

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

app.get('/show',(req,res) =>{
    Image.find({},(err,items) =>{
      if(err){
        console.log(err)
        res.status(500).send('An error occured', err)
      }
      else {
        res.render('imagePage', {items: items });
      }
    });
});

// ///////////////////////////////////////////////////////////////////////////////////////

app.post('/show',upload.single('image'),(req, res) => {
  let obj = {
     name : req.body.name,
     desc : req.body.desc,
     img : {  data : fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      contentType : 'image/png'
    }
  
    
  }


   Image.create(obj,(err,item) => {
      if(err){
        console.log(item);
      }
      else {
        //this item is save();
        res.redirect('/show')
      }
   })
})

///////////////////////////////////////////////////////////////////////////////////////



app.get("/",(req,res)=>{

  blogPost.find({},function(err,result){
    res.render("home",{homeContent : result})
  })

  
});

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

app.post('/compose',(req,res)=>{
  const postMessage = req.body.postMessage;
  let postTitle = req.body.postTitle;
  
  const post = {
    title : postTitle,
    message : postMessage
  }


  const createPost = new blogPost({
    title : post.title,
    posts : post.message
  })

  
  createPost.save()
  res.redirect('/compose')
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
