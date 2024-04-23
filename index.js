const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride= require("method-override");
const mysql = require('mysql2');

app.use(express.urlencoded({extended:true})); //To read URL encoded data.

app.use(methodOverride('_method'))//To override post request from html as patch

app.set("View Engine","ejs"); 

//To run nodemon from any dir and still get access to views and public files
app.set("views",path.join(__dirname,"views")); 
app.use(express.static(path.join(__dirname,"public")));

//Connection with database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'xyz_app',
    password: 'MySQL@1214'
});

//For Creating unique ids
const { v4: uuidv4 } = require('uuid');
 // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

//  For date tracking/
 function getDate(){
    let currentDate = new Date();
    let date = currentDate.getDate() + "-" + (currentDate.getMonth()+1) + "-"+ currentDate.getFullYear();
    return date;
}
//  For time tracking/
function getTime(){
    let currentDate = new Date();
    let time = currentDate.getHours() + ":" + currentDate.getMinutes();
    return time;
}
//Code
let users = []
let posts = [{
    id: uuidv4(),
    username: "Apna College",
    content : "I love coding",
    userID : 1,
    time : getTime(),
    date : "1-1-2024"
},
{
    id: uuidv4(),
    username: "Shraddha Khapra",
    content : "That's wondeful",
    userID : 2,
    time : "02:08",
    date : "2-2-2024"
},
{
    id: uuidv4(),
    username: "Shamit Shetty",
    content : "Wow Super",
    userID : 3,
    time : "12:14",
    date : "14-3-2024"
}]

let imageSet = [
    {
        imageId : 1,
        imageSrc : "/Assets/Anime girl 2.jpg",
        bio : "Energetic and competitive, with a passion for athleticism and teamwork. Known for her athleticism and leadership skills, she inspires others with her determination and sportsmanship."
    },
    {
        imageId : 2,
        imageSrc : "/Assets/Anime pfp boy.jpg",
        bio : "Mysterious and brooding, with an air of quiet confidence. Known for his street smarts and quick reflexes, he navigates through life with a sense of purpose hidden beneath his hoodie."  
    },
    {
        imageId : 3,
        imageSrc : "/Assets/Anime pfp girl.jpg",
        bio : "Agile and acrobatic, with a rebellious spirit and a knack for witty comebacks. Possesses a unique sense of justice and a fierce determination to do what's right."  
    },
    {
        imageId : 4,
        imageSrc : "/Assets/Demon Slayer.jpg",
        bio : " Stoic and composed, with an unwavering dedication to duty. Masterful swordsmanship combined with a calm demeanor."  
    },
    {
        imageId : 5,
        imageSrc : "/Assets/Harbor Side Profile.jpg",
        bio : "Cool-headed and calculated, excels in tactical planning and precision shooting. A strategic mastermind with an eye for detail."  
    },
    {
        imageId : 6,
        imageSrc : "/Assets/Kakashi.jpg",
        bio : "Mysterious and enigmatic, known for his intelligence and strategic prowess. Masks his emotions behind a laid-back attitude."  
    },
    {
        imageId : 7,
        imageSrc : "/Assets/Megumi.jpg",
        bio : "Reserved yet fiercely loyal, with a quiet strength and a deep sense of responsibility. Skilled in the art of summoning and strategic combat."  
    },
    {
        imageId : 8,
        imageSrc : "/Assets/Mikasa.jpg",
        bio : "Driven by loyalty and protectiveness, possesses unparalleled strength and agility. A skilled fighter with a fierce determination to protect her loved ones."  
    },
    {
        imageId : 9,
        imageSrc : "/Assets/Naruto.jpg",
        bio : "Energetic and optimistic, with a strong sense of determination and loyalty. Possesses an indomitable spirit and a knack for bringing people together."  
    },
    {
        imageId : 10,
        imageSrc : "/Assets/Shinobu.jpg",
        bio : "Graceful and elegant, with a sharp intellect and deadly precision. Known for her expertise in poison-based combat and graceful swordsmanship."  
    },
    
];
var imageIdHolder = 0;

