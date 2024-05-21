// Récupération des données par l'API
const reponse = await fetch("http://localhost:5678/api/works");
const travaux = await reponse.json();

// Fonction pour afficher les travaux filtrés
async function afficherTravaux(travauxFiltres) {
    const galerie = document.querySelector(".gallery");
    galerie.innerHTML = "";
    for (let travail of travauxFiltres) {
        const figure = document.createElement("figure");
        figure.innerHTML = `
            <img src="${travail.imageUrl}" alt="${travail.title}">
            <figcaption>${travail.title}</figcaption>
        `;
        galerie.appendChild(figure);
    };
};
afficherTravaux(travaux);

// Fonction pour les filtres de la galerie 
async function filtrerGalerie() {
    // Récupération des catégories depuis l'API
    const resp = await fetch("http://localhost:5678/api/categories");
    const categories = await resp.json();

    // Conversion du tableau en Set pour éliminer les doublons
    const categoriesSet = new Set(categories.map(categorie => categorie.name));

    // Création du menu de filtres
    const filtres = document.querySelector(".filtres");
    const btnTous = document.createElement("button");
    btnTous.textContent = "Tous";
    btnTous.classList.add("bouton-filtre");
    filtres.appendChild(btnTous);

    // Afficher tous les travaux au clic du bouton "Tous"
    btnTous.addEventListener("click", async () => {
        await afficherTravaux(travaux);
    });

    // Création de chaque bouton à partir des catégories récupérées depuis l'API
    for (let categorieName of categoriesSet) {
        const btnFiltre = document.createElement("button");
        btnFiltre.textContent = categorieName;
        btnFiltre.classList.add("bouton-filtre");
        filtres.appendChild(btnFiltre);

        // Filtrage des travaux en fonction de la catégorie correspondante au nom du bouton de filtre cliqué
        btnFiltre.addEventListener("click", async () => {
            const travauxFiltres = travaux.filter(travail => travail.category.name === categorieName);
            await afficherTravaux(travauxFiltres);
            console.log(travauxFiltres);
        });
    };
    
    // Fixation du style appliqué à un bouton lors du clic
    const boutonsFiltre = document.querySelectorAll(".bouton-filtre");
    for (const bouton of boutonsFiltre) {
        bouton.addEventListener("click", () => {
            for (const b of boutonsFiltre) {
                b.classList.remove("focus");    // Enleve le focus sur tous les boutons pour eviter une repetition du style au clic
            }
            bouton.classList.add("focus");
        });
    };
    btnTous.click(); // Active par defaut le bouton "Tous" lors du chargement de la page
}
filtrerGalerie();