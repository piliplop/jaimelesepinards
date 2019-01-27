# comment contribuer
## front
### HTML
les sources html du projet sont dans _server/views/ejs_. l'extension ".ejs" indique qu'elles utilisent le moteur ejs (en gros vous pouvez insérer de la logique js directement dans le fichier)
* pour insérer une variable : <%= __variable__ %>
* pour interpréter du js : <% _ligne js_ %>
  * par exemple : <% for(i in __list__) { %> _html à repéter pour chaque i_ <% } %>

### CSS
* les fichiers CSS doivent être créés dans _server/css_
* pour inclure un fichier CSS : \<link rel="stylesheet" href="/css/__nom_du_fichier.css__">

### JS
* les fichiers js doivent être créés dans _server/js_front_
* pour inclure un fichier js : \<script src="/js/__nom_du_fichier__.js"></script>