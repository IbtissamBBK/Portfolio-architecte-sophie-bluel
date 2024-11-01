async function getWorks(filter) { // Récup travaux depuis l'API et filtrer en fonction de la catégorie
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url); // GET pour récup travaux
        if (!response.ok) { // Vérifie si response ok 
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json(); // Réponse en Json

        let filteredWorks = json; // Initialise les travaux sans filtrage
        if (filter) { // Si filter séléctionné 
            filteredWorks = json.filter((data) => data.categoryId === filter); // Filtre les travaux en fonction de l'ID
        }

        document.querySelector('.gallery').innerHTML = ""; // Vide la galerie avant d'ajouter les nouvelles images
        for (let i = 0; i < filteredWorks.length; i++) {
            setFigure(filteredWorks[i]);
        }

    } catch (error) {
        console.error(error.message);
    }
}

getWorks();  // Appelle la fonction pour récup tous les travaux au reload

async function getCategories() {

    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();


        // Ajout d'un bouton "Tous"
        const allDiv = document.createElement("div");
        allDiv.textContent = "Tous";
        allDiv.addEventListener("click", () => getWorks(undefined)); // Affiche tous les travaux
        document.querySelector('.filtersContainer').append(allDiv);

        // Ajoute les autres catégories
        for (let i = 0; i < json.length; i++) {
            setFilter(json[i]);
        }

    } catch (error) {
        console.error(error.message);
    }
}

getCategories(); // Récup catégories et génère un bouton pour chaque catégorie 



function setFigure(data) { // Insère figure HTML (image + titre) dans la gallerie

    const figure = document.createElement("figure")
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
				<figcaption>${data.title}</figcaption>`;


    document.querySelector('.gallery').append(figure);

    const figureClone = figure.cloneNode(true);
    document.querySelector('.gallery-modal').append(figureClone);
    figureClone.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                <i class="fa-solid fa-trash-can delete-icon" onclick="deletePhoto('${data.id}')"></i>`
}


// async function deletePhoto(photoId) {
//     // Construit l'URL avec l'ID du projet
//     const url = `http://localhost:5678/api/works/${photoId}`;
//     const authToken = localStorage.getItem('authToken'); // Récupère le token d'authentification

//     try {
//         // Envoie la requête DELETE à l'API
//         const response = await fetch(url, {
//             method: 'DELETE', // Méthode DELETE pour supprimer
//             headers: {
//                 'Authorization': `Bearer ${authToken}`, // En-tête d'authentification
//                 'Accept': '*/*' // En-tête accept, comme dans le curl
//             }
//         });

//         // Vérifie si la suppression est réussie
//         if (response.ok) {
//             console.log(`Projet avec l'ID ${photoId} supprimé avec succès.`);
//             // Supprime l'élément du DOM si la suppression est réussie
//             const figureToDelete = document.querySelector(`.gallery-modal figure[data-id='${photoId}']`);
//             if (figureToDelete) {
//                 figureToDelete.remove();
//             }
//         } else {
//             console.error("Erreur lors de la suppression :", response.statusText);
//         }
//     } catch (error) {
//         console.error("Erreur réseau lors de la suppression :", error);
//     }
// }


function setFilter(data) { // Fonction pour ajouter un filtre de catégorie
                const div = document.createElement("div");
                div.addEventListener("click", () => getWorks(data.id)); // Utilise l'ID de la catégorie pour filtrer
                div.innerHTML = `${data.name}`; // Ajout nom de la catégorie pour div
                document.querySelector('.filtersContainer').append(div);  // Insère le div dans le conteneur
            }


function displayAdminMode() {

                const authToken = localStorage.getItem('authToken'); // Récup token dans localStorage
                const loginButton = document.getElementById('login-button');
                const filtersContainer = document.querySelector('.filtersContainer'); // Sélectionne la section des filtres
                const editBanner = document.querySelector('.edit'); // Sélectionne la section des filtres

                if (authToken) { // Si token ok, l'user est connecté

                    if (filtersContainer) {
                        filtersContainer.style.display = 'none';
                    }

                    if (editBanner) {
                        editBanner.style.display = 'flex'; // Affiche la bannière d'édition
                    }

                    document.addEventListener('DOMContentLoaded', (event) => {
                        const h2Element = document.querySelector('#portfolio h2'); // Sélectionne le h2 dans la section portfolio
                        if (h2Element) {
                            // Vérifie si le lien "Modifier" existe déjà
                            if (!document.querySelector('#portfolio .js-modal')) {
                                const editModifications = document.createElement("div");
                                editModifications.innerHTML =
                                    '<a href="#modal" class="js-modal"><i class="fa-regular fa-pen-to-square"></i> Modifier</a>';


                                h2Element.parentNode.insertBefore(editModifications, h2Element.nextSibling); // Insère le bouton après le h2
                            }
                        }
                    });


                    // Modification le bouton "login" en "logout"
                    loginButton.textContent = "logout";
                    loginButton.href = "#"; // Désactive redirection vers page de connexion
                    loginButton.addEventListener('click', function () {

                        localStorage.removeItem('authToken'); // Delete le token du localStorage pour déco l'user
                        window.location.href = 'index.html'; // Reload la page
                    });

                } else {

                    if (filtersContainer) {
                        filtersContainer.style.display = 'flex';
                    }

                    if (editBanner) {
                        editBanner.style.display = 'none'; // Cache la bannière d'édition
                    }

                    // Aucun token, garder le bouton "login" actif
                    loginButton.textContent = "login";
                    loginButton.href = "./login.html"; // Redirection vers la page de connexion
                }
            }

// Exécute la fonction displayAdminMode lorsque la page est complètement chargée
window.addEventListener('DOMContentLoaded', displayAdminMode);

displayAdminMode()







