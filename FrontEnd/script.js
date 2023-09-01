// Fonction d'appel API

async function getworks() {
    const worksResponse = await fetch("http://localhost:5678/api/works");
    return worksResponse.json();
}

async function getcategories() {
    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    return await categoriesResponse.json();
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
        figure.setAttribute("categorieId", works.category.id);

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);

    });
};

displayworks();

// Boutons Filtres

const filters = document.querySelector(".filters");

// Boutons tous

const buttonALL = document.createElement("button");
buttonALL.setAttribute("class", "filterButton filterButtonselected")
buttonALL.innerText = "Tous";
filters.appendChild(buttonALL);
buttonALL.addEventListener('click',function() {btnALL()});

// Boutons filtres par catégories

async function btnfilters () {
    
    const dataCategories = await getcategories();
    dataCategories.forEach((category) => {
        const btnCategorie =document.createElement("button");
        btnCategorie.innerText = category.name ;
        btnCategorie.setAttribute("class", "filterButton")
        btnCategorie.setAttribute("categorieId", category.id);
        filters.appendChild(btnCategorie);
        btnCategorie.addEventListener('click', function(){filterbycategory(category.id)});
    })
}

btnfilters();

// Fonction pour filtré les projets par catégories

function filterbycategory (id) {
    const gallery = document.querySelector(".gallery");
    const works =  gallery.querySelectorAll("figure");
    works.forEach(element => {
    if (element.getAttribute("categorieId") != id) {
      element.style.display = "none"
    } else {
      element.style.display = "unset"
    }
  });
}

// Fonction pour affiché tous les projets 

function btnALL () {
    const gallery = document.querySelector(".gallery");
    const works =  gallery.querySelectorAll("figure");
    works.forEach(element => {
        element.style.display = "unset"
      }
    );
}

