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

async function getCategories() {

    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        return json
        
    } catch (error) {
        console.error(error.message);
    }
}


// FONCTION POUR AJOUTER CATEGORIES POUR DEUXIEME MODAL VIA l'API
async function loadCategories() {
    const urlCategories = 'http://localhost:5678/api/categories'; // Assurez-vous que cette URL est correcte
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
            option.value = category.id; // Utilisez l'ID de la catégorie pour la valeur
            option.textContent = category.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
}

document.addEventListener('DOMContentLoaded', loadCategories);
