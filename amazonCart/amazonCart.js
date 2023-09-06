//On click event I need to update the product quantity
const plusbuttons=document.querySelectorAll('#plus');
const minusbuttons=document.querySelectorAll('#minus');
//this below will return a nodelist which can be accessed using forEach loop
const productQuantities=document.querySelectorAll('#product-quantity');
const cartquantity=document.querySelector('#cart-quantity');

//Local storage code to retrieve the items data stored in localstorage
for(let index=0;index<productQuantities.length;index++){
    const productQuantity=parseInt(localStorage.getItem(`productquantity ${index}`));
    const cartQuantity=parseInt(localStorage.getItem(`cartquantity`));
    if(productQuantity || cartQuantity){
        productQuantities[index].innerText=JSON.parse(productQuantity);
        cartquantity.innerText=JSON.parse(cartQuantity);
    }
}

plusbuttons.forEach((plusbutton,index)=>{
    plusbutton.addEventListener('click',()=>{
        let currentquantity=parseInt(productQuantities[index].innerText);
        productQuantities[index].innerText=parseInt(currentquantity+1);
        cartquantity.innerText=parseInt(cartquantity.innerText)+1;
        localStorage.setItem(`productquantity ${index}`,JSON.stringify(productQuantities[index].innerText));
        localStorage.setItem(`cartquantity`,JSON.stringify(cartquantity.innerText));
})
})

minusbuttons.forEach((minusbutton,index)=>{
    minusbutton.addEventListener('click',()=>{
            let currentquantity=parseInt(productQuantities[index].innerText);
            if(currentquantity>0){
            productQuantities[index].innerText=parseInt(currentquantity-1);
            cartquantity.innerText=parseInt(cartquantity.innerText)-1;
            localStorage.setItem(`productquantity ${index}`,JSON.stringify(productQuantities[index].innerText));
            localStorage.setItem(`cartquantity`,JSON.stringify(cartquantity.innerText));
            }
    })
})
