// pour la page de la galerie produit vue par l'utilisatrice

function displayPics() {

  var liens = document.getElementsByClassName('mini_pict'); // variable tous les liens contenu dans galerie_mini
  var big_photo = document.getElementById('big_pict'); // id big_pict qui est récupéré, photo en taille normale
  if (big_photo != null) {
    big_photo.src=liens[0].src

                                                // Une boucle parcourant l'ensemble des liens contenu dans galerie_mini
    for (var i = 0 ; i < liens.length ; ++i) {

                                        // Au clique sur ces liens
      liens[i].onclick = function() {

        big_photo.src = this.src;      // On change l'attribut src de l'image en le remplaçant par la valeur du lien
        return false; // Et pour finir on inhibe l'action réelle du lien
      };
    }
  }

  
}



// appeler la fonction au chargement de la page

window.onload = displayPics;

// pour permettre de remplir le panier de l'utilisatrice

document.addEventListener('DOMContentLoaded', function() {
  let cart = document.querySelectorAll('.add-cart');
  // va chercher la quantité pour le mettre dans l'icone du panier du header
  document.querySelector('.cart span').textContent = onloadCartTotal();  
   
  if (cart.length > 0) {             // Une boucle pour le panier 
    cart[0].addEventListener('click', () => {    // écouter le clique  de la souris
      cartNumbers();
    })
  }
    // appeler la fonction pour faire apparaître la page du panier
    displayCart();
    
    // aller chercher le formulaire de création d'acheteur et ajout un écouteur d'événement sur le submit du formulaire.
    if(document.getElementById('acheteur') != null){
    document.getElementById('acheteur').addEventListener('submit',(event) => {
      event.preventDefault();
      var form = event.currentTarget
      // Aller les cherchers les produits présentement dans le panier de la session.
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = 'products';
      hiddenField.value = sessionStorage.getItem("products");      


      // Envoi du formulaire.
      form.appendChild(hiddenField);
      form.submit();
    });
}
}, false);

function onloadCartTotal(propriety = "quantity"){
    const key = 'cartNumbers'
    let output = 0
    
    if (sessionStorage[key]){
      const productNumbers = JSON.parse(sessionStorage[key]);
//  Si déclarée va chercher la propriété de l'item et l'incrémente      
      productNumbers.forEach(function(item){
        output += item[propriety]
      });
      return output
    } 
    return output;
}

// pour appeler la fonction du petit panier
onloadCartTotal();  
                                                                 
function cartNumbers(){
  // pour obtenir le id du produit sélectionné
  let idProduct = document.querySelector('[id^="product_"]').id;
  idProduct = parseInt(idProduct.replace('product_', ""));
  
  // pour aller chercher le titre
  let productName = document.getElementById('product_title').textContent;
  
  // pour obtenir la quantité
  let quantity = parseInt(document.getElementById('quantite').value);

  // pour obtenir le prix du produit
  let productPrice = parseInt(document.querySelector('#productPrice span').textContent);

  // pour aller chercher dans le sessionStorage
  let productNumbers = JSON.parse(sessionStorage.getItem('cartNumbers'));

  // pour aller chercher l'image du produit
  let productImage = document.getElementById('big_pict').src;

  const myCartItem = {
    'idProduct': idProduct,
    'productName':productName,
    'quantity': quantity,
    'productPrice': productPrice,
    'productPriceTotal': productPrice*quantity ,
    'productImage':productImage,
  }
  
  if(productNumbers == null){
    productNumbers = [];                               // pour la quantité à commander
    let productQuantity = myCartItem;
    productNumbers.push(productQuantity);
  } 
  else {    // obtenir le tableau du produit
    let productArray = productNumbers.filter(function(productQuantity){
      return productQuantity.idProduct == idProduct;
    });
    if(productArray.length > 0){                   // et ajouter différents produits
      let oldProductQuantity = productArray[0];
      oldProductQuantity.quantity += parseInt(quantity) *1;
      oldProductQuantity.productPriceTotal = oldProductQuantity.quantity * oldProductQuantity.productPrice
      let index = productNumbers.findIndex(function(productQuantity){
        return productQuantity.idProduct == idProduct;
      });
      productNumbers[index] = oldProductQuantity; 
    }
    else{
      let productQuantity = myCartItem;
      productNumbers.push(productQuantity);
    }
  }
  // pour le remettre dans la sessionStorage
    sessionStorage.setItem('cartNumbers', JSON.stringify(productNumbers));

  // pour le nombre à côté de l'icone du header
  document.querySelector('.cart span').textContent = onloadCartTotal(); 
}

