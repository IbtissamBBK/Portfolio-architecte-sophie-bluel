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

    // Bouton pour ajouter photo via deuxième modale
    document.querySelector('.add-photo-button')?.addEventListener('click', () => {
        closeModal(modal);
        openModal(modalAddWork);
    });

    // Bouton pour revenir à la première modale
    document.querySelector('.back-modal')?.addEventListener('click', () => {
        closeModal(modalAddWork);
        openModal(modal);
    });

    // Boutons de fermeture (croix) + fermeture extérieur modal
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



// FONCTION POUR SUPPRIMER PHOTO

// Fonction pour supprimer un élément de la galerie
function removeGalleryItems(photoId) {
    // Sélectionne à la fois dans la galerie principale et la modale
    ['.gallery', '.gallery-modal'].forEach(selector => {
        const item = document.querySelector(`${selector} [data-id='${photoId}']`);
        // console.log(`Suppression de l'élément avec ID ${photoId} dans ${selector}`);
        if (item) {
            item.closest('figure').remove();
            // console.log(`Élément avec ID ${photoId} supprimé de ${selector}`);
        }
    });
}

// Fonction async pour supprimer une photo
async function deletePhoto(photoId) {
    const url = `http://localhost:5678/api/works/${photoId}`;
    const authToken = localStorage.getItem('authToken');

    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;

    try {
        // Effectuer la requête DELETE vers l'API
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Accept': '*/*'
            }
        });

        // Vérifie si la suppression ok
        if (response.ok) {
            
            // Supprime l'élément de la galerie et de la modale
            removeGalleryItems(photoId);
        } 

    } catch (error) {
        console.error("Erreur réseau.", error);
        alert("Erreur réseau.");
    }
}



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

    try { // Envoi des données à l'API
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });

        if (response.ok) { // Vérification si la requête a réussi
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



// Pour voir la photo en preview avant de l'ajouter

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

