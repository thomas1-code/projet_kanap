# Architecture générale

● Une page d’accueil montrant (de manière dynamique) tous les articles disponibles à
la vente.

● Une page “produit” qui affiche (de manière dynamique) les détails du produit sur
lequel l'utilisateur a cliqué depuis la page d’accueil. Depuis cette page, l’utilisateur
peut sélectionner une quantité, une couleur, et ajouter le produit à son panier.

● Une page “panier”. Celle-ci contient plusieurs parties :
    ○ Un résumé des produits dans le panier, le prix total et la possibilité de
    modifier la quantité d’un produit sélectionné ou bien de supprimer celui-ci.
    ○ Un formulaire permettant de passer une commande. Les données du
    formulaire doivent être correctes et bien formatées avant d'être renvoyées au
    back-end. 

● Une page “confirmation” :
    ○ Un message de confirmation de commande indiquant l'identifiant de commande envoyé par l’API.

# API

Concernant l’API, des promesses devront être utilisées pour éviter les callbacks. Il est
possible d’utiliser des solutions alternatives, comme fetch, celle-ci englobant la promesse.
L’API n’est actuellement que dans sa première version. La requête post qu’il faudra formuler
pour passer une commande ne prend pas encore en considération la quantité ni la couleur
des produits achetés.

# Technologies utilisées

HTML, CSS, JavaScript.

# Validation des données

Pour les routes POST, l’objet contact envoyé au serveur doit contenir les champs firstName,
lastName, address, city et email. Le tableau des produits envoyé au back-end doit être un
array de strings product-ID. Les types de ces champs et leur présence doivent être validés
avant l’envoi des données au serveur.
