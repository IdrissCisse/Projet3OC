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

// Suppression  du token d'authentification lors du logout
const token = localStorage.getItem("authToken");
const logoutBtn = document.querySelector(".js-logout");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("authToken");
})

async function travauxModale() {
    const travauxModale = document.querySelector(".travaux-modale");
    travauxModale.innerHTML = "";
    for (let travail of travaux) {                     // Creation de la structure HMTL pour chaque travail
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

// Affichage des categories dans le formulaire d'ajout 
const selectCategory = document.getElementById("category");

async function afficherCategories() {
    const resp = await fetch("http://localhost:5678/api/categories");
    const categories = await resp.json();
    console.log(categories)

    const categoriesSet = new Set(categories.map(categorie => categorie.name));

    for (const categorieName of categoriesSet) {
        const option = document.createElement("option");
        option.textContent = categorieName;
        option.className = "option-cat";
        selectCategory.appendChild(option);
    }
}
afficherCategories();

//  MODALE
let modal = null;
const vue1 = document.querySelector(".view-1");
const vue2 = document.querySelector(".view-2");

// Ouverture de la fenêtre 
const openModal = function(e) {
    e.preventDefault();

    const target = document.querySelector(e.target.getAttribute("href"));
    target.style.display ="flex";   // Affiche la modale
    modal = target;
    modal.addEventListener("click", closeModal);  
    modal.querySelector(".close-modal").addEventListener("click", closeModal); // Ferme la modale au clic du bouton de sortie
    modal.querySelectorAll(".modal-stop-prop").forEach(m => {
        m.addEventListener("click", stopPropagation)
    }); // Evite la fermeture de la fenêtre lorsqu'on clique dessus(hors bouton de sortie)

    //  Configuration du "bouton retour" dans la 2éme vue pour qu'il méne vers la vue 1
    const btnRetour = modal.querySelector('.btn-to-modal1');
    btnRetour.addEventListener("click", defaultView)
}

// Fermeture de la fenêtre
const closeModal = function(e) {
   
    modal.style.display ="none";       // Cache la modale à nouveau
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".close-modal").removeEventListener("click", closeModal);
    modal.querySelectorAll(".modal-stop-prop").forEach(m => {
        m.removeEventListener("click", stopPropagation)
    });
   
    modal = null;
}

const stopPropagation = function(e) {     // Empêche l'événement de se propager vers l'élément parent ("clic" dans notre cas)
    e.stopPropagation();
}

// Affiche la premiere fenêtre 
const defaultView = function() {
    vue1.style.display = "flex";
    vue2.style.display = "none";
}

// Affiche la deuxième fenêtre
const defaultView2 = function() {
    vue1.style.display = "none";
    vue2.style.display = "flex";
}

// Gestion d'événement pour les boutons de fermeture de la modale
const closeModalEvent = document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", function() {
       closeModal();
       resetSecondView();
    })
});

// Gestion d'événement pour afficher la modale lors du clic du bouton "Modifier" ou "Ajouter photo"
document.querySelector(".btn-modal1").addEventListener("click", openModal);
document.querySelector(".btn-modal2").addEventListener("click", defaultView2);

// Lien du bouton " Ajouter photo" à l'input de type "file" pour ajouter des images
const addButton = document.querySelector(".add-photo-btn");
const addInput = document.querySelector(".add-photo-input");
const imgDiv = document.querySelector(".img-div");
let imgDivContent = document.querySelector(".img-div-content");
const postButton = document.querySelector(".post-btn");
const firstOption = document.querySelector(".option1");
const title = document.getElementById("title");

addButton.addEventListener("click", () => {
    addInput.click();
}); 

addInput.addEventListener("change", () => {
    let image = addInput.files[0];
    if(image) {
        const imageSrc = URL.createObjectURL(image);
        const imageBox = document.createElement("img");
        imageBox.className = "image-container";
        imageBox.src = imageSrc;
        imgDiv.appendChild(imageBox);
        imgDivContent.style.display = "none";
        postButtonCheck();
    }
})

// Supprime de la page l'image ajoutée s'il ya en une
function resetImg() {
    const imageBox = document.querySelector(".image-container");
    if (imageBox) {
        imageBox.parentNode.removeChild(imageBox); 
    }
    imgDivContent.style.display = "flex";
}

// Reinitialise  la 2eme vue et affiche la vue 1 en premier  si un bouton de sortie est cliqué 
function resetSecondView () {
    defaultView();
    resetImg();
    resetPostButton();
    selectCategory.value = "";
}

// Fonction verifiant la presence d'image et de catégorie avant d'activer le bouton de validation
function resetPostButton () {
    postButton.style.backgroundColor = "#A7A7A7";
    postButton.style.pointerEvents = "none";
}

function postButtonCheck() {
    const catSelect = selectCategory.value;
    const imageBox = document.querySelector(".image-container");
    const titleValue = title.value.trim(); // Suprrime les espaces vides pour ne prendre en compte que le texte

    if (catSelect !== "" && imageBox && titleValue !== "") {
        postButton.style.backgroundColor = "#1D6154";
        postButton.style.pointerEvents = "auto";
    } else {
        resetPostButton();
    }
}

selectCategory.addEventListener("change", postButtonCheck);
title.addEventListener("input", postButtonCheck)