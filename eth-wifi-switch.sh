#!/bin/bash
# Disable WiFi if Ethernet (eth0) is up, else leave WiFi enabled

ETH_IF="eth0"
WIFI_IF="wlan0"

# Wait a bit for network interfaces to settle
sleep 10

if ip link show "$ETH_IF" up &>/dev/null; then
    echo "Ethernet detected, disabling WiFi..."
    nmcli radio wifi off || ifconfig "$WIFI_IF" down || true
else
    echo "Ethernet not found, powering off"
    poweroff
fi
