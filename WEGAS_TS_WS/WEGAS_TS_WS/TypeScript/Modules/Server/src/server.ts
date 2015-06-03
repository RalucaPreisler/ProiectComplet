/**
 * Created by costin on 03.06.2015.
 */

/// <reference path='../declarations/node.d.ts' />
/// <reference path='../declarations/ws.d.ts' />
'use strict';

import WebSocket = require('ws');

var port: number = process.env.PORT || 5008;
var WebSocketServer = WebSocket.Server;
var server = new WebSocketServer({ port: port });

var setupDict1 =
{
    userCentralSettings :
    {
        userID : 'user1',
        gathererColor : "#0000FF",
        soldierColor : "#FF0000"
    },


    resourcePositions :
        [
            {
                idEnt : "res1",
                line : 5,
                column : 6,
            },
            {
                idEnt : "res2",
                line : 10,
                column : 11,
            },
            {
                idEnt : "res3",
                line : 6,
                column : 15
            }

        ]
};


var setupDict2 =
{
    userCentralSettings :
    {
        userID : 'user2',
        gathererColor : "#6600FF",
        soldierColor : "#FF3300"
    },

    resourcePositions :
        [
            {
                idEnt : "res1",
                line : 5,
                column : 6,
            },
            {
                idEnt : "res2",
                line : 10,
                column : 11,
            },
            {
                idEnt : "res3",
                line : 6,
                column : 15
            }

        ]
};


var setupDicts = [setupDict1, setupDict2];
var countClients = -1;

var countRAFS = 0;

server.on('connection', ws => {

    countClients++;

    if(countClients > 1)
    {
        return;
    }

    server.clients[countClients].send(JSON.stringify(setupDicts[countClients]));




    ws.on('message', message => {
        try {

            if(message === "RAF")
            {
                countRAFS++;

                if(countRAFS == 2)
                {
                    broadcast("FRAME");
                    countRAFS = 0;
                    return;
                }

                return;
            }

            broadcast(message);
        } catch (e) {
            console.error(e.message);
        }
    });


    if(countClients == 1)
    {
        broadcast("FRAME");

    }

});

function broadcast(data: string): void {
    server.clients.forEach(client => {
        client.send(data);
    });
};

console.log('Server is running on port', port);