document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments
     const modal = document.getElementById('modal');
     const modalAddWork = document.getElementById('modalAddWork');
 
     // Fonction pour ouvrir la modale
     const openModal = function (targetModal) {
         targetModal.style.display = 'flex'; // Affiche la modale en flex
         
         //Mise à jour des attributs aria (soit caché ou visible)
         targetModal.setAttribute('aria-hidden', 'false');
         targetModal.setAttribute('aria-modal', 'true');
     };
 
 
     // Fonction pour fermer la modale
     const closeModal = function (targetModal) {
         targetModal.style.display = 'none'; // Cache la modale
         targetModal.setAttribute('aria-hidden', 'true'); // Mise à jour des attributs aria
         targetModal.removeAttribute('aria-modal'); // Supprime l'attribut aria-modal
     };
 
     // Ouvrir la première modale
     document.querySelectorAll('.js-modal').forEach(button => {  // Sélectionne tous les boutons avec la classe js-modal
         button.addEventListener('click', function (e) { // Ecouteur d'événements sur chaque bouton
             e.preventDefault(); // Empêche le comportement par défaut du bouton
             openModal(modal);   // Ouvre la première modale
         });
     });
 
    
     // Bouton de fermeture pour la première modale
     const closeModalButton = document.getElementById('close-modal'); // Bouton de fermeture
     if (closeModalButton) { // Si le bouton de fermeture existe
         closeModalButton.addEventListener('click', () => closeModal(modal)); // Ecouteur d'événements pour fermer la modale
     }
 
     
     // Fermer la première modale en cliquant en dehors
     if (modal) { 
         modal.addEventListener('click', (e) => {
             if (e.target === modal) {  // Vérifie que le clic est en dehors de la modale pour la fermer
                 closeModal(modal);
             }
         });
     }
 
     // Ouvrir la deuxième modale depuis la première avec le bouton "Ajouter une photo"
     document.querySelector('.add-photo-button').addEventListener('click', function () {
         closeModal(modal); 
         openModal(modalAddWork);
     });
 
     // Bouton de fermeture pour la deuxième modale
     const closeModalAddWorkButton = document.getElementById('close-modal-add-work');
     if (closeModalAddWorkButton) {
         closeModalAddWorkButton.addEventListener('click', () => closeModal(modalAddWork));
     }
 
     // Fermer la deuxième modale en cliquant en dehors
     if (modalAddWork) {
         modalAddWork.addEventListener('click', (e) => {
             if (e.target === modalAddWork) {
                 closeModal(modalAddWork);
             }
         });
     }
 
     // Bouton pour revenir de la deuxième modale à la première
     document.querySelector('.back-modal').addEventListener('click', function () {
         closeModal(modalAddWork);
         openModal(modal);
     });
 });
 


 // Fonction pour charger les catégories depuis l'API
 async function loadCategories() {
     const urlCategories = 'http://localhost:5678/api/categories';  // Assurez-vous que cette URL est correcte
     const select = document.getElementById('categoryInput');
     select.innerHTML = ''; 
 
     try {
         const response = await fetch(urlCategories);
         if (response.ok) {
             const categories = await response.json();


             categories.forEach(category => {
                 const option = document.createElement('option');
                 option.value = category.id;  // Utilisez l'ID de la catégorie pour la valeur
                 option.textContent = category.name;  
                 select.appendChild(option);
             });
         } else {
             console.error("Erreur lors du chargement des catégories :", response.statusText);

         }
     } catch (error) {
         console.error("Erreur réseau :", error);

     }
 }

 loadCategories(); 




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
            alert("projet ajouté avec succès.");
            form.reset();  // Réinitialiser le formulaire
            document.getElementById('modalAddWork').style.display = 'none';  // Fermer la modale
            location.reload();  // Recharger la page pour mettre à jour la galerie
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

