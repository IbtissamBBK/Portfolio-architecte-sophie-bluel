async function getWorks(filter) {
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        let filteredWorks = json;
        if (filter !== undefined) {
            filteredWorks = json.filter((data) => data.categoryId === filter);
        }

        document.querySelector('.gallery').innerHTML = ""; // Vide la galerie avant d'ajouter les nouvelles images
        for (let i = 0; i < filteredWorks.length; i++) {
            setFigure(filteredWorks[i]);
        }

    } catch (error) {
        console.error(error.message);
    }
}

getWorks();


function setFigure(data) {

    const figure = document.createElement("figure")
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
				<figcaption>${data.title}</figcaption>`;

    document.querySelector('.gallery').append(figure);

}

async function getCategories() {
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

        // Ajoute un bouton pour "Tous"
        const allDiv = document.createElement("div");
        allDiv.textContent = "Tous";
        allDiv.addEventListener("click", () => getWorks(undefined)); // Affiche tous les travaux
        document.querySelector('.div-container').append(allDiv);

        // Ajoute les autres catégories
        for (let i = 0; i < json.length; i++) {
            setFilter(json[i]);
        }

    } catch (error) {
        console.error(error.message);
    }
}

getCategories();


function setFilter(data) {
    const div = document.createElement("div");
    div.addEventListener("click", () => getWorks(data.id)); // Utilise l'ID de la catégorie pour filtrer
    div.innerHTML = `${data.name}`;
    document.querySelector('.div-container').append(div);
}




