/****** Reprise de la fonction afficherTravaux car l'importation depuis  "js/travaux.js" est inefficace
  (fonction non reutilisable pour ce cas)
*****/
const reponse = await fetch("http://localhost:5678/api/works");
const travaux = await reponse.json();

// Affichage de la galerie
async function afficherTravaux() {
    const galerie = document.querySelector(".gallery");
    galerie.innerHTML = "";
    for (let travail of travaux) {
        const figure = document.createElement("figure");
        figure.innerHTML = `
            <img src="${travail.imageUrl}" alt="${travail.title}">
            <figcaption>${travail.title}</figcaption>
        `;
        galerie.appendChild(figure);
    };
}
afficherTravaux();

// Affichage du token d'authentification  dans la console 
const token = localStorage.getItem('authToken');
console.log("Token d'authentification :", token);

async function travauxModale() {
    const travauxModale = document.querySelector(".travaux-modale");
    travauxModale.innerHTML = "";
    for (let travail of travaux) {                // Creation de la structure HMTL pour chaque travail
        const figure = document.createElement("figure");
        figure.className = "work-container";
        const photo = document.createElement("img");
        photo.src = travail.imageUrl;
        photo.alt = travail.title;
        const buttonDelete = document.createElement("button");
        buttonDelete.className = "del-button";
        buttonDelete.id = travail.id;
        const iconDelete = document.createElement("i");
        iconDelete.className = "fa-solid fa-trash-can";
        buttonDelete.appendChild(iconDelete);
        figure.appendChild(buttonDelete);
        figure.appendChild(photo);
        travauxModale.appendChild(figure);
    };
};
travauxModale();

//  Gestion de l'apparition et de la fermeture de la fenêtre modale
let modal = null;

// Ouverture de la fenêtre 
const openModal = function(e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display ="flex";   // Affiche la modale
    target.removeAttribute("aria-hidden");
    target.setAttribute("aria-modal", "true");
    modal = target;
    modal.addEventListener("click", closeModal);  
    modal.querySelector(".close-modal").addEventListener("click", closeModal); // Ferme la modale au clic du bouton de sortie
    modal.querySelector(".modal-stop-prop").addEventListener("click", stopPropagation); // Evite la fermeture de la fenêtre lorsqu'on clique dessus(hors bouton de sortie)
}

// Fermeture de la fenêtre
const closeModal = function(e) {
    e.preventDefault();
    modal.style.display ="none";       // Cache la modale à nouveau
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".close-modal").removeEventListener("click", closeModal)
    modal.querySelector(".modal-stop-prop").removeEventListener("click", stopPropagation);
    modal = null;
}

const stopPropagation = function(e) {     // Empêche l'evenement (la fermeture de la modale ici) de se propager
    e.stopPropagation();
}

// Gestion d'evenement pour afficher la modale  lors du clic du bouton "Modifier" 
document.querySelector(".btn-modal").addEventListener("click", openModal);  