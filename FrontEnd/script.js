const gallery = document.querySelector('.gallery');
const galleryModal = document.querySelector(".galleryModal");
const adminToken = sessionStorage.getItem("token")

async function start() {
    displayWorks();
    btnfilters();
    Admin();
}

start();

// Fonction d'appel API

async function getWorks() {
    try {
        const worksResponse = await fetch("http://localhost:5678/api/works");
        return worksResponse.json();
    } catch (error) {
        console.log("Erreur lors de la récupération des projets depuis l'API");
    };
};

async function getCategories() {
    try {
        const categoriesResponse = await fetch("http://localhost:5678/api/categories");
        return await categoriesResponse.json();
    } catch (error) {
        console.log("Erreur lors de la récupération des catégories depuis l'API");
    };
};

// Fonction pour affichage dynamiques des éléments

async function displayWorks(categorieId) {

    try {
        const dataworks = await getWorks();
        gallery.innerHTML = "";
        galleryModal.innerHTML = "";
        // Création des projets pour l'affichage dans les galleries
        dataworks.forEach((works) => {
            if (categorieId == works.category.id || categorieId == null) {
                createWorks(works);
                createWorksModal(works);
            }
        });
    } catch (error) {
        console.log("Erreur lors de l'affichage des projets");
    };
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

    const iconTrash = document.createElement("button");
    iconTrash.classList.add("iconTrash");
    iconTrash.innerHTML = "<i class='fa-solid fa-trash-can modalTrash'></i>";

    figureModal.appendChild(imgModal);
    figureModal.appendChild(iconTrash);
    galleryModal.appendChild(figureModal);

    // Ajout d'un event listener sur l'icon corbeille pour supprimer un projet
    iconTrash.addEventListener("click", (e) => {
        e.preventDefault();
        deleteWorks(works.id);

    });
};

// Boutons filtres par catégories
async function btnfilters() {

    const dataCategories = await getCategories();
    const filters = document.querySelector(".filters");

    // Créations des boutons
    dataCategories.forEach((category) => {
        const btnCategorie = document.createElement("button");
        btnCategorie.innerText = category.name;
        btnCategorie.setAttribute("class", "filterButton")
        btnCategorie.setAttribute("buttonId", category.id);
        filters.appendChild(btnCategorie);
    });

    // Ajout d'un event au clic sur chaque bouton
    const buttons = document.querySelectorAll(".filters button");
    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            let categorieId = button.getAttribute("buttonId");
            buttons.forEach((button) => button.classList.remove("filterButtonActive"));
            this.classList.add("filterButtonActive");
            displayWorks(categorieId);
        });
    });
};

// Partie Admin connecté

// Fonction Admin principale
function Admin() {
    if (adminToken) { // si le token admin est présent

        // Modification de 'login' en 'logout'
        const connect = document.getElementById('login');
        connect.innerHTML = "<a href='#'>logout</a>";

        //Ajout d'un event listener pour supprimer le token d'idenfication
        connect.addEventListener("click", (e) => {
            sessionStorage.removeItem("token");  // on supprime le token du session storage
            window.location.href = "index.html"; // on recharge la page index
        });

        adminDisplay();
        createModal()
        navigateModal();
        createCategoryOption();
        inputFiles();
        addWorks();

    };
};

