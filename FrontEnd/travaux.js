// Récuperaton des données par l'API
const reponse = await fetch("http://localhost:5678/api/works");
const travaux = await reponse.json();

// Fonction recuperant les travaux filtrés en argument (fonction suivante) pour les afficher
async function afficherTravaux(travauxFiltres) {

   // Recupère la div de la galerie 
   const galerie = document.querySelector(".gallery");
   galerie.innerHTML = "";

   // Creation d'une structure HTML pour chaque travail dans la liste filtrée 
   for (let travail of travauxFiltres) {
    const figure = document.createElement("figure");
    figure.innerHTML = `
        <img src="${travail.imageUrl}" alt="${travail.title}">
        <figcaption>${travail.title}</figcaption>
    `;
    galerie.appendChild(figure); // Place la balise "figure" comme enfant de l'element ".gallery" 
   };
   
};
afficherTravaux(travaux); // Afficher l'ensenmble des travaux par defaut lors du chargement de la page

// Fonction pour les filtres de la galerie 
async function filtrerGalerie() {

    // Recuperation des categories depuis l'api
    const resp = await fetch("http://localhost:5678/api/categories");
    const categories = await  resp.json();

    console.log(categories);

    // Conversion du tableau  en Set 
    const categoriesSet = new Set(categories.map(categorie => categorie.name));

    // Creation  du menu de filtres
    const filtres = document.querySelector(".filtres");
    const btnTous = document.createElement("button");
    btnTous.textContent = "Tous";
    btnTous.classList.add("bouton-filtre");
    filtres.appendChild(btnTous);
   
    // Afficher l'ensemble des travaux au clic du bouton " Tous "
    btnTous.addEventListener("click", async () => {
        await afficherTravaux(travaux)
    })

    // Creation de chaque bouton à partir des categories récupérées depuis l'API
    for (let categorieName of categoriesSet) {
        const btnFiltre = document.createElement("button");
        btnFiltre.textContent = categorieName;
        btnFiltre.classList.add("bouton-filtre");
        filtres.appendChild(btnFiltre);

        // Filtre des travaux en fonction de la categorie correspondante au nom du bouton de filtre cliqué
        btnFiltre.addEventListener("click", async () => {
            const travauxFiltres = travaux.filter(travail => travail.category.name === categorieName);
            await afficherTravaux(travauxFiltres);
            console.log(travauxFiltres)
        });
    };
};        
filtrerGalerie();