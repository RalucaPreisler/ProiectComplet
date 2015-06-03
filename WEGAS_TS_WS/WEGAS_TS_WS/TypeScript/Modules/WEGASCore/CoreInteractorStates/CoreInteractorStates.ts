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

module CoreInteractorStates
{

    export interface CoreInteractorStateInterface
    {
        attackBtnClicked() : void;
        moveBtnClicked() : void;
        gatherBtnClicked() : void;
        createSoldierBtnClicked() : void;
        createGathererBtnClicked() : void;

        mouseCanvasClicked(x : number, y : number) : void;
        activate() : void;
    }


    export class BaseInteractorState implements CoreInteractorStateInterface
    {
        protected userSettings : CentralUserSettings;
        protected renderManager : CoreClasses.ICentralRenderingManager;
        protected mapManager : CoreClasses.ICentralMapManager;
        protected requestSender : CoreClasses.ICentralRequestSender;

        protected entityManager : CoreClasses.ICentralEntityManager;

        protected entityID : string = null;
        protected interactor : CoreUserInteractor;

        constructor(renderArg : CoreClasses.ICentralRenderingManager,
                    mapArg: CoreClasses.ICentralMapManager,
                    entityManArg : CoreClasses.ICentralEntityManager,
                    sender : CoreClasses.ICentralRequestSender,
                    interactorArg : CoreUserInteractor,
                    settings : CentralUserSettings
        )
        {
            this.userSettings = settings;
            this.entityManager = entityManArg;
            this.interactor = interactorArg;
            this.renderManager = renderArg;
            this.mapManager = mapArg;
            this.requestSender = sender;
        }


        protected setMaster()
        {
            var master = new MasterInteractorState(this.renderManager,this.mapManager,
                this.entityManager,this.requestSender,this.interactor, this.userSettings);

            master.activate();
            this.interactor.setCurrentState(master);
        }

        attackBtnClicked()
        {
          this.setMaster();
        }

        moveBtnClicked()
        {
            this.setMaster();
        }

        gatherBtnClicked()
        {
            this.setMaster();
        }

        mouseCanvasClicked(x : number, y : number)
        {
            this.setMaster();
        }

        createSoldierBtnClicked()
        {
            this.setMaster();
        }

        createGathererBtnClicked()
        {
            this.setMaster();
        }

        activate()
        {
            //this.interactor.createSoldierBtn.style.visibility = "hidden";
            //this.interactor.createGathererBtn.style.visibility = "hidden";
            this.interactor.moveBtn.style.visibility = "hidden";
            this.interactor.attackBtn.style.visibility = "hidden";
            this.interactor.gatherBtn.style.visibility = "hidden";
        }

        public setEntityID(id : string)
        {
            this.entityID = id;
        }
    }

    export class MasterInteractorState extends BaseInteractorState
    {

        attackBtnClicked()
        {

            if(this.entityID == null)
            {
                return;
            }

            var newState : AttackInteractorState;
            newState = new AttackInteractorState(this.renderManager,
                this.mapManager,this.entityManager, this.requestSender, this.interactor, this.userSettings);


            newState.setEntityID(this.entityID);
            newState.activate();
            this.interactor.setCurrentState(newState);
        }

        moveBtnClicked()
        {
            if(this.entityID == null)
            {
                return;
            }

            var moveState : MoveInteractorState;
            moveState = new MoveInteractorState(this.renderManager,
                this.mapManager, this.entityManager,this.requestSender ,this.interactor, this.userSettings);

            moveState.setEntityID(this.entityID);
            moveState.activate();
            this.interactor.setCurrentState(moveState);
        }

        gatherBtnClicked()
        {
            if(this.entityID == null)
            {
                return null;
            }

            var gatherState : GatherInteractorState;
            gatherState = new GatherInteractorState(this.renderManager,
                this.mapManager,  this.entityManager,this.requestSender, this.interactor, this.userSettings);

            gatherState.setEntityID(this.entityID);
            gatherState.activate();

            this.interactor.setCurrentState(gatherState);
        }


        createSoldierBtnClicked()
        {
            console.log('create soldier clicked');
            var createState : CreateSoldierInteractorState;
            createState = new CoreInteractorStates.CreateSoldierInteractorState(this.renderManager,
                this.mapManager,this.entityManager,this.requestSender,this.interactor, this.userSettings);

            this.interactor.setCurrentState(createState);
            createState.activate();
        }

        createGathererBtnClicked()
        {
            console.log('create gatherer clicked');
            var createState : CreateGathererInteractorState;
            createState = new CoreInteractorStates.CreateGathererInteractorState(this.renderManager,
                this.mapManager,this.entityManager,this.requestSender,this.interactor, this.userSettings);

            this.interactor.setCurrentState(createState);
            createState.activate();
        }

        mouseCanvasClicked(x : number, y : number)
        {
            var cell  = this.renderManager.getCellFromRawXY(x,y);
            this.entityID = this.mapManager.getEntityIdFromCell(cell);
            if(this.entityID == null)
            {
                return;
            }

            if(!this.userSettings.isOwnEntity(this.entityID))
            {
                return;
            }

            var entity : CoreClasses.WegasEntity;
            entity = this.entityManager.getEntityForId(this.entityID);

            if(entity.respondsToCommand(CoreConstants.kMoveCommandName))
            {
                console.log('should view move');
                this.interactor.moveBtn.style.visibility = "visible";
            }

            if(entity.respondsToCommand(CoreConstants.kAttackCommandName))
            {
                console.log('should view attack');
                this.interactor.attackBtn.style.visibility = "visible";

            }

            if(entity.respondsToCommand(CoreConstants.kGatherCommandName))
            {
                console.log('should view gather');
                this.interactor.gatherBtn.style.visibility = "visible";
            }

        }


    }