// Fonction pour modifier ou ajouter des élément pour la page index connectée
function adminDisplay() {
    // Création de la bannière noire
    const banner = document.getElementById('bannerEdit')
    banner.classList.add("blackBanner")
    banner.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>' + "Mode édition";

    // On masque les filtres
    const filters = document.querySelector(".filters");
    filters.style.display = "none";

    // Modification de la margin au dessus du header
    const header = document.querySelector("header");
    header.style.marginTop = "109px";
    
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

// Fonction pour créer la fenêtre modale
function createModal() {
    let modal = null

    // fonction pour ouvrir la modale
    const openModal = function (e) {
        e.preventDefault();
        modal = document.querySelector(e.target.getAttribute("href"));
        previouslyFocusedElement = document.querySelector(':focus');
        modal.style.display = null;
        modal.removeAttribute("aria-hidden");
        modal.setAttribute("aria-modal", "true");
        modal.addEventListener("click", closeModal);
        modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
        modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    };

    // fonction pour fermer la modale
    const closeModal = function (e) {
        if (modal === null) return; // si il n'y as pas de modale d'afficher la fonction s'arrête là 
        if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()

        const modalContent1 = document.querySelector(".modalContent1");
        const modalContent2 = document.querySelector(".modalContent2");
        const arrowLeft = document.querySelector(".arrowLeft");

        // On ajoute un timer de 300ms pour laisser l'animation de fermeture se jouer
        window.setTimeout(function () {
            modal.style.display = "none";
            modal = null;
            modalContent1.style.display = "flex";
            modalContent2.style.display = "none";
            arrowLeft.style.display = "none";
            // Reset formulaire 
            resetForm();
        }, 300);

        modal.setAttribute("aria-hidden", "true");
        modal.removeAttribute("aria-modal");
        modal.removeEventListener("click", closeModal);
        modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
        modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    };

    // Fonction pour empêcher la propagation de l'évènement aux parents
    const stopPropagation = function (e) {
        e.stopPropagation();
    };

    // Ajout d'un event listener pour ouvrir la modale 
    document.querySelectorAll(".js-modal").forEach((a) => {
        a.addEventListener("click", openModal);
    });

    // Gestion de la touche 'echap' pour fermer la modale
    window.addEventListener("keydown", function (e) {
        if (e.key === "Escape" || e.key === "Esc") {
            closeModal(e);
        };
    });
};

// Fonction pour supprimer un projet
async function deleteWorks(workId) {
    const adminToken = sessionStorage.getItem("token")
    try {
        if (window.confirm("Êtes vous sûr de vouloir effacer ce projet?")) { // fenêtre de confirmation

            // Requête API pour supprimer un projet en fonction de son Id 
            let response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            if (response.ok) {
                console.log("Projet supprimé avec succès.");
                displayWorks(); // on actualise les galeries avec les projets récupérer de l'api
            } else if (response.status === 401) {
                console.error("Non autorisé à effectuer cette action.");
            }
        }
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
    };
};

// Fonction pour changer de fenêtre dans la modale
function navigateModal() {
    const buttonModal = document.querySelector(".buttonModal");
    const modalContent1 = document.querySelector(".modalContent1");
    const modalContent2 = document.querySelector(".modalContent2");
    const arrowLeft = document.querySelector(".arrowLeft");

    // Pour aller vers la fenêtre d'ajout de projet
    buttonModal.addEventListener("click", function () {
        modalContent1.style.display = "none";
        modalContent2.style.display = "flex";
        arrowLeft.style.display = "flex";
        buttonFormCheck();
    });

    // Pour aller vers la fenêtre de la gallerie de la modale
    arrowLeft.addEventListener("click", function () {
        modalContent1.style.display = "flex";
        modalContent2.style.display = "none";
        arrowLeft.style.display = "none";
        resetForm()
    });
};

// Fonction pour créer les options pour la selection de catégorie d'ajout photo
async function createCategoryOption() {
    const dataCategories = await getCategories();
    const categorie = document.getElementById("category");

    dataCategories.forEach((category) => {
        const option = document.createElement("option");
        option.innerText = category.name;
        option.value = category.id;
        categorie.appendChild(option);
    });

};

// Fonction pour afficher la preview de l'image input 
function inputFiles() {
    const viewImage = document.querySelector(".addPhoto");
    const iconDelete = document.querySelector(".iconDelete");
    const inputFile = document.getElementById("photoInput");
    const logoPhoto = document.querySelector(".logoPhoto");
    const btnPhotoInput = document.querySelector(".btnPhotoInput");
    const photoInputTxt = document.querySelector(".photoInputTxt");
    const errorImg = document.querySelector(".errorImg");

    inputFile.addEventListener("change", () => {
        const file = inputFile.files[0];

        // Erreur si l'image fait plus de 4mo ou si mauvais type de fichier
        const fileMaxSize = 4 * 1024 * 1024;
        if (file.size > fileMaxSize) {
            inputFile.value = "";
            errorImg.textContent = "Votre image est trop volumineuse";
            console.log("Image file > 4mo");
            buttonFormCheck()

        } else if (file.type !== "image/jpg" && file.type !== "image/jpeg" && file.type !== "image/png") {
            inputFile.value = "";
            errorImg.textContent = "Votre image doit être au format jpg/jpeg ou png";
            console.log("Erreur format image");
            buttonFormCheck()
        } else {  // image valide

            // On enlève le message d'erreur
            errorImg.textContent = "";

            // Création de l'image preview
            const uploadedImage = document.createElement("img");
            uploadedImage.src = URL.createObjectURL(file);
            uploadedImage.classList.add("imageFile");
            viewImage.appendChild(uploadedImage);

            // Cacher les éléments de la boite ajout photo et afficher la croix
            logoPhoto.style.display = "none";
            btnPhotoInput.style.display = "none";
            photoInputTxt.style.display = "none";
            errorImg.style.display = "none";
            iconDelete.style.display = "flex";

            // Event sur la croix pour enlever le file input
            iconDelete.addEventListener("click", function () {
                const imageFile = document.querySelector(".imageFile");

                // Afficher les éléments de la boite ajout photo et cacher la croix
                logoPhoto.style.display = "flex";
                btnPhotoInput.style.display = "flex";
                photoInputTxt.style.display = "flex";
                errorImg.style.display = "flex";
                iconDelete.style.display = "none";

                // Supprimer l'image
                if (imageFile) {
                    imageFile.remove();
                }
                inputFile.value = "";
                buttonFormCheck()
            });
        }
    });
};

// Fonction pour ajouter un projet
function addWorks() {
    const titleWork = document.getElementById("title");
    const select = document.getElementById("category");
    const inputFile = document.getElementById("photoInput");
    const form = document.getElementById("formModal");

    titleWork.addEventListener("input", buttonFormCheck);
    select.addEventListener("input", buttonFormCheck);
    inputFile.addEventListener("input", buttonFormCheck);

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const file = await inputFile.files[0];
        Title = titleWork.value;
        Category = select.value;
        ImageValue = file;

        const formData = new FormData();
        formData.append("image", ImageValue);
        formData.append("title", Title);
        formData.append("category", Category);

        const adminToken = sessionStorage.getItem("token");

        // Requête API pour ajouter un projet
        let response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${adminToken}`,
            },
            body: formData,
        });

        if (response.ok) {
            console.log("Projet ajouté avec succès.");
            displayWorks(); // on actualise les galeries avec les projets récupérer de l'api
            this.reset();   // on reset le formulaire ajout image
            closeModal();   // on ferme la modale
        } else {
            console.log("erreur formulaire");
        };
    });
};

// Fonction pour reset le formulaire ajout image
function resetForm() {
    const form = document.getElementById("formModal");
    form.reset();

    const imageFile = document.querySelector(".imageFile");
    const inputFile = document.getElementById("photoInput");
    const iconDelete = document.querySelector(".iconDelete");
    const logoPhoto = document.querySelector(".logoPhoto");
    const btnPhotoInput = document.querySelector(".btnPhotoInput");
    const photoInputTxt = document.querySelector(".photoInputTxt");
    const errorImg = document.querySelector(".errorImg");

    logoPhoto.style.display = "flex";
    btnPhotoInput.style.display = "flex";
    photoInputTxt.style.display = "flex";
    errorImg.style.display = "flex";
    iconDelete.style.display = "none";

    if (imageFile) {
        imageFile.remove();
    };
    inputFile.value = "";
    errorImg.textContent = "";
};

// Fonction pour activé ou désactivé le boutton de formulaire en fonction des champs remplis
function buttonFormCheck() {
    const titleWork = document.getElementById("title");
    const select = document.getElementById("category");
    const inputFile = document.getElementById("photoInput");
    const buttonValidate = document.getElementById("buttonValidate");

    if (titleWork.value !== "" && select.value !== "" && inputFile.files.length !== 0) {
        buttonValidate.disabled = false;
        buttonValidate.style.backgroundColor = "#1d6154";
        console.log("formulaire ok");
    } else {
        buttonValidate.disabled = true;
        buttonValidate.style.backgroundColor = "#a7a7a7";
        console.log("formulaire incomplet");
    };
};