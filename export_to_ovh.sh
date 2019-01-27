# todo when exporting : 
# change listening port from 3000 to 80
# change mail's url

mkdir to_export
cp -r server to_export
rm -r to_export/server/node_modules
scp -rp to_export/server jul@vps641680.ovh.net:/home/jul/releasing
rm -r to_export