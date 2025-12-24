// Classe ContactBook - Approche objet
class ContactBook {
    constructor() {
        this.contacts = this.loadFromLocalStorage();
        this.render();
    }

    /**
     * Charge les contacts depuis le LocalStorage
     * @returns {Array} Tableau des contacts
     */
    loadFromLocalStorage() {
        const stored = localStorage.getItem('contactBook');
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * Sauvegarde les contacts dans le LocalStorage
     */
    saveToLocalStorage() {
        localStorage.setItem('contactBook', JSON.stringify(this.contacts));
    }

    /**
     * Ajoute un nouveau contact
     * @param {Object} contact - Objet contact avec nom, prenom, email, telephone
     */
    addContact(contact) {
        contact.id = Date.now();
        contact.createdAt = new Date().toISOString();
        this.contacts.push(contact);
        this.saveToLocalStorage();
        this.render();
    }

   
    /**
     * Affiche tous les contacts dans le tableau
     */
    render() {
        const tbody = document.querySelector('#contactTable tbody');
        tbody.innerHTML = '';

        if (this.contacts.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="3" style="text-align: center; color: #95a5a6; font-style: italic;">
                    Aucun contact enregistré. Cliquez sur + pour ajouter un contact.
                </td>
            `;
            tbody.appendChild(row);
            return;
        }

        this.contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Nom">${this.escapeHtml(contact.nom)}</td>
                <td data-label="Prénom">${this.escapeHtml(contact.prenom)}</td>
                <td data-label="Email">${this.escapeHtml(contact.email)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * Échappe les caractères HTML pour éviter les injections XSS
     * @param {String} text - Texte à échapper
     * @returns {String} Texte échappé
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    
    /**
     * Exporte les contacts au format JSON
     */
    exportToJSON() {
        const dataStr = JSON.stringify(this.contacts, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `contacts_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Importe des contacts depuis un fichier JSON
     * @param {File} file - Fichier JSON à importer
     */
    importFromJSON(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                
                // Validation basique
                if (!Array.isArray(imported)) {
                    throw new Error('Le fichier doit contenir un tableau de contacts');
                }

                // Validation de chaque contact
                imported.forEach((contact, index) => {
                    if (!contact.nom || !contact.prenom || !contact.email) {
                        throw new Error(`Contact ${index + 1} invalide: champs manquants`);
                    }
                });

                this.contacts = imported;
                this.saveToLocalStorage();
                this.render();
                showMessage('Contacts importés avec succès!', 'success');
            } catch (error) {
                showMessage(`Erreur lors de l'import: ${error.message}`, 'error');
            }
        };
        reader.readAsText(file);
    }

  
}

// Instance globale
const contactBook = new ContactBook();

/**
 * Ouvre la modale d'ajout de contact
 */
function openModal() {
    document.getElementById('contactModal').classList.add('active');
    // Focus sur le premier champ
    setTimeout(() => {
        document.getElementById('nom').focus();
    }, 100);
}

/**
 * Ferme la modale et réinitialise le formulaire
 */
function closeModal() {
    document.getElementById('contactModal').classList.remove('active');
    document.getElementById('contactForm').reset();
    validateForm();
}

/**
 * Valide le formulaire en temps réel
 * Active/désactive le bouton de validation selon l'état des champs
 */
function validateForm() {
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const email = document.getElementById('email').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const btnValidate = document.getElementById('btnValidate');

    // Tous les champs doivent être remplis
    const allFilled = nom && prenom && email && telephone;
    
    // Validation de l'email
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    btnValidate.disabled = !(allFilled && emailValid);
}

/**
 * Gère la soumission du formulaire
 * @param {Event} event - Événement de soumission
 */
function handleSubmit(event) {
    event.preventDefault();
    
    const formData = {
        nom: document.getElementById('nom').value.trim(),
        prenom: document.getElementById('prenom').value.trim(),
        email: document.getElementById('email').value.trim(),
        telephone: document.getElementById('telephone').value.trim()
    };

    // Validation finale
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
        showMessage('Tous les champs sont obligatoires', 'error');
        return;
    }

    contactBook.addContact(formData);
    closeModal();
    
    showMessage('Contact ajouté avec succès!', 'success');
}

/**
 * Exporte les contacts au format JSON
 */
function exportContacts() {
    if (contactBook.getCount() === 0) {
        showMessage('Aucun contact à exporter', 'error');
        return;
    }
    contactBook.exportToJSON();
    showMessage('Fichier JSON exporté!', 'success');
}

/**
 * Importe des contacts depuis un fichier JSON
 */
function importContacts() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            contactBook.importFromJSON(file);
        }
    };
    input.click();
}

/**
 * Affiche un message de notification
 * @param {String} text - Texte du message
 * @param {String} type - Type de message (success ou error)
 */
function showMessage(text, type) {
    const message = document.createElement('aside');
    message.className = `status-message ${type}`;
    message.textContent = text;
    document.querySelector('main').insertBefore(message, document.querySelector('header'));
    
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Fermeture au clic en dehors de la modale
    document.getElementById('contactModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Écouter les changements sur tous les champs du formulaire
    ['nom', 'prenom', 'email', 'telephone'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.addEventListener('input', validateForm);
        field.addEventListener('blur', validateForm);
    });

    // Fermeture de la modale avec la touche Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('contactModal');
            if (modal.classList.contains('active')) {
                closeModal();
            }
        }
    });

    // Validation initiale du formulaire
    validateForm();

    console.log('📒 Contact Book initialisé');
    console.log(`📊 ${contactBook.getCount()} contact(s) chargé(s)`);
});
