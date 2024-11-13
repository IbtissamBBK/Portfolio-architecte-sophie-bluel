export async function getWorks() { //* Fonction pour récupérer les travaux depuis l'API
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url); // GET pour récup travaux
    
    if (!response.ok) {  // Vérifie si response ok

      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json(); // Réponse en Json

    return json;
  } catch (error) {
    console.error(error.message);
  }
}

export async function getCategories() { //* Fonction pour récupérer les catégories depuis l'API pour filtrer
  
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url); // Effectue une requête API et attend la réponse
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`); // Si la réponse n'est pas OK, lance une erreur avec le statut de la réponse
    }
    const json = await response.json(); // Convertit la réponse en JSON

    return json;
  } catch (error) {
    console.error(error.message); // Message erreur dans console
  }
}
