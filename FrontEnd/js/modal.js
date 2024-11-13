//* FONCTION POUR OUVRIR ET FERMER LES MODALES

export function initialiseModal () {
    // Sélection des modales
    const modal = document.getElementById('modal');
    const modalAddWork = document.getElementById('modalAddWork');

    // Fonction pour ouvrir la modale
    const openModal = (modal) => {
        if (modal) {
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            modal.setAttribute('aria-modal', 'true');
        }
    };

    // Fonction pour fermer la modale
    const closeModal = (modal) => {
        if (modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
        }
    };

    // Ouvre la première modale avec les boutons
    document.querySelector('.js-modal')?.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modal);
        
    });

    // Bouton pour ajouter photo via deuxième modale
    document.querySelector('.add-photo-button')?.addEventListener('click', () => {
        closeModal(modal);
        openModal(modalAddWork);
    });

    // Bouton pour revenir en arrièe à la première modale
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

    // Ferme les modales en cliquant en dehors de la fenêtre
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });

    modalAddWork?.addEventListener('click', (e) => {
        if (e.target === modalAddWork) closeModal(modalAddWork);
    });
};



//* FONCTION POUR SUPPRIMER PHOTO

// Fonction pour enlever un élément des galleries (sans supprimer du serveur)
function removeGalleryItems(photoId) {
    
    // Sélectionne la galerie principale et la modale
    ['.gallery', '.gallery-modal'].forEach(selector => {
        const item = document.querySelector(`${selector} [data-id='${photoId}']`);
        if (item) {
            item.closest('figure').remove();
        }
    });
}

// Fonction async pour supprimer une photo du serveur via requête API
export async function deletePhoto(photoId) {
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
            
            removeGalleryItems(photoId); // Supprime l'élément de la galerie et de la modale
        } 

    } catch (error) {
        console.error("Erreur réseau.", error);
        alert("Erreur réseau.");
    }
}



//* AJOUTER UN NOUVEAU PROJET 

document.getElementById('formAddWork').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const url = 'http://localhost:5678/api/works';
    const authToken = localStorage.getItem('authToken');

    // Vérifie si tout les champs requis sont remplis
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
            const newProject = await response.json(); // Récupère les données du projet ajouté

            // Ajoute dynamiquement le nouveau projet dans la galerie et la modale
            setFigure(newProject);

            alert("projet ajouté avec succès.");
            form.reset();  // Réinitialise le formulaire
            document.getElementById('modalAddWork').style.display = 'none';  // Ferme la modale

        } else {
            alert("Erreur lors de l'ajout du projet.");
        }
    } catch (error) {
        alert("Erreur réseau.");
    }
});



//* FONCTION POUR LA PREVIEW DE L'IMAGE POUR 2e MODALE

document.getElementById('file').addEventListener('change', function () {
    const fileInput = document.getElementById('file');
    const previewImage = document.getElementById('previewImage');
    const uploadLabel = document.getElementById('uploadLabel');
    
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader(); 
        reader.onload = function (e) { // Lorsque le fichier est chargé, affiche l'image dans l'élément <img>
            previewImage.src = e.target.result; // Source de l'image
            previewImage.style.display = 'block'; // Affiche l'image
            uploadLabel.classList.add('hidden'); // Masque le bouton de téléchargement
        };
        reader.readAsDataURL(file); // Lit le fichier comme une URL de données
    }
});

