/**
 * Created by costin on 03.06.2015.
 */

/// <reference path="../Server/declarations/node.d.ts" />
/// <reference path="../Server/declarations/ws.d.ts" />

class SocketHandler
{
    private socket : WebSocket;

    private receiveHandler : (data : string) => void;



    public connect()
    {
        this.socket = new WebSocket('ws://localhost:5008');
        var socketHandler = this;
        this.socket.onmessage = (data : MessageEvent) =>
        {
            socketHandler.receiveHandler(data.data);
        };
    }

    public sendMessage(message : string)
    {
        this.socket.send(message);
    }

    public setReceiveHandler(handler : (data : string)=>void)
    {
        this.receiveHandler = handler;

    }


}