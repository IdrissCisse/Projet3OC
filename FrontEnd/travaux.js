async function afficherTravaux() {
    // Récuperation des données depuis l'API //
   const reponse = await fetch("http://localhost:5678/api/works");
   const travaux = await reponse.json();
   
   console.log(travaux);
   
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

