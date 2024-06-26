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
        figure.className = "work-image";
        figure.id = travail.id;
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

// Cache la barre de defilement aprés un certain delai d'inactivité
let timer; 
const modalWorks = document.querySelector(".travaux-modale");

function hideScrollbar() {
    modalWorks.style.overflowY = "hidden"; // Masque la barre de défilement si pas de débordement
};

function resetTimer() {
    clearTimeout(timer);
    modalWorks.style.overflowY = "auto";
    timer = setTimeout(hideScrollbar, 2000); // Masque la barre de défilement après 2 secondes d'inactivité
};
modalWorks.addEventListener("mousemove", resetTimer);

// Affichage des categories dans le formulaire d'ajout 
const selectCategory = document.getElementById("category");

async function afficherCategories() {
    const resp = await fetch("http://localhost:5678/api/categories");
    const categories = await resp.json();

    for (const categorie of categories) {
        const option = document.createElement("option");
        option.textContent = categorie.name;
        option.className = "option-cat";
        selectCategory.appendChild(option);
        option.value = categorie.id;
    };
};
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

addButton.addEventListener("click", (e) => {
    e.preventDefault();
    addInput.click();
}); 

addInput.addEventListener("change", ( ) => {
    let image = addInput.files[0];
    if(image) {
        const imageSrc = URL.createObjectURL(image);
        const imageBox = document.createElement("img");
        imageBox.className = "image-container";
        imageBox.src = imageSrc;
        imgDiv.appendChild(imageBox);
        imgDivContent.style.display = "none";
        postButtonCheck();
    };
});

// Supprime de la page l'image ajoutée s'il ya en une
function resetImg() {
    const imageBox = document.querySelector(".image-container");
    if (imageBox) {
        imageBox.parentNode.removeChild(imageBox); 
    };
    imgDivContent.style.display = "flex";
};

// Reinitialise  la 2eme vue et affiche la vue 1 en premier  si un bouton de sortie est cliqué 
function resetSecondView () {
    defaultView();
    resetImg();
    postButton.style.backgroundColor = "#A7A7A7";
    selectCategory.value = "";
    title.value = "";
}

// Fonction verifiant la presence d'image et de catégorie avant d'activer le bouton de validation
function postButtonCheck() {
    const catSelect = selectCategory.value;
    const imageBox = document.querySelector(".image-container");
    const titleValue = title.value.trim();

    // Suprrime les espaces vides pour ne prendre en compte que le texte
    if (catSelect !== "" && imageBox && titleValue !== "") {
        postButton.style.backgroundColor = "#1D6154";
    } else {
        postButton.style.backgroundColor = "#A7A7A7";
    };
};

selectCategory.addEventListener("change", postButtonCheck);
title.addEventListener("input", postButtonCheck);

// Requete de suppression des projets
async function workDeletion (event) {
    const isConfirmed = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (!isConfirmed) {
        return; // Si l'utilisateur annule, on arrête la fonction ici
    };

    const workDelId = event.currentTarget.id;
    const url = `http://localhost:5678/api/works/${workDelId}`;

    const response = await fetch( url , {
        method : "DELETE",
        headers : {
            "Accept" : "*/*",
            "Authorization": `Bearer ${token}`
        }
    });

    if(response.ok) {
        const workModalImg = document.getElementById(workDelId);
        workModalImg.parentNode.remove();

        const projets = document.querySelectorAll(".work-image"); // Supprime en meme temps les projets dans la galerie
        projets.forEach(projet => {
            if(projet.id === workDelId) {
                projet.parentNode.removeChild(projet);
            };
        });
    };
};

// Gestion d'evenement pour le clic d'un bouton de suppression de projet
function delButtonEvent () {
    const btnDel = document.querySelectorAll(".del-button");
    btnDel.forEach(btn => {
        btn.addEventListener("click", workDeletion);
    });
};
delButtonEvent();

// Ajout travaux 
document.querySelector(".add-work-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const url = "http://localhost:5678/api/works";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
        },
            body: formData
        });

    const data = await response.json();  //Affiche immediatement dans le DOM le travail ajouté 
    travaux.push(data);          
    afficherTravaux(); 
    travauxModale();
    closeModal();
    resetSecondView(); //Nettoie et ferme la modale aprés ajout d'un travail
    delButtonEvent();
});