# todo when exporting : 
# change listening port from 3000 to 80
# change mail's url

mkdir to_export
cp -r server to_export
rm -r to_export/server/node_modules
sed -i "s/https_server.listen('3000')/https_server.listen('443')/" to_export/server/server.js
sed -i "s/http_server.listen('3000')/http_server.listen('81')/" to_export/server/server.js
sed -i "s/http:\/\/localhost:3000/https:\/\/immulistes.fr/" to_export/server/server.js
sed -i "s/\/\/ADDWHENPUSH//" to_export/server/server.js
sed -i "s/app.listen('3000')/app.listen('80')/" to_export/server/server.js
scp -rp to_export/server jul@vps641680.ovh.net:/home/jul/releasing
rm -r to_export