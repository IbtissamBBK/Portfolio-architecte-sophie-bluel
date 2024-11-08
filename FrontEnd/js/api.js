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