// pour mettre les éléments dans la page du panier
function displayCart() {

    let cartItems = JSON.parse(sessionStorage.getItem('cartNumbers'));

    // pour s'assurer d'être sur la page panier
    let productContainer = document.getElementsByClassName("products")[0];
                  
    if (cartItems && productContainer){
                                          // key est pour aller chercher la clé dans le sessionStorage est obtenir la bonne rangée de produit
        productContainer.innerHTML = '';
        Object.values(cartItems).map((item, key) => { productContainer.innerHTML += ` 
          <div class="cart-item-row" data-id="${key}" >
            <div class="product"> 
              <span><img class="imageCart" src="${item.productImage}"  alt="image produit" /></span>
              <span>${item.productName}</span>
            </div>
            <div class="price">$ ${item.productPrice},00</div>
            <div class="quantity">
              <ion-icon onclick="changeItemFromCart(${key}, 'decrease')" class="btn_decrease"  name="remove-circle-outline"></ion-icon>
              <span>${item.quantity}</span>
              <ion-icon onclick="changeItemFromCart(${key}, 'increase')" class="btn_increase"  name="add-circle-outline"></ion-icon>
            </div>
            <div class="total">$ <span>${item.productPriceTotal},00</span></div>
            <div class="delete">
              <ion-icon onclick="changeItemFromCart(${key}, 'delete')" class="btn_delete" name="close"></ion-icon>
            </div>
          </div>
          `; 
        });

        productContainer.innerHTML += `
          <div class="basketTotalContainer">
          <h4 class="basketTotalTitle">Grand total:</h4>
          <h4 class="basketTotal">$ <span>${onloadCartTotal("productPriceTotal")},00</span></h4>
          ` 
    }
}

// pour augmenter ou réduire ou retirer un produit du panier de l'utilisatrice

function changeItemFromCart(id, action){
  let cartItems = JSON.parse(sessionStorage.getItem('cartNumbers'));
  const productRow = document.querySelector(`.cart-item-row[data-id="${id}"]`);
  const quantityDisplay = productRow.querySelector(".quantity span");
  const totalDisplay = productRow.querySelector(".total span");
  const grandTotalDisplay = document.querySelector(".basketTotal span");
  const oldQuantity = cartItems[id].quantity;
  
  if (action === "increase" || action === "decrease"){
    const value = action === "increase" ? +1 : -1;
    cartItems[id].quantity += value
  }
  else if (action === "delete"){
    cartItems[id].quantity = 0
  }   
  
  if (cartItems[id].quantity === 0 ){
    if(window.confirm(`Désirez-vous supprimer l'item suivant de votre panier ? ${cartItems[id].productName}`)){
      cartItems.splice([id], 1)
      productRow.remove()
      sessionStorage.removeItem("idProduct")
    }
    else { 
      cartItems[id].quantity = oldQuantity
    }
  } 
  
  cartItems[id].productPriceTotal = cartItems[id].quantity * cartItems[id].productPrice;
  
  sessionStorage.setItem('cartNumbers', JSON.stringify(cartItems));

  // pour mettre le petit panier à jour
  document.querySelector('.cart span').textContent = onloadCartTotal();
  // pour mettre à jour la page panier
  quantityDisplay.textContent = cartItems[id].quantity;
  totalDisplay.textContent = `${cartItems[id].productPriceTotal},00`;
  grandTotalDisplay.textContent = `${onloadCartTotal("productPriceTotal")},00`; 
  

}
