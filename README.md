# Configuration

## Création des workers

* modifier le fichier "ips" pour y lister les adresses des workers
* split des clefs de connexions avec "script/splitkeys"
* installer pm2 sur chaque worker avec la commande "scripts/install"
* mise à jour des fichiers sur chaque worker en ligne avec "script/update"


## création du loadbalancer

* copier le fichier nginx.conf.dist en nginx.conf
* recopier les IP dans le fichier nginx.conf "upstream backend"
* copier la configuration dans le fichier /etc/nginx/nginx.conf
* autoriser le loadbalancer a effectuer des requêtes HTTP: `setsebool -P httpd_can_network_connect 1`

