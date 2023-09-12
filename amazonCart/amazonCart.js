document.addEventListener('DOMContentLoaded',function(){
    const currentPage=window.location.pathname;

//On click event I need to update the product quantity
const plusbuttons=document.querySelectorAll('.plus');
const minusbuttons=document.querySelectorAll('.minus');
//this below will return a nodelist which can be accessed using forEach loop
const productQuantities=document.querySelectorAll('.product-quantity');
const cartquantity=document.querySelector('#cart-quantity');
const bin=document.querySelectorAll(".end");
const cartContainers=document.querySelectorAll('.cart-container');

const productImages=[
    "https://m.media-amazon.com/images/I/71HtN4qqLZL._AC_UY327_FMwebp_QL65_.jpg",
    "https://m.media-amazon.com/images/I/61wNaclZz8L._AC_UL600_FMwebp_QL65_.jpg",
    "https://m.media-amazon.com/images/I/61hwd7aAmnL._AC_UL600_FMwebp_QL65_.jpg",
    "https://m.media-amazon.com/images/I/71Q50E2DCpL._AC_UL600_FMwebp_QL65_.jpg"
]

function handleHomePage(){
    
    localStorage.setItem('productQuantities',JSON.stringify(productQuantities.length))
    //Local storage code to retrieve the items data stored in localstorage
    for(let index=0;index<productQuantities.length;index++){
        const productQuantity=localStorage.getItem(`productquantity ${index}`);
        const cartQuantity=localStorage.getItem(`cartquantity`);
        if(productQuantity || cartQuantity){
            productQuantities[index].innerText=JSON.parse(productQuantity);
            cartquantity.innerText=JSON.parse(cartQuantity);
        }
        //console.log(productQuantity);
        //console.log(cartQuantity);
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
}

function handleCartPage(){
    const cartProductQuantitiesUsage=localStorage.getItem('productQuantities');
    const fuckinNumber=JSON.parse(cartProductQuantitiesUsage);
    console.log(fuckinNumber);
    // accessing the locally stored data using getItem
    for(let index=0;index<fuckinNumber;index++){
        const productQuantity=localStorage.getItem(`productquantity ${index}`);
        const cartQuantity=localStorage.getItem(`cartquantity`);
        if(productQuantity || cartQuantity){
            // productQuantities[index].innerText=JSON.parseInt(productQuantity);
            // cartquantity.innerText=JSON.parseInt(cartQuantity);
        }
    }

    cartContainers.forEach((container)=>{
        container.outerHTML="";
    })
// Now we need to delete the product,everytime someone clicks on the bin icon in cart
    bin.forEach((binItem,index)=>{
        binItem.addEventListener('click',()=>{
           cartContainers[index].outerHTML="";
        })
    })
    
    for(let index=0;index<fuckinNumber;index++){
        let currentquantity=parseInt(productQuantities[index].innerText);
        
        if(currentquantity>=1){
            const cartContainer=document.createElement('div');
            cartContainer.classList.add('cart-container');
            
            const cartImage=document.createElement('img');
            cartImage.classList.add('start');
            cartImage.src=productImages[index];
    
            const cartItemDescription=document.createElement('p');
            cartItemDescription.classList.add('middle');
            cartItemDescription.innerText=productQuantities[index].innerText;
    
            const binImage=document.createElement('img');
            binImage.classList.add('end');
            binImage.src="../static/trash.svg";
    
            cartContainer.appendChild(cartImage);
            cartContainer.appendChild(cartItemDescription);
            cartContainer.appendChild(binImage);
            cartContainers.appendChild(cartContainer);
        }
    }
}

if (currentPage.endsWith('/amazonCart.html')) {
    handleHomePage(); 
    console.log(productQuantities.length)   
} else if (currentPage.endsWith('/cartview.html')) {
    handleCartPage();
}
})
