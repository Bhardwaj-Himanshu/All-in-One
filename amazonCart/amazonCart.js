//On click event I need to update the product quantity
const plusbuttons=document.querySelectorAll('#plus');
const minusbuttons=document.querySelectorAll('#minus');
//this below will return a nodelist which can be accessed using forEach loop
const productQuantities=document.querySelectorAll('#product-quantity');
const cartquantity=document.querySelector('#cart-quantity');

//Local storage code to retrieve the items data stored in localstorage
for(let i=0;i<productQuantities.length;i++){
    const productQuantity=localStorage.getItem(`productquantity ${i+1}`);
    const cartQuantity=localStorage.getItem(`cartquantity`)
    if(productQuantity || cartQuantity){
        productQuantities[i].innerText=JSON.parse(productQuantity);
        cartquantity.innerText=JSON.parse(cartQuantity);
    }
}

plusbuttons.forEach((plusbutton,index)=>{
    plusbutton.addEventListener('click',()=>{
        let currentquantity=parseInt(productQuantities[index].innerText);
        productQuantities[index].innerText=currentquantity+1;
        cartquantity.innerText=parseInt(cartquantity.innerText)+1;
        localStorage.setItem(`productquantity ${index+1}`,JSON.stringify(currentquantity+1));
        localStorage.setItem(`cartquantity`,JSON.stringify(parseInt(cartquantity.innerText)));
})
})

minusbuttons.forEach((minusbutton,index)=>{
    minusbutton.addEventListener('click',()=>{
            let currentquantity=parseInt(productQuantities[index].innerText);
            if(currentquantity>0){
            productQuantities[index].innerText=currentquantity-1;
            cartquantity.innerText=parseInt(cartquantity.innerText)-1;
            localStorage.setItem(`productquantity ${index+1}`,JSON.stringify(currentquantity-1));
            localStorage.setItem(`cartquantity`,JSON.stringify(parseInt(cartquantity.innerText)));
            }
    })
})
