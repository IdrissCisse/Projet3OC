/****** Reprise de la fonction afficherTravaux car l'importation depuis  "js/travaux.js" est inefficace
  (fonction non reutilisable pour ce cas)
*****/
const reponse = await fetch("http://localhost:5678/api/works");
const travaux = await reponse.json();

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