// Selecting different things with different variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
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
    let returnData = await result.json();
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

          // save cart in local storage
          Storage.setCart(cart);
          // set cart values
          this.setCartValue(cart);
          // display cart item
          this.addCartItem(cartItem);
          // show the cart
          this.showCart();
          })
        }
      })
    }
    setCartValue(cart){
      let totalCartPrice=0;
      let totalCartItems=0;
      cart.map(item=>{
        totalCartPrice+= item.price * item.amount;
        totalCartItems+= item.amount;
      })
      cartTotal.innerText = parseFloat(totalCartPrice.toFixed(2));
      cartItems.innerText = totalCartItems;
    }
    addCartItem(item){
      const div = document.createElement('div');
      div.classList.add('cart-item');
      
      div.innerHTML=`<img src=${item.image} alt="Product">
      <div>
          <h4>${item.title}</h4>
          <h5>$${item.price}</h5>
          <span class="remove-item" data-id="${item.id}">Remove</span>
      </div>
      <div>
          <i class="fas fa-chevron-up" data-id="${item.id}"></i>
          <p class="item-amount" data-id="${item.id}">${item.amount}</p>
          <i class="fas fa-chevron-down" data-id="${item.id}"></i>
      </div>`
      cartContent.appendChild(div);
    }
    showCart(){
      cartDOM.classList.add('showCart');
      cartOverlay.classList.add('transparentBcg');
    }
    hideCart(){
      cartDOM.classList.remove('showCart');
      cartOverlay.classList.remove('transparentBcg');
    }
    populateCart(cart){
      cart.forEach(item=>{
        this.addCartItem(item);
      })
    }
    setApp(){
    cart = Storage.displaySavedCart();
    this.setCartValue(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click',this.showCart);
    closeCartBtn.addEventListener('click',this.hideCart);
    clearCartBtn.addEventListener('click',(e)=>{
      e.cartContent.innerHTML=`<!--START OF CART-ITEMS-->
      <!--<div class="cart-item">
          
      </div>-->
      <!--END OF CART-ITEMS-->
      <div class="cart-footer">
          <h3>Your Total : $ <span class="cart-total">0</span></h3>
          <button class="clear-cart banner-btn">Clear Cart</button>
      </div>`
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
  static displaySavedCart(){
  const initialCart=JSON.parse(localStorage.getItem("Cart"))
  console.log(initialCart);
  return initialCart?initialCart:[];
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  const products = new Products();
  const ui = new UI();
  // Setting up the initial application, which loads the cart data and adds event listners to close cart, remove, add, minus etc.
  ui.setApp();
  // Setting up the products, storing all of them in local storage, and calling event listners on the ADD TO CART buttons.
  products.getProducts().then(products=> {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  }).then(()=>{
    ui.getBagButtons();
  });
})
