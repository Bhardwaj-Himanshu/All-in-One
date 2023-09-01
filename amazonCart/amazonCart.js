//On click event I need to update the product quantity
const plusbutton=document.getElementById('+');
const minusbutton=document.getElementById('-');
//this below will return a nodelist which can be accessed using forEach loop
const productQuantity=document.querySelectorAll('#product-quantity');


plusbutton.addEventListener('click',()=>{
    productQuantity.forEach((productElement)=>{
        let currentquantity=parseInt(productElement.innerText);
        productElement.innerText=currentquantity+1;
    })
})
minusbutton.addEventListener('click',()=>{
    productQuantity.forEach((productElement)=>{
        let currentquantity=parseInt(productElement.innerText);
        if(currentquantity>0){
        productElement.innerText=currentquantity-1;
        }
    })
})