/**
 * Created by costin on 03.06.2015.
 */
/// <reference path="../Server/declarations/node.d.ts" />
/// <reference path="../Server/declarations/ws.d.ts" />
var SocketHandler = (function () {
    function SocketHandler() {
    }
    SocketHandler.prototype.connect = function () {
        this.socket = new WebSocket('ws://localhost:5008');
        var socketHandler = this;
        this.socket.onmessage = function (data) {
            socketHandler.receiveHandler(data.data);
        };
    };
    SocketHandler.prototype.sendMessage = function (message) {
        this.socket.send(message);
    };
    SocketHandler.prototype.setReceiveHandler = function (handler) {
        this.receiveHandler = handler;
    };
    return SocketHandler;
})();
//# sourceMappingURL=SocketHandler.js.map