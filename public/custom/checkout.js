
const checkout_form = document.querySelector(".checkout-form")
const form_content = checkout_form.innerHTML
const cash_on_delivery = document.querySelector("#cod")
const bank_or_card = document.querySelector("#paypal")
const checkout_btn = document.querySelector("#checkout-btn")  


const stored_cart = localStorage.getItem("cart")
const total_cost = localStorage.getItem("total_cost")
const cart_array = JSON.parse(stored_cart)

 

console.log(cart_array)

const items_array = []
const quantity_array = []

if (stored_cart != undefined && stored_cart != ""){
    for(let i of cart_array){
        items_array.push(i.Id)
        quantity_array.push(i.Qty)
    }
}


console.log(items_array)
console.log(quantity_array)
console.log(checkout_btn)

const checkout_form_data = new FormData(checkout_form)
let c = checkout_form_data


document.addEventListener("DOMContentLoaded",()=>{
       display_cart_total()  

    checkout_btn.addEventListener("click",()=>{

        if(cash_on_delivery.checked){
            pay_on_delivery()
        }
        else if(bank_or_card.checked){
           bank_payment()
        }
        else{
             pay_on_delivery()
        }

    })

   
})





// #############################    FUNCTIONS ##################################

async function ajax_post(url,form_data){
   const res = await fetch(url,{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify(form_data)
   })
   const data = await res.json()

   return data
}

function pay_on_delivery(){
    
    const firstname = get_input("#first_name").value
    const  lastname = get_input("#last_name").value
    const customer_email = get_input("#email").value
    const customer_address = get_input("#street_address").value
    const customer_phone = get_input("#phone_number").value
    const customer_comment = get_input("#comment").value
    const items = items_array
    const quantity = quantity_array
    const total = total_cost

    const form_valid = (firstname != "" && lastname != "" && customer_email != "" && customer_address != "" && customer_phone != null && customer_phone != "" && customer_comment != "")
 

   if(form_valid){

    checkout_form.innerHTML =""
    checkout_form.innerHTML= form_content

    const fulldata = {firstname,lastname,customer_email,customer_address,customer_phone,customer_comment,items,quantity,total}
    ajax_post("/orders/pay-on-delivery",fulldata)
    .then(data =>{
        if(!!data) {
            console.log(data)
            localStorage.removeItem("cart") 
            localStorage.removeItem("total_cost")

            

            localStorage.setItem("dee_current_order",JSON.stringify(data.newOrder)) // saves succesful order to local storage
            alert(data.message) // the success message
        }
            
        else
            alert("order could not be made, try again later")
    })


   }



   else {
     alert("One or more required field ommited")
   }
   




}

function bank_payment(){
    const firstname = get_input("#first_name").value
    const  lastname = get_input("#last_name").value
    const customer_email = get_input("#email").value
    const customer_address = get_input("#street_address").value
    const customer_phone = get_input("#phone_number").value
    const customer_comment = get_input("#comment").value
    const items = items_array
    const quantity = quantity_array
    const total = total_cost

    const d = Date.now()


    const form_valid = (firstname != "" && lastname != "" && customer_email != "" && customer_address != "" && customer_phone != null && customer_phone != "" && customer_comment != "")
   
    if(form_valid){
        // checkout_form.innerHTML =""
        // checkout_form.innerHTML= form_content

        const fulldata = {firstname,lastname,customer_email,customer_address,customer_phone,customer_comment,items,quantity,total}
        ajax_post("/orders/usecard",fulldata)
        .then(data =>{
            console.log(data)
            if(data == true){
                makePayment()
             
            }else{
                alert("there was a problem processing your transaction")
            }
            
        })

    }



    function makePayment() {
        FlutterwaveCheckout({
          public_key: "FLWPUBK_TEST-705330948f5fc7d7e6004bcca5e56238-X",
          tx_ref: customer_phone + d.toString(),
          amount: total,
          currency: "NGN",
          payment_options: "card, mobilemoneyghana, ussd",
          redirect_url: "/order/success",
          meta: {
            consumer_id: Math.floor(Math.random() * 200),
            consumer_mac: "92a3-912ba-1192a",
          },
          customer: {
            email: customer_email,
            phone_number: customer_phone,
            name: firstname + " " + lastname,
          },
          customizations: {
            title: "Dee Styling payment",
            description: "to be delivered to " + customer_address,
            logo: "../images/DeeFashionImg.png",
          },
        });
      }
}

function get_input(target){
    const value = document.querySelector(target) 
    return value
}

function display_cart_total(){
    document.querySelector("#subtotal-span").innerText = "#"+total_cost+".00"
 document.querySelector("#total-span").innerText = "#"+total_cost+".00"
}



