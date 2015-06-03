/// <reference path="../../Extern/AStarTS/ts/astar.ts" />
/// <reference path="../WEGASCore/CoreImplementations/CoreImplementations.ts" />
/// <reference path="../Utilities/Utilities.ts" />
/// <reference path="../WEGASCore/CoreComponents/CoreComponents.ts" />
/// <reference path="../WEGASCore/CoreConstants/CoreConstants.ts" />
/// <reference path="../WEGASCore/CoreComponentPresenters/CoreComponentPresenters.ts" />
/// <reference path= "../WEGASCore/CoreEntities/CoreEntities.ts" />
/// <reference path="../WEGASCore/CoreCommandFactory/CoreCommandFactory.ts" />
/// <reference path="../WEGASCore/CoreUserInteractor/CoreUserInteractor.ts" />
/// <reference path="../WEGASCore/CoreInteractorStates/CoreInteractorStates.ts" />
/// <reference path="../WEGASCore/CoreUserManager/CoreUserManager.ts" />
/// <reference path="../WEGASCore/CentralUserSettings/CentralUserSettings.ts" />
/// <reference path="../Client/SocketHandler.ts" />
var SimpleGame = (function () {
    function SimpleGame() {
        this.create();
    }
    SimpleGame.prototype.preload = function () {
    };
    SimpleGame.prototype.create = function () {
        var canvas = document.getElementById('myCanvas');
        this.mapManager = new CoreImplementations.CoreMapManager(CoreConstants.kNumOfLines, CoreConstants.kNumOfColumns);
        this.renderManager = new CoreImplementations.CoreRenderingManager(CoreConstants.kNumOfLines, CoreConstants.kNumOfColumns, canvas);
        this.senderManager = new CoreImplementations.CoreRequestSender();
        this.entityManager = new CoreImplementations.CoreEntityManager(this.mapManager, this.renderManager, this.senderManager);
        this.userSettings = new CentralUserSettings();
        this.userManager = new CoreUserManager(this.senderManager, this.mapManager);
        this.receiverManger = new CoreImplementations.CoreRequestReceiver(this.entityManager, this.userManager, this.userSettings, this);
        this.senderManager.setRequestReceiverLocal(this.receiverManger);
        this.interactor = new CoreUserInteractor(canvas);
        var masterState;
        masterState = new CoreInteractorStates.MasterInteractorState(this.renderManager, this.mapManager, this.entityManager, this.senderManager, this.interactor, this.userSettings);
        this.interactor.setCurrentState(masterState);
        masterState.activate();
    };
    SimpleGame.prototype.update = function () {
        var time;
        time = performance.now();
        this.entityManager.update(time);
        this.mapManager.update(time);
        this.renderManager.renderMap();
    };
    SimpleGame.prototype.render = function () {
    };
    return SimpleGame;
})();
window.onload = function () {
    var socket;
    socket = new SocketHandler();
    var game = new SimpleGame();
    socket.setReceiveHandler(function (arg) {
        game.receiverManger.processStringRequest(arg);
    });
    socket.connect();
    game.senderManager.setRequestReceiver(socket);
    game.receiverManger.setSender(socket);
    var ONE_FRAME_TIME = 1000;
    var mainloop = function () {
        //game.update();
    };
    //setInterval( mainloop, ONE_FRAME_TIME );
};
//# sourceMappingURL=TestUtilities.js.map