const addProductForm = document.querySelector('#add-form')
const galleryForm = document.querySelector('#gallery-form')
const galleryImages = document.querySelector(".gallery-images")
const productDiv = document.querySelector(".products-grid")

const pFrom_inner = addProductForm.innerHTML
const gForm_inner = galleryForm.innerHTML


display_gallery()
display_products()

addProductForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    const data = new FormData(addProductForm)
    addProductForm.innerHTML = ""
    addProductForm.innerHTML = pFrom_inner
    postFetcher('http://localhost:3000/items/add',data)
    .then(data => console.log(data))

})


galleryForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    const data = new FormData(galleryForm)
    addProductForm.innerHTML = ""
    addProductForm.innerHTML = gForm_inner
    postFetcher('/gallery-images',data)
    .then(data => console.log(data))
     display_gallery()
})










// utilities
async function postFetcher (url,dataset){
    const res = await fetch(url,{
        method: 'POST',
        body: dataset
    })
    const data = await res.json()

    return data
}

async function fetcher (url,Method){
    const res = await fetch(url,{
        method:Method
    })
    const data = await res.json()

    return data
}


function display_gallery(){
    let output = ""
    fetcher("/gallery-images/","GET")
    .then(data =>{
        data.forEach(one =>{
            output+=`           
            <div class="gallery-image card">
            <img src="${one.image}" alt="gallery image">
            <p class="pad"> ${one.message}</p>
             <div class="pad"> 
                <button class="btn btn-warning edit-image" data-id="${one._id}"> edit <i class="fa fa-edit"></i></button>
                <button class="btn btn-danger delete-image" data-id="${one._id}"> delete <i class="fa fa-trash"></i></button>
            </div>

        </div>`      
        })

        galleryImages.innerHTML = output
    })
    .then(()=>{
        const edit_button = document.querySelectorAll(".edit-image")
        const delete_button = document.querySelectorAll(".delete-image")

        delete_button.forEach(one=>{
            const id = one.dataset.id
            one.addEventListener("click",()=>{
                fetcher("/gallery-images/"+id,"DELETE")
                .then(data=>console.log(data))
                display_gallery()
            })
        })

        edit_button.forEach(one=>{
            const id = one.dataset.id
            one.addEventListener("click",()=>{
               window.location = `/edit-gallery/${id}`
            })
        })
    })
}

function display_products(){
    let output = ""
    fetcher("/items/all/","GET")
    .then(data =>{
     
        data.forEach(one =>{
            output+=`           
            <div class="gallery-image card">
            <img src="${one.image}" alt="gallery image">
            <p class="pad"> ${one.title}</p>
             <div class="pad"> 
                <button class="btn btn-warning edit-product" data-id="${one._id}"> edit <i class="fa fa-edit"></i></button>
                <button class="btn btn-danger delete-product" data-toggle ="modal" data-target="#deleteModal"> delete <i class="fa fa-trash"></i></button>
            </div>

        </div>
        
                <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">delete item</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <h1> Warning</h1>
                            <p> ensure that before you delete there are no current orders for this item</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-danger delete-product" data-id="${one._id}"> delete <i class="fa fa-trash"></i></button>
                        </div>
                        </div>
                    </div>
        </div>
        
        `      
        })

        productDiv.innerHTML = output
    })
    .then(()=>{
        const edit_button = document.querySelectorAll(".edit-product")
        const delete_button = document.querySelectorAll(".delete-product")

        delete_button.forEach(one=>{
            const id = one.dataset.id
            one.addEventListener("click",()=>{
                fetcher("/items/delete/"+id,"DELETE")
                .then(data=>console.log(data))
                display_products()
            })
        })

        edit_button.forEach(one=>{
            const id = one.dataset.id
            one.addEventListener("click",()=>{
               window.location = `/edit-product/${id}`
            })
        })
    })
}

