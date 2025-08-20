cp ./eth-wifi-switch.sh /usr/local/bin/eth-wifi-switch.sh
chmod +x /usr/local/bin/eth-wifi-switch.sh
cp ./eth-wifi-switch.service /etc/systemd/system/eth-wifi-switch.service
systemctl enable eth-wifi-switch.service
