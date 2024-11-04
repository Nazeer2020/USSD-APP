#!/bin/bash

# Define variables
APP_NAME="node"  # Replace with your app's entry point
NODE_PATH="../app.js"     # Path to Node.js (adjust if needed)
PID_FILE="app.pid"            # File to store the PID

start() {
    if [ -f "$PID_FILE" ]; then
        echo "Application is already running (PID $(cat $PID_FILE))."
        exit 1
    fi
    echo "Starting $APP_NAME..."
    $NODE_PATH $APP_NAME & echo $! > $PID_FILE
    echo "$APP_NAME started with PID $(cat $PID_FILE)."
}

stop() {
    if [ ! -f "$PID_FILE" ]; then
        echo "Application is not running."
        exit 1
    fi
    echo "Stopping $APP_NAME..."
    kill $(cat $PID_FILE)
    rm $PID_FILE
    echo "$APP_NAME stopped."
}

restart() {
    stop
    start
}

# Check the command argument
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
        ;;
esac