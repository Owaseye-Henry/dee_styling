const orders_div = document.querySelector(".orders-div")

document.addEventListener("DOMContentLoaded",()=>{
    display_orders()
})


// ###################### FUNCTIONS ########################

async function fetcher(url){
    const res = await fetch(url)
    const data = await res.json()

    return data
}

async function delete_fetch(url){
    const res = await fetch(url,{
        method:"DELETE",

    })
    const data = await res.json()

    return data
}


function display_orders(){
    let output  = ``
   
    fetcher("/orders/")
    .then(data => {
        console.log(data)
        data.forEach(one=>{
            let items = ""
            for(let i = 0; i < one.items.length; i ++){
                items +=`<a href="/product-details/${one.items[i]._id}" > <li style="cursor: pointer;" data-id="${one.items[i]._id}">${one.items[i].title} (${one.quantity[i]})</li> </a>`
            }
             

            output += `
               <!-- Single Order Area -->
            <div class="col-12 col-sm-6 col-md-12 col-xl-6">
                <div class="single-product-wrapper">
                    <div>
                        <span style="color:purple">Customer name</span>:  ${one.customer_name} <br>
                        <span style="color:purple">Phone</span>:     ${one.customer_phone} <br>
                        <span style="color:purple">Address</span>:       ${one.customer_address}<br>
                        <span style="color:purple">order price</span>:      ${one.total} <br>
                        <span style="color:purple">Payment status</span>:   ${one.paid_cash}   <br>
                        <span style="color:purple">Delivery status</span>:   ${one.delivery_Status}   <br>    
                        <span style="color:purple">tx_ref</span>:   ${one.tx_ref}  <br>
                        <span style="color:purple">transaction id</span>:   ${one.transaction_id}  <br>
                        <span style="color:purple">Date of paymebt</span>:   ${one.date}           <br>            
                         <ul style="padding-top:2rem;">
                        <ul>    <h5 class="">Items purchased</h5>
                         ${items}
                        </ul>
                    <div>
                              <button  class="btn btn-danger delete" data-toggle = "modal" data-target= "#deleteModal">delete <i class="fa fa-trash"></i></button>
                          </div>

                     </div>  
                </div>
            </div>
            
            <!--modal-->
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
                                    <p> ensure that this order has been delivered before deleting it</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-danger delete" data-id="${one._id}"> delete <i class="fa fa-trash"></i></button>
                                </div>
                                </div>
                            </div>
                        </div>
            
            `
        })
        orders_div.innerHTML = output
    })
    .then(()=>{
        const delete_button = document.querySelectorAll(".delete")
        delete_button.forEach( button =>{
            const id = button.dataset.id
            button.addEventListener("click",()=>{
                 delete_fetch("/orders/"+id)
                 .then(data=>console.log(data))
                  display_orders()
            })
        })
    })
}

