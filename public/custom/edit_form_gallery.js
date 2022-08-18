const edit_gallery_form = document.querySelector("#edit-gallery-form")
const id = document.querySelector("#id").value
    console.log(id)
    
    
    edit_gallery_form.addEventListener("submit",(e)=>{
        e.preventDefault()
        const form_data = new FormData(edit_gallery_form)
        
        fetch("/gallery-images/"+id,{
            method:"PUT",
            body:form_data
        })
        .then(res => res.json())
        .then(data => alert(data))
        window.location ="/admin"

    })


