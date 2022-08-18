const edit_product_form = document.querySelector("#edit-form")

const id = document.querySelector("#id").value
    console.log(id)
    
    
    edit_product_form.addEventListener("submit",(e)=>{
        e.preventDefault()
        const form_data = new FormData(edit_product_form)
        
        fetch("/items/edit/"+id,{
            method:"PUT",
            body:form_data
        })
        .then(res => res.json())
        .then(data => alert(data))
        window.location ="/admin"

    })
