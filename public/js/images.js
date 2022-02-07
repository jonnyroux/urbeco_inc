window.onload = () => {
    // Gestion des boutons supprimer pour image//
    let links = document.querySelectorAll("[data-delete]")
    
    // boucle sur links//

    for(link of links){
        link.addEventListener("click", function(e){
            e.preventDefault()

            // confirmation//
            if(confirm("Voulez vous supprimer cette image?")){
                //si oui on appelle la methode DELETE//
                fetch(this.getAttribute("href"),  {
                    method : "DELETE",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/json"
                    },

                    //recupere le token//
                    body: JSON.stringify({"_token": this.dataset.token})
                }).then(
                    //Recuperation en JSON
                    response => response.json()
                    
                ).then(data => {
                    if(data.success)
                        this.parentElement.remove()
                    else
                        alert(data.error)
                }).catch(e => alert(e))
            }

        })
    }

}