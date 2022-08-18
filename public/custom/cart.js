const cart_table = document.querySelector(".cart-table")

 //retrieve cart data from localStorage and display on page
const StoredCartData = localStorage.getItem("cart")
const cart_array = JSON.parse(StoredCartData)



function display_cart(){
    
    let output
    cart_array.forEach(one => {
        output += `
        <tr>
        <td class="cart_product_img">
            <a href="#"><img style ="" src="${one.Image}" alt="${one.Title}"></a>
        </td>
        <td class="cart_product_desc">
            <h5>${one.Title}</h5>
        </td>
        <td class="price">
            <span>#${one.Price}</span>
        </td>
        <td class="qty">
            <div class="qty-btn d-flex">
                <p>Qty</p>
                <div class="quantity">
                   
                    <input type="number" class="qty-text" id="qty" step="1" min="1" max="300" name="quantity" data-id="${one.Id}" value="${one.Qty}">
                    <button class="btn btn-warning cart-remove" data-id = "${one.Id}"> <i class="fa fa-trash"></i> remove from cart</button>
                </div>
            </div>
        </td>
    </tr>`
      });
    cart_table.innerHTML = output
}

display_cart()

// get the cart quantity inputs to edit the cart item quantity
const quantity_buttons = document.querySelectorAll(".qty-text")
// get all remove buttons 
const remove_buttons = document.querySelectorAll(".cart-remove")

quantity_buttons.forEach(one=>{
    one.addEventListener("change",(e)=>{
         const associated_id = e.target.dataset.id
        console.log(`quantity button is ${one.value} ${associated_id}`)

        const parent_item = cart_array.find(one=> one.Id == associated_id)

        parent_item.Qty = parseInt(one.value)
        parent_item_current_price = parseFloat(parent_item.Price)
        parent_item.Total_price = (parent_item_current_price * parent_item.Qty)
        localStorage.setItem("cart",JSON.stringify(cart_array))

        displayTotals()
        
    })
})

remove_buttons.forEach(one=>{
    one.addEventListener("click",()=>{
        remove_from_cart(one.dataset.id)
       
    })
})

//fix in the subtotal and total price 

displayTotals()





// ############# functions #############

async function cart_fetcher(url){
    const res = await fetch(url)
    const data = await res.json()

    return data
}



function inArray(id){
   const bool = cart_array.find(one => id == one.item)
   return bool? true:false
}



console.log(cart_array)


// function get Subtotal of all prices

function displayTotals(){
    const CartSubTotal = document.querySelector(".cart-sub-total")
    const CartTotal = document.querySelector(".cart-total")
    let subtotal = 0
    for(let i of cart_array)
    {
        subtotal += parseFloat(i.Total_price)
    }

    CartSubTotal.innerText = '#'+ subtotal+'.00'
    CartTotal.innerText =  '#'+ subtotal+'.00'
    
    localStorage.setItem("total_cost", subtotal)
}


function remove_from_cart(id){
    const parent = cart_array.find(one => one.Id == id)
     console.log(parent)
    if(parent){
        console.log(cart_array.indexOf(parent))
        
        cart_array.splice(cart_array.indexOf(parent),1)
        localStorage.setItem("cart",JSON.stringify(cart_array))
    }
    window.location = "/cart"
}

