const gallery_div = document.querySelector("gallery-div")







async function fetcher(url){
    const res = await fetch(url)
    const data = await res.json()

    return data
}













