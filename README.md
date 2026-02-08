## Multiplayer Bingo game

Full stack muliplayer bingo game

## Overview

Users can log into their accounts, join or create games in lobby.
Host can start / end game, and this along with winners will be broadcasted
to every player in current game using websockets. Games also have a game chat, that
works by implementing MQTT and using websockets as bridge to the frontend side of the
application. The lobby also has live stats, also using MQTT and websocket. Each player 
has a new unique card for each game, and after drawing numbers, the game ends once one player
completes a row/column/diagonal. 

## FEATURES
- SQLite database with tables for games, users, winners and cards
- RESTful APIs for games, users, winners, cards and chats
- Cookies for user session
- Websocket with socket.io to broadcast for example game winners, drawn numbers, game ending
- MQTT(local broker with mosquitto) with websocket as a bridge. Used for in game chats and live game stats in lobby (every 5 seconds refreshed)
- Frontend built using React and JavaScript
- Bingo game logic

## TECH
- Backend with Express.js
- MQTT with local mosquitto broker
- RESTful APIS
- Websocket with socket.io
- React
- JavaScript
- CSS
