# CheckMate

Application web de gestion et de partage de dépenses, construite en Go (Gin) avec Gorm/SQLite, une interface HTML/CSS et du JavaScript pour les préférences (langue, thème, interactions).

## Fonctionnalités
- Authentification avec sessions (inscription/connexion/déconnexion).
- Gestion des dépenses avec catégories, dates, montant, devise et propriétaire.
- Tableau de bord admin pour visualiser utilisateurs et dernières dépenses.
- Bascule de langue (fr/en) et mode jour/nuit persistés côté client.
- API JSON simple : lecture/écriture/suppression des dépenses, récupération de l’utilisateur courant.
- Données et utilisateurs de démonstration préremplis en base.

## Prérequis
- Go 1.24+.
- SQLite inclus via le driver Gorm (fichier `data.db` créé/peuplé au démarrage).
- Node/npm uniquement si vous souhaitez régénérer les CSS Tailwind (déjà compilées dans `static/css`).

## Installation
```bash
cd projet_s1_web_ensiie
go mod download
```
Si vous devez régénérer les styles Tailwind (pas forcément nécessaire):
```bash
npm install
```

## Lancer le serveur
```bash
go run .
```
L’application écoute sur `http://localhost:8080`.

## Comptes de démonstration
- Utilisateur : `demo@example.com` / `demo`
- Admin : `admin@example.com` / `admin`

## Structure rapide
- `main.go`, `routes.go`, `models.go` : serveur Gin, routes, modèles Gorm.
- `templates/` : vues HTML.
- `static/js/` : interactions (langue, thème, dépenses, formulaire).
- `static/css/` : CSS générées (Tailwind).
- `data.db` : base SQLite (auto-générée si absente).

## Notes
- Préférences langue/thème stockées en localStorage.
- Les routes JSON principales : `/get_expenses_by_category`, `/expense/create_expense`, `/expenses/delete/:id`, `/get_user`.
