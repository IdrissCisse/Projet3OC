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


