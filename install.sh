OLDPWD=$PWD
cp ./eth-wifi-switch.sh /usr/local/bin/eth-wifi-switch.sh
chmod +x /usr/local/bin/eth-wifi-switch.sh
cp ./eth-wifi-switch.service /etc/systemd/system/eth-wifi-switch.service
systemctl enable eth-wifi-switch.service
mkdir /usr/local/bin/mediamtx
cd /usr/local/bin/mediamtx
wget https://github.com/bluenviron/mediamtx/releases/download/v1.14.0/mediamtx_v1.14.0_linux_arm64.tar.gz
tar xzf mediamtx_v1.14.0_linux_arm64.tar.gz
cd $OLDPWD
cp ./mediamtx.service /etc/systemd/system/mediamtx.service
cp ./mediamtx.yml /usr/local/bin/mediamtx/
