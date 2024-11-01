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
 
 //MODAL