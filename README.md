# Objectif Code

Application web installable (PWA) pour suivre un plan de révision du code de la route sur 8 semaines : passer de 25/40 à 36/40 et plus, avec environ une heure de travail par jour.

## Ce qu'elle contient

- **Aujourd'hui** : la séance du jour avec chaque tâche détaillée, la progression globale, les jours d'affilée et l'indicateur « Prêt pour l'examen » (10 séries de suite à 36/40 ou plus).
- **Plan** : les 59 jours répartis en 4 phases (diagnostic, règles par thème, séries mélangées, conditions d'examen). Chaque jour peut être ouvert et coché.
- **Scores** : courbe des séries complètes avec les seuils 35 et 36, moyenne glissante, réussite par thème, historique.
- **Carnet** : carnet d'erreurs par thème avec révision façon flashcards (une fiche est maîtrisée après 3 bonnes réponses de suite). Le thème le plus faible est repéré automatiquement et injecté dans les tâches ciblées du plan.
- **Fiches** : chiffres clés, méthode, pièges fréquents, jour de l'examen et cours résumé de chaque thème.

Tout fonctionne hors connexion. Les données restent sur l'appareil (localStorage) ; la sauvegarde se fait depuis **Réglages → Exporter / Importer**.

## Mise en ligne sur GitHub Pages

1. Crée un dépôt sur GitHub (par exemple `objectif-code`).
2. Envoie le contenu de ce dossier à la racine du dépôt :
   ```bash
   git init
   git add .
   git commit -m "Objectif Code"
   git branch -M main
   git remote add origin https://github.com/<ton-compte>/objectif-code.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Build and deployment**, source **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
4. Après une minute, le site est disponible à l'adresse `https://<ton-compte>.github.io/objectif-code/`.

Les chemins sont tous relatifs, donc le site marche aussi bien dans un sous-dossier qu'à la racine d'un domaine.

## Installer l'application sur le téléphone

- **iPhone (Safari)** : bouton Partager, puis « Sur l'écran d'accueil ».
- **Android (Chrome)** : menu ⋮, puis « Installer l'application ».

## Modifier le plan

Tout le contenu (thèmes, leçons, tâches de chaque jour, fiches) est dans `js/plan.js`. Après une modification, change la valeur de `VERSION` dans `sw.js` (par exemple `objectif-code-v2`) pour que les appareils déjà installés récupèrent la nouvelle version.

## Fichiers

```
index.html             page unique
css/style.css          styles (thème clair et sombre)
js/plan.js             contenu du plan
js/app.js              logique de l'application
sw.js                  service worker (hors connexion)
manifest.webmanifest   manifeste PWA
icons/                 icônes de l'application
```
