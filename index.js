const items = document.getElementById("items")
const itemsTable = document.getElementById("items-table")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("template-card").content
const templateFooter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content

const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener("DOMContentLoaded",()=>{
    products()
})

items.addEventListener("click",e =>{
    addCarrito(e)
})

footer.addEventListener("click",e =>{
    deleteCarrito(e)
})

itemsTable.addEventListener("click",e =>{
    cantidad(e)
})
const products = async () =>{
    try{
        const res = await fetch("products.json")
        const data = await res.json()
        pintarCart(data)
    }catch(e){
        console.log(e)
    }
}

const pintarCart = (data) =>{
    data.forEach(product => {
       templateCard.querySelector("h5").textContent = product.title
       templateCard.querySelector("p").textContent = product.precio
       templateCard.querySelector("img").src = product.img
       templateCard.querySelector("button").dataset.id= product.id
       
       const clone = templateCard.cloneNode(true)
       fragment.appendChild(clone)
    });
    items.append(fragment)
}

const addCarrito = (e) =>{
   if(e.target.tagName =="BUTTON"){
        setCarrito(e.target.parentElement)
   }
   e.stopPropagation()
}

const setCarrito = (objeto) =>{
   const producto = {
        id : objeto.querySelector("button").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad : 1
   }
   
   if(carrito.hasOwnProperty(producto.id)){
    producto.cantidad = carrito[producto.id].cantidad + 1
   }
    
   carrito[producto.id] ={
    ...producto
   }
   pintarCarrito()
   
}

const pintarCarrito = () =>{
   itemsTable.innerHTML =""
   Object.values(carrito).forEach((producto) =>{
        templateCarrito.querySelector("th").textContent = producto.id 
        templateCarrito.querySelectorAll("td")[0].textContent = producto.title
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad 
        templateCarrito.querySelectorAll("td")[3].textContent = producto.precio*producto.cantidad 
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id 
        
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
   })
    itemsTable.append(fragment)
    pintarFooter()
}

const pintarFooter = () =>{
    footer.innerHTML =""
    let cantidadTotal = 0
    let precioTotal = 0
    Object.values(carrito).forEach((producto) =>{
        cantidadTotal += producto.cantidad 
        precioTotal += producto.precio*producto.cantidad
    })
    templateFooter.querySelectorAll("td")[0].textContent = cantidadTotal
    templateFooter.querySelectorAll("td")[2].textContent = precioTotal

    const clone = templateFooter.cloneNode(true)
    fragment.append(clone)
    footer.append(fragment)

}

const deleteCarrito = (e) =>{
    if(e.target.tagName =="BUTTON"){
       carrito = {}
       pintarCarrito()
       pintarFooter()
       footer.innerHTML='<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
   }
   e.stopPropagation()
}

const cantidad = (e) =>{
    if(e.target.classList.contains("btn-info")){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        carrito[e.target.dataset.id] = producto
        pintarCarrito()
        pintarFooter()
    }
    if(e.target.classList.contains("btn-danger")){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad - 1
        carrito[e.target.dataset.id] = producto
        if(producto.cantidad == 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
        pintarFooter()
    }
    e.stopPropagation()
}