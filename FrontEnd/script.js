const gallery = document.querySelector('.gallery');
const galleryModal = document.querySelector(".galleryModal");


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
        galleryModal.innerHTML = "";
            // Création des projets pour l'affichage dans les galleries
            dataworks.forEach((works) => {
                if (categorieId == works.category.id || categorieId == null) {
                    createWorks(works)
                    createWorksModal(works)
                }
             });
    } catch (error) {
        console.log ("Erreur lors de l'affichage des projets")
    }
};

// Fonction pour créer un projet dans la galerie
function createWorks(works) {
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

// Fonction pour créer un projet dans la galerie de la modale
function createWorksModal(works) {
    const figureModal = document.createElement("figure");
    const imgModal = document.createElement("img");

    imgModal.src = works.imageUrl;
    figureModal.setAttribute("id", works.id);

    const iconTrash = document.createElement("div");
    iconTrash.classList.add("iconTrash");
    iconTrash.innerHTML = "<i class='fa-solid fa-trash-can modalTrash'></i>";

    figureModal.appendChild(imgModal);
    figureModal.appendChild(iconTrash);
    galleryModal.appendChild(figureModal);
    
    iconTrash.addEventListener("click", (e) => {
        
        deleteWorks(works.id);
        e.preventDefault();
    });
}
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
    const buttons = document.querySelectorAll(".filters button");
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

const adminToken = sessionStorage.getItem("token")
const connect = document.getElementById('login')



function Admin() {
    if (adminToken) {
        connect.innerHTML = "<a href='#'>logout</a>";

        connect.addEventListener("click", (e) =>{
            e.preventDefault();
            sessionStorage.removeItem("token");
            window.location.href = "index.html";
        });

        
        adminDisplay();
        creatModal();
        
    }
}

Admin()



function adminDisplay() {
    // Création de la bannière noire
    const banner = document.getElementById('bannerEdit')

    banner.classList.add("blackBanner")
    banner.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>'+ "Mode édition";

    // On masque les filtres
    const filters = document.querySelector(".filters");
    filters.style.display = "none";

    // Modification de la margin sous le h2 'Mes Projets' 
    const portfolioTitle = document.querySelector(".portfolioTitle");
    portfolioTitle.style.marginBottom = "90px";

    // Ajout du bouton modifier
    const boutonEdit = document.createElement("a");
    boutonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>' + "modifier";
    boutonEdit.href = "#modal1";
    boutonEdit.classList.add("editBouton", "js-modal")
    portfolioTitle.appendChild(boutonEdit)
}

// MODAL
function creatModal() {
let modal = null
const focusableSelector = "button, a, input, textarea";
let focusables = [];


// fonction pour ouvrir la modale
const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(':focus')
    modal.style.display = null;
    focusables[0].focus()
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
  };

// fonction pour fermer la modale
const closeModal = function (e) {
    if (modal === null) return;
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal = null
};

const stopPropagation = function (e) {
    e.stopPropagation();
};

// Gérer le focus des éléments dans la modale
const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"));
    if (e.shiftKey === true) {
        index--
    } else {
        index++;
    }
    if (index >= focusables.length) {
      index = 0;
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus();
    console.log(index);
};


document.querySelectorAll(".js-modal").forEach((a) => {
    a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeModal(e);
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
      }
});
};

async function deleteWorks(workId) {
    const adminToken = sessionStorage.getItem("token")
    try {
        if (window.confirm("Êtes vous sûr de vouloir effacer ce projet?")) {
            let response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: "DELETE",
                headers: {
                    accept: "*/*",
                    Authorization: `Bearer ${adminToken}`,
                },
            });
        

            if (response.status === 200) {
                console.log("Projet supprimé avec succès.");
                displayWorks();
            } else if (response.status === 401) {
                console.error("Non autorisé à effectuer cette action.");
            }
        }    
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
      };
};