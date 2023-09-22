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
// DOM after we close the cart, click on REMOVE ALL, so to spawn back all the required or all buttons
let buttonDOM=[];

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
      //console.log(products); // could be deleted!
      let result = '';
      products.forEach(product=>{
        result+=`
        <!--SINGLE PRODUCT-->
        <article class="product">
            <div class="img-container">
                <img src=${product.image} alt="Product" class="product-img">
                <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    Add to Bag
                </button>
            </div>
            <h4>${product.title}</h4>
            <h3>$${product.price}</h3>
        </article>
        <!--END OF SINGLE PRODUCT-->
        `;
      })
      productsDOM.innerHTML=result;
    }
    getBagButtons(){
      const buttons = [...document.querySelectorAll('.bag-btn')];
      buttons.forEach(button=>{
        let id=button.dataset.id;
        let inCart=cart.find((item)=>{item.id===id}) // Using a callback function inside find to check if item-ids inside cart match the id we provided.
        if(inCart){
          button.innerHTML="In Cart";
          button.disabled=true;
        }
        else{
          button.addEventListener('click',(event)=>{
          event.target.innerHTML="In Cart";
          event.target.disabled=true;

          /*--THINGS THIS ELSE OR getBagButtons() method will do*/
          //get product from products
          let cartItem={...Storage.getProduct(id),amount:1};
          
          // add product to the cart
          cart=[...cart,cartItem];
          //cart.push(cartItem);
          //console.log(cart);

          // save cart in local storage
          Storage.setCart(cart);
          // set cart values

          // display cart item

          // show the cart
          })
        }
      })
    }
}
// local storage
class Storage{
  static saveProducts(products){
  localStorage.setItem("Products",JSON.stringify(products));
  }
  static getProduct(id){
  const products=JSON.parse(localStorage.getItem("Products"));
  //return products.find(product=>product.id===id);
  return products.find((product)=>{
    return product.id===id;
  })
  }
  static setCart(cart){
  localStorage.setItem("Cart",JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  const products = new Products();
  const ui = new UI();

  products.getProducts().then(products=> {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  }).then(()=>{
    ui.getBagButtons();
  });
})
