
const productsDiv = document.querySelector('.products-div')

let storedCart;
let CART =[]
if(localStorage.getItem("cart")){
     storedCart = localStorage.getItem('cart')
     CART = [...JSON.parse(storedCart)]
    }

document.addEventListener("DOMContentLoaded",()=>{

    // get shop items
    getShopItems(1)
    pagination()
})




//####################  ####################


// shop items req ajax
function getShopItems(pageNumber){
    fetcher('/items/all-parginated?page='+ pageNumber)
    .then(data =>{
        let output = ""
        console.log(data)

        data.items.forEach(one =>{
           const in_cart = CART.find(item => item.Id == one._id)
           let cart_a_tag ;
           if(in_cart) cart_a_tag = `<i> added to cart</i>`
           else cart_a_tag = `  <a href="cart.html"  data-placement="left" title="Add to Cart" data-id ="${one._id}" data-price ="${one.price}" data-title="${one.title}" data-image="${one.image}" class="cart-add" ><img src="img/core-img/cart.png" alt=""></a>`
      
           if(one.quantity > 0){
                output += `
                <div class="col-12 col-sm-6 col-md-12 col-xl-6">
                <div class="single-product-wrapper">
                    <!-- Product Image -->
                    <div class="product-img">
                        <a href = "/product-details/${one._id}"> <img src="${one.image}" alt=""></a>
                        <!-- Hover Thumb -->

                    </div>

                    <!-- Product Description -->
                    <div class="product-description d-flex align-items-center justify-content-between">
                        <!-- Product Meta Data -->
                        <div class="product-meta-data">
                            <div class="line"></div>
                            <p class="product-price purple">$ ${one.price}</p>
                            <a href="/product-details/${one._id}">
                                <h6>${one.title}</h6>
                            </a>
                        </div>
                        <!-- Ratings & Cart -->
                        <div class="ratings-cart text-right">
                            <div class="ratings">
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                                <i class="fa fa-star" aria-hidden="true"></i>
                            </div>
                            <div class="cart">
                                    ${cart_a_tag}
                            </div>
                        </div>
                    </div>
                </div>
            </div> `
        }else{
            output += `
            <div class="col-12 col-sm-6 col-md-12 col-xl-6">
            <div class="single-product-wrapper">
                <!-- Product Image -->
                <div class="product-img">
                    <img src="${one.image}" alt="">
                    <!-- Hover Thumb -->
                    <img class="hover-img" src="img/product-img/product3.jpg" alt="">
                </div>

                <!-- Product Description -->
                <div class="product-description d-flex align-items-center justify-content-between">
                    <!-- Product Meta Data -->
                    <div class="product-meta-data">
                        <div class="line"></div>
                        <p class="product-price purple">$ ${one.price}</p>
                        <a href="/product-details/${one._id}">
                            <h6>${one.title}</h6>
                        </a>
                    </div>
                    <!-- Ratings & Cart -->
                    <div class="ratings-cart text-right">
                        <div class="ratings">
                            <i class="fa fa-star" aria-hidden="true"></i>
                            <i class="fa fa-star" aria-hidden="true"></i>
                            <i class="fa fa-star" aria-hidden="true"></i>
                            <i class="fa fa-star" aria-hidden="true"></i>
                            <i class="fa fa-star" aria-hidden="true"></i>
                        </div>
                        <div class="cart">
                                <i> out of stock</i>
                        </div>
                    </div>
                </div>
            </div>
        </div> `

        }
        
        })

    productsDiv.innerHTML = output

        
    })
    .then(()=>{
        const cart_add = document.querySelectorAll('.cart-add')
        
        
        console.log(cart_add)
    
        cart_add.forEach(one => {
            
            const {id,title,image,available, price} = one.dataset
            one.addEventListener("click",(e)=>{
                e.preventDefault()
                    addToCart(id,title,image,available, price)    

                    const cart_qty = document.querySelector(".cart_qty")
                    console.log(CART.length, " is the cart qunatity")
                    cart_qty.innerText = '(' + CART.length +')'
                    one.parentElement.innerHTML = `<i>added to cart</i>`
                        
                        
             

                
            })
        })
       
    })
}


//ajax function
async function fetcher(url){
    const res = await fetch(url)
    const data = await res.json()

    return data
}

//add to cart

function addToCart(id,title,image,avail,price){
    const Id = id
    const Title = title
    const Image = image 
    const Price = price
    const Total_price = price
   
   let cart_item = {Id,Title,Image,Price, Qty:1,Total_price}

   const inCart = CART.find(one => one.Id == Id)
   
   if(!inCart){

    CART.push(cart_item)
    localStorage.setItem("cart",JSON.stringify(CART))


   }

 
}

function pagination(){
    const pagination_div = document.querySelector(".pagination")
    fetcher('/items/all?page=1')
    .then(data=>{
        const prev = data.previous_page_number
        const next = data.next_page_number
        const total = data.total_pages
        const current_page = data.page
        
        let output = ''
        for(let i = 0; i < total; i ++)
        {
            if ((i + 1) == current_page) output += ` <li class="page-item active page-button"><a class="page-link" href="#">${i+1}</a></li> `
            else output += `<li class="page-item  page-button"><a class="page-link" href="#">${i+1}</a></li>`

            
        }

        pagination_div.innerHTML = output
    })
    .then(()=>{
        const page_button = document.querySelectorAll(".page-button")
         
        page_button.forEach(one=>{
            one.addEventListener("click",(e)=>{
                e.preventDefault()
                const go_to = parseInt(one.innerText)
                getShopItems(go_to)
            })
        })

    })
}

