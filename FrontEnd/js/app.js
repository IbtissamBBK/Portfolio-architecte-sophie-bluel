//* Import des fonctions nécessaires
import { getCategories, getWorks } from "./api.js";
import { deletePhoto, initialiseModal } from "./modal.js";

//***** Les évenements principales au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  displayWorks();
  displayCategoriesFilters();
  displayAdminMode();
  initialiseModal();
});

//* Affiche les travaux dans la galerie avec filtrage

async function displayWorks(filter) {
  const json = await getWorks();
  let filteredWorks = json; // Initialise les travaux sans filtrage

  if (filter) {
    // Si filter séléctionné
    filteredWorks = json.filter((data) => data.categoryId === filter); // Filtre les travaux en fonction de l'ID
  }

  document.querySelector(".gallery").innerHTML = ""; // Vide la galerie avant d'ajouter les nouvelles images

  filteredWorks.forEach((data) => {
    setFigure(data);
  });
}

//* Affiche les filtres de catégories

async function displayCategoriesFilters() {
  const json = await getCategories();

  // Ajout d'un bouton "Tous"
  const allDiv = document.createElement("div");
  allDiv.textContent = "Tous";
  allDiv.addEventListener("click", () => displayWorks()); // Affiche tous les travaux
  document.querySelector(".filtersContainer").append(allDiv);

  // Ajoute les autres catégories
  json.forEach((data) => {
    setFilter(data);
  });

  displayCategoriesOptions(json); // Affiche les options de catégories dans un menu déroulant de la deuxième modale
}

//* Affiche les options dans la deuxième modale

async function displayCategoriesOptions(categories) {
  const select = document.getElementById("categoryInput");

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

//* Crée un élément figure pour la gallerie et la modale

function setFigure(data) {
  // Crée la figure pour la galerie principale
  const figure = document.createElement("figure");
  figure.setAttribute("data-id", data.id);
  figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                        <figcaption>${data.title}</figcaption>`;
  document.querySelector(".gallery").append(figure);

  // Crée la figure pour la modale avec le bouton de suppression
  const figureClone = figure.cloneNode(true);
  figureClone.setAttribute("data-id", data.id);
  figureClone.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                             <i class="fa-solid fa-trash-can delete-icon"></i>`;
  document.querySelector(".gallery-modal").append(figureClone);
  document
    .querySelector(`.gallery-modal [data-id="${data.id}"] .delete-icon`)
    .addEventListener("click", () => {
      deletePhoto(data.id);
    });
}

//* Ajoute un bouton de filtre pour chaque catégorie

function setFilter(data) {
  // Fonction pour ajouter un filtre de catégorie
  const div = document.createElement("div");
  div.addEventListener("click", () => displayWorks(data.id)); // Utilise l'ID de la catégorie pour filtrer
  div.innerHTML = `${data.name}`; // Ajout nom de la catégorie pour div
  document.querySelector(".filtersContainer").append(div); // Insère le div dans le conteneur
}

//* Gère le mode Admin : active ou désactive le mode admin en fonction de l'authentification

const displayAdminMode = () => {
  // Fonction principale pour gérer le mode admin

  // Récupére les éléments nécessaires
  const authToken = localStorage.getItem("authToken");
  const adminIsLogged = !!authToken;

  const loginButton = document.getElementById("login-button");
  const filtersContainer = document.querySelector(".filtersContainer");
  const editBanner = document.querySelector(".edit");
  const h2Element = document.querySelector("#portfolio h2");

  // Fonction pour configurer le bouton login/logout
  const setupLoginButton = (adminIsLogged) => {
    loginButton.textContent = adminIsLogged ? "logout" : "login";
    loginButton.href = adminIsLogged ? "#" : "./login.html";

    if (adminIsLogged) {
      // Ajoute l'événement de déconnexion si l'utilisateur est admin
      loginButton.onclick = () => {
        localStorage.removeItem("authToken");
        window.location.href = "index.html";
      };
    } else {
      loginButton.onclick = null; // Supprime tout ancien gestionnaire
    }
  };

  // Fonction pour afficher ou masquer certains éléments en fonction du statut de connexion
  const toggleAdminElements = (adminIsLogged) => {
    if (filtersContainer)
      filtersContainer.style.display = adminIsLogged ? "none" : "flex";
    if (editBanner) editBanner.style.display = adminIsLogged ? "flex" : "none";
  };

  // Fonction pour ajouter le lien "Modifier" si l'utilisateur est connecté
  const addEditButton = () => {
    if (h2Element && !document.querySelector("#portfolio .js-modal")) {
      const editModifications = document.createElement("div");
      editModifications.innerHTML =
        '<a href="#modal" class="js-modal"><i class="fa-regular fa-pen-to-square"></i> Modifier</a>';
      h2Element.insertAdjacentElement("afterend", editModifications);
    }
  };

  if (adminIsLogged) {
    // Vérifie si l'utilisateur est connecté
    toggleAdminElements(true); // Active le mode admin
    setupLoginButton(true); // Configure le bouton en mode déconnexion
    addEditButton(); // Ajoute le bouton "Modifier"
  } else {
    toggleAdminElements(false); // Désactive le mode admin
    setupLoginButton(false); // Configure le bouton en mode connexion
  }
};
