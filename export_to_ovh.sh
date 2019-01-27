#before executing that, make sure the folder 'releasing' is empty
mkdir to_export
cp -r server to_export
cp create3.sql to_export/server/create3.sql
rm -r to_export/server/node_modules
scp -rp to_export/server jul@vps641680.ovh.net:/home/jul/releasing
rm -r to_export