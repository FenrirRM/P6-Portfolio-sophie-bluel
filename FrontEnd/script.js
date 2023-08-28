// Fonction d'appel API

async function getworks() {
    const worksResponse = await fetch("http://localhost:5678/api/works");
    return await worksResponse.json();
}

// Fonction pour affichage dynamiques des éléments

async function displayworks () {
    const gallery = document.querySelector('.gallery');
    const dataworks = await getworks();

    dataworks.forEach((works) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.src = works.imageUrl;
        figcaption.innerText = works.title;
        figure.setAttribute("data-category", works.category.name);

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);

    });
};

displayworks();
