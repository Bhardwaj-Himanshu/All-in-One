// Selecting different things with different variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('cart');
const cartOverlay = document.querySelector('cart-overlay');
const cartItem = document.querySelector('.cart-item');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-Content');
const productsDOM = document.querySelector('.products-center');

// Main cart array which we will perform CRUD operations on
let cart=[];


// We'll be creating some methods inside different classes

//getting the products
class Products{
    async getProducts(){
    try {
    let result = await fetch('products.json');
    let returnData = await result.json(); //can use await here aswell
    let products = returnData.items;

    products = products.map(item =>{
        const {title,price}=item.fields;
        const {id}=item.sys;
        const image=item.fields.image.fields.file.url;
        return {title,price,id,image};
     })
    return products;
    } catch (error) {
     console.log(error) 
    }
  }
}
// display products
class UI{
    displayProducts(products){
        console.log(products)
    }
}
// local storage
class Storage{}

document.addEventListener("DOMContentLoaded",()=>{
  const products = new Products();
  const ui = new UI();

  products.getProducts().then(products=> ui.displayProducts(products));
})