    export class MoveInteractorState extends BaseInteractorState
    {

       public mouseCanvasClicked(x : number, y :number)
        {

            var cell : Utilities.CellPoint = this.renderManager.getCellFromRawXY(x,y);
            var anotherEntiyID : string;
            anotherEntiyID = this.mapManager.getEntityIdFromCell(cell);

            if(anotherEntiyID != null)
            {
                super.mouseCanvasClicked(null, null);
                return;
            }


            var moveCommand : DTOs.Command;
            moveCommand = CoreCommandFactory.createMoveCommandTo(cell.getLine(), cell.getColumn());

            var request : DTOs.Request;
            request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity,
            this.entityID,moveCommand);

            this.requestSender.sendRequest(request);

            super.mouseCanvasClicked(null, null);
        }

    }

    export class GatherInteractorState extends BaseInteractorState
    {

        public mouseCanvasClicked(x : number, y :number)
        {

            var cell : Utilities.CellPoint = this.renderManager.getCellFromRawXY(x,y);
            var anotherEntiyID : string;
            anotherEntiyID = this.mapManager.getEntityIdFromCell(cell);

            if(anotherEntiyID == null)
            {
                super.mouseCanvasClicked(null, null);
                return;
            }

            var entity : CoreClasses.WegasEntity;
            entity = this.entityManager.getEntityForId(anotherEntiyID);
            if(!entity.respondsToCommand(CoreConstants.kGetGatheredCommandName))
            {
                super.mouseCanvasClicked(null ,null);
                return;
            }

            var moveCommand : DTOs.Command;
            moveCommand = CoreCommandFactory.createGatherCommand(anotherEntiyID);

            var request : DTOs.Request;
            request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity,
                this.entityID,moveCommand);

            this.requestSender.sendRequest(request);

            super.mouseCanvasClicked(null, null);
        }

    }

    export class AttackInteractorState extends BaseInteractorState
    {

        public mouseCanvasClicked(x : number, y :number)
        {

            var cell : Utilities.CellPoint = this.renderManager.getCellFromRawXY(x,y);
            var anotherEntiyID : string;
            anotherEntiyID = this.mapManager.getEntityIdFromCell(cell);

            if(anotherEntiyID == null)
            {
                super.mouseCanvasClicked(null, null);
                return;
            }

            var entity : CoreClasses.WegasEntity;
            entity = this.entityManager.getEntityForId(anotherEntiyID);
            if(!entity.respondsToCommand(CoreConstants.kGetAttackedCommandName))
            {
                super.mouseCanvasClicked(null ,null);
                return;
            }

            var moveCommand : DTOs.Command;
            moveCommand = CoreCommandFactory.createAttackCommand(anotherEntiyID);

            var request : DTOs.Request;
            request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity,
                this.entityID,moveCommand);

            this.requestSender.sendRequest(request);

            super.mouseCanvasClicked(null, null);
        }

    }


    export class CreateSoldierInteractorState extends BaseInteractorState
    {

        public mouseCanvasClicked(x : number, y :number)
        {

            var cell : Utilities.CellPoint = this.renderManager.getCellFromRawXY(x,y);

            var entityID = this.mapManager.getEntityIdFromCell(cell);

            if(entityID != null)
            {
                super.mouseCanvasClicked(x,y);
                console.log('already existent at click zzz');
                return;
            }

            var cell : Utilities.CellPoint = this.renderManager.getCellFromRawXY(x,y);
            var createSoldierCommand : DTOs.Command;
            var createCommand : DTOs.Command;

            var color : string = this.userSettings.getSoldierColor();
            var id : string = this.userSettings.getNewEntityId();

            createCommand = CoreCommandFactory.createCreateEntityCommand(id,CoreConstants.kSoldierEntityType,
            cell.getLine(),cell.getColumn(),color);

            createSoldierCommand = new DTOs.Command(CoreConstants.kBuyAndCreateCommand, createCommand.getParameters());
            var rq : DTOs.Request;

            rq = new DTOs.Request(CoreConstants.kRequestTargetTypeUserManager,null,createSoldierCommand);

            this.requestSender.sendRequest(rq);
            super.mouseCanvasClicked(x,y);
        }


    }

    export class CreateGathererInteractorState extends BaseInteractorState
    {
        public mouseCanvasClicked(x : number, y :number)
        {

            console.log('mouse canvas on create soldier');
            var cell : Utilities.CellPoint = this.renderManager.getCellFromRawXY(x,y);

            var entityID = this.mapManager.getEntityIdFromCell(cell);

            if(entityID != null)
            {
                super.mouseCanvasClicked(x,y);
                console.log('already existent at click zzz');
                return;
            }

            var cell : Utilities.CellPoint = this.renderManager.getCellFromRawXY(x,y);
            var createSoldierCommand : DTOs.Command;
            var createCommand : DTOs.Command;

            var color : string = this.userSettings.getGathererColor();
            var id : string = this.userSettings.getNewEntityId();

            createCommand = CoreCommandFactory.createCreateEntityCommand(id,CoreConstants.kGatheringEntityType,
                cell.getLine(),cell.getColumn(),color);

            createSoldierCommand = new DTOs.Command(CoreConstants.kBuyAndCreateCommand, createCommand.getParameters());
            var rq : DTOs.Request;

            rq = new DTOs.Request(CoreConstants.kRequestTargetTypeUserManager,null,createSoldierCommand);

            this.requestSender.sendRequest(rq);
            super.mouseCanvasClicked(x,y);
        }
    }


}