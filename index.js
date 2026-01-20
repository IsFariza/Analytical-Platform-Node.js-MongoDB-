const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()
const port = 3000

app.use(express.json())
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_DB)
    .then(() => { console.log("MongoDB connected") })
    .catch((e) => {console.error(e)});

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    author: {type:String, default: "Anonymous"},
    createdAt: {type:Date},
    updatedAt: {type:Date}
})

const Blog = mongoose.model("Blog", blogSchema); 

app.post('/blogs', async(req, res) => {
    if (!req.body.title || !req.body.body){
        return res.status(400).send("Tutle and Body are required")
    }

    const blog = new Blog({
        title: req.body.title,
        body: req.body.body,
        author: req.body.author,
        createdAt: Date.now(),
        updatedAt: Date.now()
    })

    await blog.save()
    res.status(201).send(blog)
})

app.get("/blogs", async (req, res) => {
    const blogs = await Blog.find();
    res.send(blogs)
})

app.get("/blogs/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog){
        return res.status(404).send("Blog not found")
    }
    res.status(200).send(blog)
})

app.put("/blogs/:id", async (req, res) => {
    if(!req.body.title || !req.body.body){
        return res.status(404).send("Title and body are required")
    }
    

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        author: req.body.author,
        updatedAt: Date.now(),
    }, {new:true})

    if(!updatedBlog){
        return res.status(404).send("Blog not found")
    }
    res.status(200).send("Blog updated successfully")
})

app.delete("/blogs/:id", async(req, res) => {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id)
    if (!deletedBlog){
        return res.status(404).send("Blog not found")
    }
    res.status(200).send("Blog deleted successfully")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
