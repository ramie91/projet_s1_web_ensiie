# Rapport de projet - CheckMate

## 1. Technologies utilisées (et justification)
- **Go 1.24 + Gin + Gorm/SQLite** : pile légère, un binaire + un fichier DB unique (`data.db`), maintien facile du nombre de fichiers côté serveur (routes/main/models). Sessions par cookie HttpOnly.  
- **Templates HTML + Tailwind CSS compilé** : CSS déjà générée dans `static/css`, pas besoin de pipeline lourd pour l’évaluateur.  
- **JavaScript vanilla** : bascule langue (fr/en) et thème jour/nuit (avec tailwind) sans rechargement, appels fetch JSON pour la liste/suppression/creation de dépenses.  
- **Dépassement autorisé** : la compilation Tailwind produit quelques fichiers CSS/JS supplémentaires dans `static/`. Le cœur serveur reste <10 fichiers non binaires ; côté client les templates+JS principaux restent compacts.

## 2. Manuel d’utilisation (navigation rapide)
- Lancer le serveur : `go mod download && go run .` puis ouvrir `http://localhost:8080`.  
- Comptes : `demo@example.com` / `demo` (utilisateur), `admin@example.com` / `admin` (admin).  
- Pages :
  - `/` : accueil + stats synthétiques (Pour l'admin, c'est le cumul de toutes les dépenses enregistrés).
  - `/login` et `/register` : auth.
  - `/expenses` : liste personnelle (ou globale pour admin) avec suppression.
  - `/expenses/create` : ajout d’une dépense (admin peut choisir l’utilisateur).
  - `/admin` : tableau de bord admin (stats globales, utilisateurs, dernières dépenses).
- Boutons persistants (toutes pages) :  
  - **Langue** : globe (fr/en, stockage localStorage).  
  - **Thème** : lune/soleil (clair/sombre, stockage localStorage).  
- Requêtes BD :  
  - Lecture (SELECT) via `/get_expenses_by_category` (liste avec jointure User).  
  - Écriture (INSERT) via `/expense/create_expense`, suppression (DELETE) via `/expenses/delete/:id`.

## 3. Détails techniques
- **Préférences sans rechargement** : `static/js/preferences.js` lit localStorage dès le `<head>`, ajuste `document.documentElement` (lang + classe `dark`) avant le rendu ; les boutons mettent à jour les attributs `data-i18n` et le DOM en direct.  
- **Seed et comptes par défaut** : `models.go` appelle `initDatabase` qui auto-migre, crée un utilisateur démo et un admin si absents, et injecte deux dépenses de départ.  
- **Gestion des rôles** : middleware `requireAuth` et `requireAdmin` dans `routes.go`; les requêtes JSON filtrent par utilisateur sauf admin (`/get_expenses_by_category`).  
- **Formulaires et API JSON** : routes acceptent à la fois `application/json` et POST formulaire ; la vue est rechargée ou renvoie JSON selon `Accept`/`Content-Type`.  
- **Structure minimale** : serveur limité à `main.go`, `routes.go`, `models.go`. Côté client : templates dans `templates/`, JS dans `static/js/`, CSS précompilée dans `static/css/`.
- **Modèles et base** : 2 tables Gorm/SQLite simples. `User` (ID, Name, Email unique, PasswordHash, IsAdmin, relation `Expenses`) et `Expense` (ID, Title, Amount, Currency, DateAchat, Category, UserID + relation `User`). Mots de passe hashés (bcrypt), contraintes `OnUpdate:CASCADE, OnDelete:RESTRICT` pour éviter les effacements involontaires. `initDatabase` auto-migre, crée un compte démo + admin si absents, recolle les dépenses orphelines et injecte deux dépenses de seed si nécessaire.

## 4. Sécurité et limites
- Hash bcrypt des mots de passe ; sessions HttpOnly.  
- CSRF non implémenté (à ajouter si déploiement).  
- Validation basique (types/requis) ; pas de vérification email.  
- Pas de pagination/filtrage avancé ; taille d’archive à vérifier après ajout des captures.

## 5. Pistes d’amélioration
- CSRF + rate limiting + logging structuré.
- Pagination/recherche sur `/expenses`; filtres par période/catégorie.
- Exports CSV/JSON, budgets par catégorie, notifications.
- Tests d’intégration Gin/SQLite et e2e navigateur.

## 6. Captures d’écran (à insérer)
- Accueil en fr/en, thème clair/sombre.
- Formulaire de dépense.
- Liste des dépenses.
- Tableau de bord admin.
