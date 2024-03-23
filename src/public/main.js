const socket = io();
const form = document.querySelector("form")

form.addEventListener("submit",(element)=>{
    element.preventDefault();

    const formData = new FormData(form);
    const product = {
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        thumbnails: formData.get("thumbnails"),
        code: formData.get("code"),
        stock: formData.get("stock"),
        owner:formData.get("owner")
    }

    socket.emit("product_send", product);
    form.reset();
})

socket.on("products", (data) => {
    const products = document.querySelector("#products");
    products.innerHTML = "";

    data.forEach(product => {
        
        products.innerHTML += `<div>
        Id: ${product.id} - Title: ${product.title} - Description: ${product.description} - Price: ${product.price} - Thumbnail: ${product.thumbnail} - Code: ${product.code} - Stock: ${product.stock}- Owner: ${product.owner} - <button class="delete"> Delete </button> <br>
        </div>`;
    })
})


