# Projet Mini Application Symfony Full-Stack

Ce projet vise à créer une mini application utilisant le framework Symfony. L'objectif est d'importer des données Excel dans une base de données (MySQL) pour moi, de les afficher dans un tableau utilisant DataTables, et de fournir des fonctionnalités d'édition et de suppression des données.

## Fonctionnalités

1. **Importation de données**: L'utilisateur peut importer un fichier externe contenant des données à partir d'un écran fourni.

2. **Affichage des données**: Les données importées sont affichées dans un tableau avec DataTables. Le tableau affiche par défaut seulement 10 lignes, avec possibilité de pagination.

3. **Tri et Filtrage**: Les utilisateurs peuvent trier les colonnes du tableau et appliquer des filtres sur les données en fonction des critères pertinents.

4. **Ajout de données**: Les utilisateurs ont la possibilité d'ajouter de nouvelles lignes dans le tableau.

5. **Édition et Suppression**: Les utilisateurs peuvent éditer ou supprimer une ligne existante dans le tableau.

## Technologies Utilisées

- **Symfony Framework**: Un framework PHP pour le développement web.
- ** MySQL**: Système de gestion de base de données relationnelle.
- **DataTables**: Un plugin jQuery pour la gestion des tableaux interactifs.
- **HTML, CSS, JavaScript**: Les langages de base pour le développement web.

## Installation

1. **Clonage du Dépôt**: Clonez ce dépôt sur votre machine locale en utilisant la commande suivante :

```bash
git clone https://github.com/votre_utilisateur/nom_du_depot.git
```

2. **Installation des Dépendances**: Installez les dépendances en exécutant la commande suivante à la racine du projet :

```bash
composer install
```

3. **Configuration de la Base de Données**: Configurez votre base de données dans le fichier `.env` en modifiant les paramètres appropriés.

4. **Création de la Base de Données et des Migrations**: Créez la base de données et exécutez les migrations en utilisant les commandes suivantes :

```bash
symfony console doctrine:database:create
symfony console doctrine:migrations:migrate 
```

5. **Lancement du Serveur Symfony**: Lancez le serveur Symfony en utilisant la commande suivante :

```bash
symfony server:start
```

6. **Accès à l'Application**: Accédez à l'application dans votre navigateur à l'adresse suivante : [http://localhost:8000](http://localhost:8000)

## Utilisation

1. **Importation des Données**: Importez des données à partir de l'écran d'importation fourni.

2. **Exploration des Données**: Explorez les données dans le tableau affiché avec DataTables. Triez et filtrez les données .

3. **Ajout de Données**: Ajoutez de nouvelles lignes en utilisant l'option ajouter.

4. **Édition et Suppression**: Éditez ou supprimez les lignes existantes .

## Contributeurs

- Tojonirina Hasiniaina Elie

N'hésitez pas à contribuer en ouvrant des pull requests ou en signalant des problèmes dans la section des issues.

