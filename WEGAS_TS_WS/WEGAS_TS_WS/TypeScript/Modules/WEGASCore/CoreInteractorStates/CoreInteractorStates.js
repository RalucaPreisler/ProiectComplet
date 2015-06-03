/**
 * Created by costin on 03.06.2015.
 */
/// <reference path="../CoreImplementations/CoreImplementations.ts" />
/// <reference path="../../Utilities/Utilities.ts" />
/// <reference path="../CoreComponents/CoreComponents.ts" />
/// <reference path="../CoreConstants/CoreConstants.ts" />
/// <reference path="../CoreComponentPresenters/CoreComponentPresenters.ts" />
/// <reference path= "../CoreEntities/CoreEntities.ts" />
/// <reference path="../CoreCommandFactory/CoreCommandFactory.ts" />
/// <reference path="../CoreUserInteractor/CoreUserInteractor.ts" />
/// <reference path="../CentralUserSettings/CentralUserSettings.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CoreInteractorStates;
(function (CoreInteractorStates) {
    var BaseInteractorState = (function () {
        function BaseInteractorState(renderArg, mapArg, entityManArg, sender, interactorArg, settings) {
            this.entityID = null;
            this.userSettings = settings;
            this.entityManager = entityManArg;
            this.interactor = interactorArg;
            this.renderManager = renderArg;
            this.mapManager = mapArg;
            this.requestSender = sender;
        }
        BaseInteractorState.prototype.setMaster = function () {
            var master = new MasterInteractorState(this.renderManager, this.mapManager, this.entityManager, this.requestSender, this.interactor, this.userSettings);
            master.activate();
            this.interactor.setCurrentState(master);
        };
        BaseInteractorState.prototype.attackBtnClicked = function () {
            this.setMaster();
        };
        BaseInteractorState.prototype.moveBtnClicked = function () {
            this.setMaster();
        };
        BaseInteractorState.prototype.gatherBtnClicked = function () {
            this.setMaster();
        };
        BaseInteractorState.prototype.mouseCanvasClicked = function (x, y) {
            this.setMaster();
        };
        BaseInteractorState.prototype.createSoldierBtnClicked = function () {
            this.setMaster();
        };
        BaseInteractorState.prototype.createGathererBtnClicked = function () {
            this.setMaster();
        };
        BaseInteractorState.prototype.activate = function () {
            //this.interactor.createSoldierBtn.style.visibility = "hidden";
            //this.interactor.createGathererBtn.style.visibility = "hidden";
            this.interactor.moveBtn.style.visibility = "hidden";
            this.interactor.attackBtn.style.visibility = "hidden";
            this.interactor.gatherBtn.style.visibility = "hidden";
        };
        BaseInteractorState.prototype.setEntityID = function (id) {
            this.entityID = id;
        };
        return BaseInteractorState;
    })();
    CoreInteractorStates.BaseInteractorState = BaseInteractorState;
    var MasterInteractorState = (function (_super) {
        __extends(MasterInteractorState, _super);
        function MasterInteractorState() {
            _super.apply(this, arguments);
        }
        MasterInteractorState.prototype.attackBtnClicked = function () {
            if (this.entityID == null) {
                return;
            }
            var newState;
            newState = new AttackInteractorState(this.renderManager, this.mapManager, this.entityManager, this.requestSender, this.interactor, this.userSettings);
            newState.setEntityID(this.entityID);
            newState.activate();
            this.interactor.setCurrentState(newState);
        };
        MasterInteractorState.prototype.moveBtnClicked = function () {
            if (this.entityID == null) {
                return;
            }
            var moveState;
            moveState = new MoveInteractorState(this.renderManager, this.mapManager, this.entityManager, this.requestSender, this.interactor, this.userSettings);
            moveState.setEntityID(this.entityID);
            moveState.activate();
            this.interactor.setCurrentState(moveState);
        };
        MasterInteractorState.prototype.gatherBtnClicked = function () {
            if (this.entityID == null) {
                return null;
            }
            var gatherState;
            gatherState = new GatherInteractorState(this.renderManager, this.mapManager, this.entityManager, this.requestSender, this.interactor, this.userSettings);
            gatherState.setEntityID(this.entityID);
            gatherState.activate();
            this.interactor.setCurrentState(gatherState);
        };
        MasterInteractorState.prototype.createSoldierBtnClicked = function () {
            console.log('create soldier clicked');
            var createState;
            createState = new CoreInteractorStates.CreateSoldierInteractorState(this.renderManager, this.mapManager, this.entityManager, this.requestSender, this.interactor, this.userSettings);
            this.interactor.setCurrentState(createState);
            createState.activate();
        };
        MasterInteractorState.prototype.createGathererBtnClicked = function () {
            console.log('create gatherer clicked');
            var createState;
            createState = new CoreInteractorStates.CreateGathererInteractorState(this.renderManager, this.mapManager, this.entityManager, this.requestSender, this.interactor, this.userSettings);
            this.interactor.setCurrentState(createState);
            createState.activate();
        };
        MasterInteractorState.prototype.mouseCanvasClicked = function (x, y) {
            var cell = this.renderManager.getCellFromRawXY(x, y);
            this.entityID = this.mapManager.getEntityIdFromCell(cell);
            if (this.entityID == null) {
                return;
            }
            if (!this.userSettings.isOwnEntity(this.entityID)) {
                return;
            }
            var entity;
            entity = this.entityManager.getEntityForId(this.entityID);
            if (entity.respondsToCommand(CoreConstants.kMoveCommandName)) {
                console.log('should view move');
                this.interactor.moveBtn.style.visibility = "visible";
            }
            if (entity.respondsToCommand(CoreConstants.kAttackCommandName)) {
                console.log('should view attack');
                this.interactor.attackBtn.style.visibility = "visible";
            }
            if (entity.respondsToCommand(CoreConstants.kGatherCommandName)) {
                console.log('should view gather');
                this.interactor.gatherBtn.style.visibility = "visible";
            }
        };
        return MasterInteractorState;
    })(BaseInteractorState);
    CoreInteractorStates.MasterInteractorState = MasterInteractorState;
    var MoveInteractorState = (function (_super) {
        __extends(MoveInteractorState, _super);
        function MoveInteractorState() {
            _super.apply(this, arguments);
        }
        MoveInteractorState.prototype.mouseCanvasClicked = function (x, y) {
            var cell = this.renderManager.getCellFromRawXY(x, y);
            var anotherEntiyID;
            anotherEntiyID = this.mapManager.getEntityIdFromCell(cell);
            if (anotherEntiyID != null) {
                _super.prototype.mouseCanvasClicked.call(this, null, null);
                return;
            }
            var moveCommand;
            moveCommand = CoreCommandFactory.createMoveCommandTo(cell.getLine(), cell.getColumn());
            var request;
            request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.entityID, moveCommand);
            this.requestSender.sendRequest(request);
            _super.prototype.mouseCanvasClicked.call(this, null, null);
        };
        return MoveInteractorState;
    })(BaseInteractorState);
    CoreInteractorStates.MoveInteractorState = MoveInteractorState;
    var GatherInteractorState = (function (_super) {
        __extends(GatherInteractorState, _super);
        function GatherInteractorState() {
            _super.apply(this, arguments);
        }
        GatherInteractorState.prototype.mouseCanvasClicked = function (x, y) {
            var cell = this.renderManager.getCellFromRawXY(x, y);
            var anotherEntiyID;
            anotherEntiyID = this.mapManager.getEntityIdFromCell(cell);
            if (anotherEntiyID == null) {
                _super.prototype.mouseCanvasClicked.call(this, null, null);
                return;
            }
            var entity;
            entity = this.entityManager.getEntityForId(anotherEntiyID);
            if (!entity.respondsToCommand(CoreConstants.kGetGatheredCommandName)) {
                _super.prototype.mouseCanvasClicked.call(this, null, null);
                return;
            }
            var moveCommand;
            moveCommand = CoreCommandFactory.createGatherCommand(anotherEntiyID);
            var request;
            request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.entityID, moveCommand);
            this.requestSender.sendRequest(request);
            _super.prototype.mouseCanvasClicked.call(this, null, null);
        };
        return GatherInteractorState;
    })(BaseInteractorState);
    CoreInteractorStates.GatherInteractorState = GatherInteractorState;
    var AttackInteractorState = (function (_super) {
        __extends(AttackInteractorState, _super);
        function AttackInteractorState() {
            _super.apply(this, arguments);
        }
        AttackInteractorState.prototype.mouseCanvasClicked = function (x, y) {
            var cell = this.renderManager.getCellFromRawXY(x, y);
            var anotherEntiyID;
            anotherEntiyID = this.mapManager.getEntityIdFromCell(cell);
            if (anotherEntiyID == null) {
                _super.prototype.mouseCanvasClicked.call(this, null, null);
                return;
            }
            var entity;
            entity = this.entityManager.getEntityForId(anotherEntiyID);
            if (!entity.respondsToCommand(CoreConstants.kGetAttackedCommandName)) {
                _super.prototype.mouseCanvasClicked.call(this, null, null);
                return;
            }
            var moveCommand;
            moveCommand = CoreCommandFactory.createAttackCommand(anotherEntiyID);
            var request;
            request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.entityID, moveCommand);
            this.requestSender.sendRequest(request);
            _super.prototype.mouseCanvasClicked.call(this, null, null);
        };
        return AttackInteractorState;
    })(BaseInteractorState);
    CoreInteractorStates.AttackInteractorState = AttackInteractorState;
    var CreateSoldierInteractorState = (function (_super) {
        __extends(CreateSoldierInteractorState, _super);
        function CreateSoldierInteractorState() {
            _super.apply(this, arguments);
        }
        CreateSoldierInteractorState.prototype.mouseCanvasClicked = function (x, y) {
            var cell = this.renderManager.getCellFromRawXY(x, y);
            var entityID = this.mapManager.getEntityIdFromCell(cell);
            if (entityID != null) {
                _super.prototype.mouseCanvasClicked.call(this, x, y);
                console.log('already existent at click zzz');
                return;
            }
            var cell = this.renderManager.getCellFromRawXY(x, y);
            var createSoldierCommand;
            var createCommand;
            var color = this.userSettings.getSoldierColor();
            var id = this.userSettings.getNewEntityId();
            createCommand = CoreCommandFactory.createCreateEntityCommand(id, CoreConstants.kSoldierEntityType, cell.getLine(), cell.getColumn(), color);
            createSoldierCommand = new DTOs.Command(CoreConstants.kBuyAndCreateCommand, createCommand.getParameters());
            var rq;
            rq = new DTOs.Request(CoreConstants.kRequestTargetTypeUserManager, null, createSoldierCommand);
            this.requestSender.sendRequest(rq);
            _super.prototype.mouseCanvasClicked.call(this, x, y);
        };
        return CreateSoldierInteractorState;
    })(BaseInteractorState);
    CoreInteractorStates.CreateSoldierInteractorState = CreateSoldierInteractorState;
    var CreateGathererInteractorState = (function (_super) {
        __extends(CreateGathererInteractorState, _super);
        function CreateGathererInteractorState() {
            _super.apply(this, arguments);
        }
        CreateGathererInteractorState.prototype.mouseCanvasClicked = function (x, y) {
            console.log('mouse canvas on create soldier');
            var cell = this.renderManager.getCellFromRawXY(x, y);
            var entityID = this.mapManager.getEntityIdFromCell(cell);
            if (entityID != null) {
                _super.prototype.mouseCanvasClicked.call(this, x, y);
                console.log('already existent at click zzz');
                return;
            }
            var cell = this.renderManager.getCellFromRawXY(x, y);
            var createSoldierCommand;
            var createCommand;
            var color = this.userSettings.getGathererColor();
            var id = this.userSettings.getNewEntityId();
            createCommand = CoreCommandFactory.createCreateEntityCommand(id, CoreConstants.kGatheringEntityType, cell.getLine(), cell.getColumn(), color);
            createSoldierCommand = new DTOs.Command(CoreConstants.kBuyAndCreateCommand, createCommand.getParameters());
            var rq;
            rq = new DTOs.Request(CoreConstants.kRequestTargetTypeUserManager, null, createSoldierCommand);
            this.requestSender.sendRequest(rq);
            _super.prototype.mouseCanvasClicked.call(this, x, y);
        };
        return CreateGathererInteractorState;
    })(BaseInteractorState);
    CoreInteractorStates.CreateGathererInteractorState = CreateGathererInteractorState;
})(CoreInteractorStates || (CoreInteractorStates = {}));
//# sourceMappingURL=CoreInteractorStates.js.map