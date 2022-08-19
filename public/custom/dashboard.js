const order_table = document.querySelector(".cart-table")
const subtotal = get_element(".order-sub-total")
const order_total = get_element(".order-total")


const orders = JSON.parse(localStorage.getItem("dee_current_order"))
console.log(orders)


document.addEventListener("DOMContentLoaded",()=>{
    display_orders()
    

})


async function display_orders(){
    const res = await  fetch("/items/all")
    const data = await res.json()
    let output = ""
    for(let i = 0; i < orders.items.length; i ++){
        const current = data.find(one => one._id == orders.items[i])
        console.log(current)

        if(current){
         output += `
        <tr>
        <td class="cart_product_img">
            <a href="#"><img style ="" src="${current.image}" alt="${current.title}"></a>
        </td>
        <td class="cart_product_desc">
            <h5>${current.title}</h5>
        </td>
        <td class="price">
            <span>#${current.price}</span>
        </td>
        <td class="qty">
            <div class="qty-btn d-flex">
                <p>Qty</p>
                <div class="quantity">
                 
                        ${orders.quantity[i]}           
                    
                </div>
            </div>
        </td>
    </tr>`

  
        }
    }
    order_table.innerHTML = output
    subtotal.innerText = `#${orders.total}.00`
    order_total.innerText = `#${orders.total}.00`
}

function get_element(name){
   return document.querySelector(name)
}