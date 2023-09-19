const gallery = document.querySelector('.gallery');

displayWorks();
btnfilters();


// Fonction d'appel API

async function getWorks() {
    try {
    const worksResponse = await fetch("http://localhost:5678/api/works");
    return worksResponse.json();
    } catch (error) {
        console.log("Erreur lors de la récupération des projets depuis l'API")
    }
}

async function getCategories() {
    try {
    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    return await categoriesResponse.json();
} catch (error) {
    console.log("Erreur lors de la récupération des catégories depuis l'API")
}
}

// Fonction pour affichage dynamiques des éléments

async function displayWorks (categorieId) {
    try {
        const dataworks = await getWorks();
        gallery.innerHTML = "";

            // Création des projets pour l'affichage dans la gallerie
            dataworks.forEach((works) => {
                if (categorieId == works.category.id || categorieId == null) {
                
                    const figure = document.createElement("figure");
                    const img = document.createElement("img");
                    const figcaption = document.createElement("figcaption");

                    img.src = works.imageUrl;
                    figcaption.innerText = works.title;
                    figure.setAttribute("categorieId", works.category.id);

                    figure.appendChild(img);
                    figure.appendChild(figcaption);
                    gallery.appendChild(figure);
                }
             })
    } catch (error) {
        console.log ("Erreur lors de l'affichage des projets")
    }
};

// Boutons filtres par catégories

async function btnfilters () {
    
    const dataCategories = await getCategories();
    const filters = document.querySelector(".filters");

    // Créations des boutons
    dataCategories.forEach((category) => {
        const btnCategorie =document.createElement("button");
        btnCategorie.innerText = category.name ;
        btnCategorie.setAttribute("class", "filterButton")
        btnCategorie.setAttribute("buttonId", category.id);
        filters.appendChild(btnCategorie);
    })

    // Ajout d'un event au clic sur chaque bouton
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            let categorieId = button.getAttribute("buttonId");
            buttons.forEach((button) => button.classList.remove("filterButtonActive"));
            this.classList.add("filterButtonActive");
            displayWorks (categorieId);
        })
    })
}

// Partie Admin connecté

const AdminToken = sessionStorage.getItem("token")
const connect = document.getElementById('login')



function Admin() {
    if (AdminToken) {
        connect.innerHTML = "<a href='#'>logout</a>";

        connect.addEventListener("click", (e) =>{
            e.preventDefault()
            sessionStorage.removeItem("token");
            window.location.href = "index.html";
        });

        bannerEdit();
    }
}

Admin()

// Création de la bannière noire
function bannerEdit() {
    const banner = document.getElementById('bannerEdit')

    banner.classList.add("blackBanner")
    banner.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>'+ "Mode édition";
}

