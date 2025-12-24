# 📒 Contact Book

Application web de gestion de contacts avec sauvegarde locale.

---

## 📖 Description

Application simple pour gérer vos contacts avec une interface responsive. Les données sont sauvegardées automatiquement dans votre navigateur.

**Caractéristiques :**
- ✅ Pas de framework (HTML/CSS/JS pur)
- ✅ Design responsive (mobile/desktop)
- ✅ Sauvegarde automatique (LocalStorage)
- ✅ Export/Import JSON
- ✅ Validation en temps réel

---

## 🚀 Installation

1. Téléchargez les 3 fichiers :
   - `index.html`
   - `style.css`
   - `script.js`

2. Double-cliquez sur `index.html`

3. C'est prêt ! 🎉

---

## 📂 Structure

```
contact-book/
├── index.html    # Structure de la page
├── style.css     # Styles (Grid & Flexbox)
└── script.js     # Logique JavaScript
```

---

## 🎯 Fonctionnalités

### Ajouter un contact
- Cliquez sur le bouton **+**
- Remplissez les 4 champs (tous obligatoires)
- Le bouton "Valider" est grisé tant que tous les champs ne sont pas remplis
- Cliquez sur "Valider"

### Exporter les contacts
- Cliquez sur **"📥 Exporter JSON"** dans le footer
- Un fichier `contacts_2025-12-24.json` sera téléchargé

### Importer des contacts
- Cliquez sur **"📤 Importer JSON"** dans le footer
- Sélectionnez un fichier JSON
- Les contacts seront chargés automatiquement

---

## 💻 Code principal

### Classe ContactBook

La logique est centralisée dans une classe JavaScript :

```javascript
class ContactBook {
    constructor()              // Initialise l'app
    addContact(contact)        // Ajoute un contact
    deleteContact(id)          // Supprime un contact
    render()                   // Affiche le tableau
    exportToJSON()            // Export fichier
    importFromJSON(file)      // Import fichier
}
```

### Fonctions importantes

**Validation du formulaire**
```javascript
function validateForm() {
    // Vérifie que tous les champs sont remplis
    // Active/désactive le bouton "Valider"
}
```

**Sauvegarde automatique**
```javascript
saveToLocalStorage() {
    localStorage.setItem('contactBook', JSON.stringify(this.contacts));
}
```

**Protection XSS**
```javascript
escapeHtml(text) {
    // Protège contre les injections de code
}
```

---

## 🎨 CSS Layout

### Grid pour la structure
```css
main {
    display: grid;
    grid-template-rows: auto auto 1fr auto;
}
```

### Flexbox pour l'alignement
```css
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

---

## 📱 Responsive

| Écran | Affichage |
|-------|-----------|
| **Desktop** (>768px) | Tableau 3 colonnes |
| **Mobile** (<480px) | Cards verticales |

---


## 💾 Stockage

Les contacts sont sauvegardés dans le **LocalStorage** du navigateur :

```json
[
    {
        "id": 1735045392847,
        "nom": "Aubert",
        "prenom": "Jean-Luc",
        "email": "jean-luc.aubert@aelion.fr",
        "telephone": "0123456789"
    }
]
```

**Clé :** `contactBook`  
**Limite :** ~5-10 MB

---

## 🔒 Sécurité

- ✅ Validation email avec regex
- ✅ Protection XSS avec `escapeHtml()`
- ✅ Validation des imports JSON
- ✅ Pas de `innerHTML` avec données utilisateur

---

## 🚀 Améliorations possibles

1. Ajouter une recherche
2. Permettre la modification
3. Ajouter un bouton supprimer
4. Trier les contacts
5. Pagination
6. Export CSV
7. Thème sombre

---

## 👨‍💻 Auteur

**Michel** - Développeur SAP ABAP & Web

---

**Version :** 1.0.0  
**Date :** 24 décembre 2025