//HomePage
app.get("/",(req,res)=>{
    let imageId = Math.floor(Math.random()*10)+1;
    imageIdHolder = imageId;
    res.render("login.ejs")

})
app.post("/",(req,res)=>{
    let {password : password, username : username} = req.body;
    let newUser = [username,password]
    console.log(newUser);
    let q = "INSERT INTO user_data (username,password) VALUES (?,?)"
    connection.query(q, newUser, (err,result)=>{
        try{
            if(err){
                throw err;
            } 
            console.log(result);
            res.redirect("/")
        }catch{
            let count = 1
            res.render("register.ejs",{count});
            console.log(err);
            console.log("Problems being faced in adding a new user")
        }
    })
    
})
//LOGIN-RES 
app.post("/login-res",(req,res)=>{
    let {username}=req.body;
    // console.log(username);
    let userId = uuidv4()
    users.push({userId,username});
    // console.log(users);
    res.redirect("/posts");
})

//REGISTER USER
app.get("/register",(req,res)=>{
    let count =0;
    res.render("register.ejs",{count})
})
app.get("/posts",(req,res)=>{
    console.log(users);
    // let finalUserId = users[users.length-1].userId
    // console.log(finalUserId);
    // let user = users.find((u)=> finalUserId === u.userId)
    let user = users[users.length-1]
    console.log("Hello " +user.username);
    // let imageId = 5;
    let pfpImage = imageSet.find((i)=> imageIdHolder === i.imageId);
   
    res.render("index.ejs",{posts,user,pfpImage})
})
app.get("/profile",(req,res)=>{
    // let finalUserId = users[users.length-1].userId
    // console.log(finalUserId);
    // let user = users.find((u)=> finalUserId === u.userId)
    let user = users[users.length-1]
    let count = 0;
    for (p of posts) {
        if(p.username===user.username)
        {
            count=count+1;
        }
    };
    let pfpImage = imageSet.find((i)=> imageIdHolder === i.imageId);
    // let bio = imageSet.find((i)=> imageIdHolder === i.imageId);
    // console.log(count);
    // console.log(pfpImage)
    res.render("profile.ejs",{user,count,pfpImage})
})



//Create Post
app.get("/posts/new",(req,res)=>{
    // console.log(users)
    // let finalUserId = users[users.length-1].userId
    // console.log(finalUserId);
    // let user = users.find((u)=> finalUserId === u.userId)
    // console.log(user);
    let user = users[users.length-1];
    res.render("new.ejs",{user})
})
//Post request on homepage
app.post("/posts",(req,res)=>{
    let {username,content}=req.body;
    let id = uuidv4()
    let time = getTime()
    let date = getDate()
    posts.push({id,username,content,time,date});
    // console.log(req.body);
    console.log(posts);
    res.redirect("/posts");
})

//based on id   
app.get("/posts/:id",(req,res)=>{
    let {id} = req.params;
    let post = posts.find((p)=>id === p.id);
    console.log(post);
    res.render("show.ejs",{post})
    
})

//Update
app.patch("/posts/:id",(req,res)=>{
   
    let {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((p)=>id === p.id);

    if(newContent != post.content){
       editStatus = 1
    }
    else{
        editStatus = 0
    }
    post.editStatus = editStatus
    
    post.content = newContent;
    post.time = getTime()
    // console.log(post);
    // console.log(id);
    // console.log(newContent);  
    // res.send("Patch req working")
    console.log(post);
    res.redirect("/posts");
})

//Edit functionality
app.get("/posts/:id/edit",(req,res)=>{
    let {id} = req.params;
    let post = posts.find((p)=>id === p.id);
    res.render("edit.ejs",{post});
})

//Delete post
app.delete("/posts/:id", (req,res)=>{
    let {id} = req.params;
    posts=posts.filter((p)=>id !== p.id);
    console.log(posts);
    res.redirect("/posts");
})

app.listen(port,()=>{
    console.log("Listening to port : "+port);
})