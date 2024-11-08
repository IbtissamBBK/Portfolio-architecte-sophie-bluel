document.addEventListener('DOMContentLoaded', () => {
    // Sélection des modales
    const modal = document.getElementById('modal');
    const modalAddWork = document.getElementById('modalAddWork');

    // Fonction pour ouvrir une modale
    const openModal = (modal) => {
        if (modal) {
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            modal.setAttribute('aria-modal', 'true');
        }
    };

    // Fonction pour fermer une modale
    const closeModal = (modal) => {
        if (modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
        }
    };

    // Ouvrir la première modale avec les boutons
    document.querySelectorAll('.js-modal').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modal);
        });
    });

    // Bouton pour ouvrir la deuxième modale
    document.querySelector('.add-photo-button')?.addEventListener('click', () => {
        closeModal(modal);
        openModal(modalAddWork);
    });

    // Bouton pour revenir à la première modale
    document.querySelector('.back-modal')?.addEventListener('click', () => {
        closeModal(modalAddWork);
        openModal(modal);
    });

    // Écouteurs pour les boutons de fermeture (croix)
    const closeModalButton = document.getElementById('close-modal');
    const closeModalAddWorkButton = document.getElementById('close-modal-add-work');

    closeModalButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal(modal);
    });

    closeModalAddWorkButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal(modalAddWork);
    });

    // Fermer les modales en cliquant en dehors
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });

    modalAddWork?.addEventListener('click', (e) => {
        if (e.target === modalAddWork) closeModal(modalAddWork);
    });
});



// Fonction pour supprimer une photo
async function deletePhoto(photoId) {
    const url = `http://localhost:5678/api/works/${photoId}`;
    const authToken = localStorage.getItem('authToken');

    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Accept': '*/*'
            }
        });

        if (response.ok) {
            // Supprimer dynamiquement l'élément dans la galerie principale
            const galleryItem = document.querySelector(`.gallery [data-id='${photoId}']`);
            if (galleryItem) galleryItem.closest('figure').remove();

            // Supprimer dynamiquement l'élément dans la modale
            const modalItem = document.querySelector(`.gallery-modal [data-id='${photoId}']`);
            if (modalItem) modalItem.closest('figure').remove();


        }

    } catch (error) {
        console.error("Erreur réseau.", error);
        alert("Erreur réseau.");
    }
}



// Fonction pour charger les catégories depuis l'API
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



// AJOUTER UN NOUVEAU PROJET

document.getElementById('formAddWork').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const url = 'http://localhost:5678/api/works';
    const authToken = localStorage.getItem('authToken');

    // Vérifiez que tous les champs requis sont remplis
    if (!formData.get('title') || !formData.get('category') || !formData.get('image')) {
        alert("Tous les champs sont requis.");
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        if (response.ok) {
            const newProject = await response.json(); // Récupérer les données du projet ajouté

            // Ajouter dynamiquement le nouveau projet dans la galerie et la modale
            setFigure(newProject);

            alert("projet ajouté avec succès.");
            form.reset();  // Réinitialiser le formulaire
            document.getElementById('modalAddWork').style.display = 'none';  // Fermer la modale

        } else {
            alert("Erreur lors de l'ajout du projet.");
        }
    } catch (error) {
        alert("Erreur réseau.");
    }
});



// Pour voir la photo en prévisualisation avant de l'ajouter

document.getElementById('file').addEventListener('change', function () {
    const fileInput = document.getElementById('file');
    const previewImage = document.getElementById('previewImage');
    const uploadLabel = document.getElementById('uploadLabel');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block'; // Afficher l'image
            uploadLabel.classList.add('hidden'); // Masquer le bouton de téléchargement
        };
        reader.readAsDataURL(file);
    }
});

