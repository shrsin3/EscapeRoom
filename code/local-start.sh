#!/bin/bash

# Change to the directory where the script is located
cd "$(dirname "$0")"

# Configure the oracle instant client env variable
export DYLD_LIBRARY_PATH="/Users/manushreesinghania/Downloads/instantclient-basiclite-macos.x64-19.8.0.0.0dbru (1).zip":$DYLD_LIBRARY_PATH

# Start Node application
exec node server.js
