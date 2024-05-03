const reponse = await fetch("http://localhost:5678/api/works");
const travaux = await reponse.json();

async function afficherTravaux(travauxFiltres) {

   // Recupère la div de la galerie //
   const galerie = document.querySelector(".gallery");

   // Une boucle pour parcourir les travaux et appliquer la structure HTML sur chaque travail //
   for (let i = 0; i < travaux.length; i++) {
    const travail = travaux[i];
    const figure = document.createElement("figure");
    
    figure.innerHTML = `
        <img src="${travail.imageUrl}" alt="${travail.title}">
        <figcaption>${travail.title}</figcaption>
    `;
    galerie.appendChild(figure); // Place la balise "figure" comme enfant de l'element ".gallery" //
   }
   
}
afficherTravaux();

// Filtres de la galerie 
async function filtrerGalerie() {

    // Recuperation des categories depuis l'apo
    const resp = await fetch("http://localhost:5678/api/categories");
    const categories = await  resp.json();

    console.log(categories);

    // Conversion du tableau  en Set 
    const categoriesSet = new Set(categories);

    // Creation  du menu de filtres
    const filtres = document.querySelector(".filtres");
    const btnTous = document.createElement("button");
    btnTous.textContent = "Tous";
    btnTous.classList.add("bouton-filtre");
    filtres.appendChild(btnTous);

    // Creation de chaque bouton à partir des categories récupérées depuis l'API
    for (let categorie of categories) {
        const btnFiltre = document.createElement("button");
        btnFiltre.textContent = categorie.name;
        btnFiltre.classList.add("bouton-filtre");
        filtres.appendChild(btnFiltre);
    };
}        
filtrerGalerie();