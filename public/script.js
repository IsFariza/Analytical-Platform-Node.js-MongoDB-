
const form = document.getElementById('blogForm');
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await addBlog();
});


async function addBlog(){
    const form = document.getElementById("blogForm");
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const author = document.getElementById("author").value;

    if(!title || !body){
        alert("Title and body are required")
        return
    }

    const response = await fetch("http://localhost:3000/blogs", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            body: body,
            author: author
        }) 
    });

    if (response.ok){
        form.reset();
        fetchBlogs();
    }

}

async function fetchBlogs() {
    const response = await (await fetch("http://localhost:3000/blogs")).json();
    const container = document.getElementById("blogs");
    container.innerHTML = "";
    for (let blog of response) {
        container.innerHTML += `
            <div id="createdBlogs">
                <h3>${blog.title}</h3>
                <p>${blog.body}</p>
                <p>Author: ${blog.author}</p>
                <p>Created at: ${new Date(blog.createdAt).toLocaleString()}</p>
                <p>Updated at: ${new Date(blog.updatedAt).toLocaleString()}</p>
                <button class="btn btn-outline-danger" onclick="deleteBlog('${blog._id}')">Delete</button>
                <button class="btn btn-secondary" onclick="updateBlog('${blog._id}', '${blog.title}', '${blog.body}', '${blog.author}')">Edit</button>
            </div>
        `;
    }

  
}

async function deleteBlog(id){
    const response = await fetch(`http://localhost:3000/blogs/${id}`, {
        method: "DELETE"
    });
    if (response.ok){
        fetchBlogs();
    }
    
}
 
async function updateBlog(id, title, body, author){
    document.getElementById("title").value = title;
    document.getElementById("body").value = body;
    document.getElementById("author").value = author;

    saveBtn.style.display = "inline-block";

    const btn = document.getElementById("saveBtn")
    btn.innerText = "Update Blog";
    btn.onclick = async () => {
        const form = document.getElementById("blogForm");

        const response = await fetch(`http://localhost:3000/blogs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title = document.getElementById("title").value,
                body: body = document.getElementById("body").value,
                author: author = document.getElementById("author").value
            })
        });

        if (response.ok) {
            form.reset();   
            fetchBlogs();
        }
        saveBtn.style.display = "none";
    };
}