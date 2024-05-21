# Cahier des charges pour l'application web en 3D

## Objectif
Développer une application web en 3D utilisant Babylon.js pour WebGL, codée en TypeScript, comportant six scènes interactives destinées à accomplir des tâches variées.

## Description de l'application
L'application contiendra une scène d'accueil et cinq scènes interactives distinctes, chaque scène proposant une tâche unique à réaliser.

### Scène d'accueil (Home)
- Objectif : Accueillir l'utilisateur et présenter les options des différentes scènes.
- Fonctionnalités : 
  - Menu de navigation pour accéder aux différentes scènes.
  - Présentation visuelle attrayante.
  
### Scène 1 : Deviner un chiffre
- Objectif : L'utilisateur doit deviner un chiffre aléatoire pour révéler un message.
- Fonctionnalités :
  - Interaction pour saisir et valider le chiffre.
  - Affichage d’un message de succès lorsque le chiffre est correct.
  - Élément 3D interactif : Boîte mystère qui s'ouvre pour révéler le message.

### Scène 2 : Compteur de nombres premiers
- Objectif : Utiliser deux boutons pour naviguer entre les nombres premiers.
- Fonctionnalités :
  - Boutons "+" et "-" pour incrémenter ou décrémenter le compteur.
  - Affichage du nombre premier courant.
  - Élément 3D interactif : Représentation graphique qui évolue avec le nombre premier.

### Scène 3 : Interrupteurs d'escalier
- Objectif : Simuler le fonctionnement de deux interrupteurs contrôlant une lumière.
- Fonctionnalités :
  - Deux interrupteurs qui changent de position à chaque interaction.
  - La lumière s’allume si les interrupteurs sont sur la même position.
  - Élément 3D interactif : Modélisation des interrupteurs et de la lumière.

### Scène 4 : Pile de briques
- Objectif : Générer et ordonner une pile de briques de tailles aléatoires.
- Fonctionnalités :
  - Bouton pour générer la pile de briques.
  - Bouton pour ordonner les briques par taille.
  - Élément 3D interactif : Animation de la construction et de l'ordonnancement de la pile.

### Scène 5 : Matrice de points lumineux
- Objectif : Afficher un message introduit par l'utilisateur dans une matrice de points lumineux.
- Fonctionnalités :
  - Champ de saisie pour le message.
  - Options pour animer les lettres (clignotement, défilement).
  - Élément 3D interactif : Animation des points lumineux formant les lettres.

## Architecture logicielle
- L'application sera développée en utilisant Babylon.js pour les rendus 3D et TypeScript pour la structure du code.
- Modularisation : Chaque scène sera encapsulée dans son propre fichier TypeScript (.ts) pour faciliter la maintenance et le développement futur.

## Exigences techniques
- Compatibilité avec les principaux navigateurs supportant WebGL.
- Interface responsive s'adaptant aux différents dispositifs (ordinateur, tablette, smartphone).
- Performances optimisées pour une expérience utilisateur fluide.

## Livrables
- Code source complet de l'application.
- Documentation technique incluant l'architecture du code, les librairies utilisées et les instructions de déploiement.
- Manuel utilisateur décrivant l'utilisation de chaque scène.