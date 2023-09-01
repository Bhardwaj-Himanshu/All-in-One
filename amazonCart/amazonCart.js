//On click event I need to update the product quantity
const plusbuttons=document.querySelectorAll('#plus');
const minusbuttons=document.querySelectorAll('#minus');
//this below will return a nodelist which can be accessed using forEach loop
const productQuantities=document.querySelectorAll('#product-quantity');

plusbuttons.forEach((plusbutton,index)=>{
    plusbutton.addEventListener('click',()=>{
        let currentquantity=parseInt(productQuantities[index].innerText);
        productQuantities[index].innerText=currentquantity+1;
})
})
minusbuttons.forEach((minusbutton,index)=>{
    minusbutton.addEventListener('click',()=>{
            let currentquantity=parseInt(productQuantities[index].innerText);
            if(currentquantity>0){
            productQuantities[index].innerText=currentquantity-1;
            }
    })
})
