
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


class SimpleGame {

    userSettings : CentralUserSettings;
    mapManager : CoreImplementations.CoreMapManager;
    renderManager : CoreImplementations.CoreRenderingManager;
    entityManager : CoreImplementations.CoreEntityManager;
    public receiverManger : CoreImplementations.CoreRequestReceiver;
    public senderManager : CoreImplementations.CoreRequestSender;
    interactor : CoreUserInteractor;
    userManager : CoreUserManager;

    constructor() {
        this.create();


    }
    preload()
    {

    }

    create()
    {


        var canvas = <HTMLCanvasElement>document.getElementById('myCanvas');

        this.mapManager = new CoreImplementations.CoreMapManager(CoreConstants.kNumOfLines,CoreConstants.kNumOfColumns);
        this.renderManager = new CoreImplementations.CoreRenderingManager(CoreConstants.kNumOfLines,
            CoreConstants.kNumOfColumns,canvas);


        this.senderManager = new CoreImplementations.CoreRequestSender();
        this.entityManager = new CoreImplementations.CoreEntityManager(this.mapManager,this.renderManager,
        this.senderManager);



        this.userSettings = new CentralUserSettings();

        this.userManager = new CoreUserManager(this.senderManager, this.mapManager);

        this.receiverManger = new CoreImplementations.CoreRequestReceiver(this.entityManager,
            this.userManager, this.userSettings, this);


        this.senderManager.setRequestReceiverLocal(this.receiverManger);
        this.interactor = new CoreUserInteractor(canvas);

        var masterState : CoreInteractorStates.MasterInteractorState;
        masterState = new CoreInteractorStates.MasterInteractorState(this.renderManager,
        this.mapManager,this.entityManager,this.senderManager,this.interactor, this.userSettings);

        this.interactor.setCurrentState(masterState);
        masterState.activate();


    }

    update()
    {
        var time : number;
        time = performance.now();
        this.entityManager.update(time);
        this.mapManager.update(time);
        this.renderManager.renderMap();
    }

    render()
    {

    }
}


window.onload = () => {

    var socket : SocketHandler;
    socket = new SocketHandler();

    var game = new SimpleGame();

    socket.setReceiveHandler((arg:string)=>
    {
        game.receiverManger.processStringRequest(arg);
    });

    socket.connect();
    game.senderManager.setRequestReceiver(socket);
    game.receiverManger.setSender(socket);


    var ONE_FRAME_TIME = 1000 ;
    var mainloop = function()
    {
        //game.update();
    };
   //setInterval( mainloop, ONE_FRAME_TIME );

};
