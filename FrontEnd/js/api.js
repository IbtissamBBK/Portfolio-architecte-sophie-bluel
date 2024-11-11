async function getWorks() { // Récup travaux depuis l'API et filtrer en fonction de la catégorie
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url); // GET pour récup travaux
        if (!response.ok) { // Vérifie si response ok 
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json(); // Réponse en Json

        return json

    } catch (error) {
        console.error(error.message);
    }
}

async function getCategories() { // Recup catégories depuis l'API pour filtrer
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url); // Effectue une requête API et attend la réponse
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`); // Si la réponse n'est pas OK, lance une erreur avec le statut de la réponse
        }
        const json = await response.json();  // Convertit la réponse en JSON
        
        return json;

    } catch (error) {
        console.error(error.message); // Message erreur dans console

    }
}


// FONCTION POUR AJOUTER CATEGORIES POUR DEUXIEME MODAL VIA l'API

async function loadCategories() {
    const urlCategories = 'http://localhost:5678/api/categories';
    const select = document.getElementById('categoryInput');
    select.innerHTML = '';

    try {
        const response = await fetch(urlCategories);
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des catégories : ${response.statusText}`);
        }

        const categories = await response.json();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

document.addEventListener('DOMContentLoaded', loadCategories);
