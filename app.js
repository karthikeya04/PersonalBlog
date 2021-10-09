//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const app = express();
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/BlogDB",{useNewUrlParser: true});

// const postSchema=new mongoose.Schema({
//   title: String,
//   postBody: String
// })
const UserSchema=new mongoose.Schema({
  email: String,
  password: String,
  posts: Array,
  _ids: String
})

//const Post=mongoose.model('Post',postSchema);
const User=mongoose.model("User",UserSchema);

app.get("/",(req,res)=>{
  res.render("home");
  // Post.find({},(err,posts)=>{
  //   res.render("home",
  //   {
  //     homeContent:homeStartingContent, 
  //     posts: posts
  //   });
  // })
})
app.get("/login",(req,res)=>{
  res.render("login")
})
app.get("/register",(req,res)=>{
  res.render("register")
})
app.post("/register",(req,res)=>{
  const newUser=new User({
    email: req.body.username,
    password: req.body.password,
    posts: [],
    _ids: "a"
  });
  newUser._ids=newUser._id.valueOf();
  newUser.save((err)=>{
    if(err){
      console.log(err);
    }
    else{
      res.redirect("accounts/"+newUser._ids+"/home");
    }
  });
})
app.post("/login",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  User.findOne({email:username},(err,foundUser)=>{
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password===password){
          res.redirect("accounts/"+toString(foundUser._ids)+"/home");
        }
        else{
          res.redirect("/login");
        }
      }
      else{
        res.redirect("/register");
      }
    }
  })
})
app.get("/accounts/:UserId/home",(req,res)=>{
  var x=0;
  User.findOne({_ids:req.params.UserId},(err,foundUser)=>{
    if(err){
      console.log(err);
    }
    else{
      x=1;
      res.render("blogPage",{
        homeContent: homeStartingContent,
        posts: foundUser.posts,
        UserId: req.params.UserId
      })
      //console.log(reqPosts);
    }
  })
})

app.get("/about",(req,res)=>{
  res.render("about",{aboutContent:aboutContent})
})

app.get("/contact",(req,res)=>{
  res.render("contact",{contactContent:contactContent})
})

app.get("/accounts/:UserId/compose",(req,res)=>{
  res.render("compose");
})
//app.get("/compose",(req))

app.post("/accounts/:UserId/compose",(req,res)=>{
  const post = {
    title : req.body.postTitle,
    postBody : req.body.postBody
  }
  User.findOne({_id:req.params.UserId},(err,foundUser)=>{
    if(err){
      console.log(err);
    }
    else{
      foundUser.posts.push(post);
      foundUser.save();
    }
  })
  //console.log("redirected");
  res.redirect("/accounts/"+req.params.UserId+"/home");
  //const newPost=new Post(post);
  
})
app.get("/accounts/:UserId/posts/:title",(req,res)=>{
  const title=req.params.title;
  const UserId=req.params.UserId;
  User.findOne({_id:UserId},(err,foundUser)=>{
    const posts=foundUser.posts;
    posts.forEach((x)=>{
      if(x.title==title){
        res.render("post",{post:x})
      }
    })
  })
})




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
