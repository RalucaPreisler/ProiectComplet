/**
 * Created by costin on 01.06.2015.
 */

/// <reference path="../../Utilities/Utilities.ts" />
/// <reference path="../CoreClasses/CoreClasses.ts" />
/// <reference path="../CoreConstants/CoreConstants.ts" />
/// <reference path="../CoreImplementations/CoreImplementations.ts" />

module CoreComponents
{

    export class IdleComponent extends CoreClasses.WegasComponent
    {

        public update(time : number)
        {
            this.getComponentPresenter().update(time);
        }

        public respondsToCommand(command : string) : boolean
        {
            return command === CoreConstants.kBecomeIdleCommandName;
        }

        public executeCommand(command : DTOs.Command)
        {

        }
    }

    export class MoveComponent extends CoreClasses.WegasComponent
    {
        private command : DTOs.Command;

        private targetFollowEntityID : string;
        private isInFollowState : boolean = false;
        private timeThresholdSpeed = 100;
        private targetPoint : Utilities.CellPoint;
        private delta : number = 0;

        private lastTimeCall : number;
        private mapManager: CoreClasses.ICentralMapManager;

        constructor(entityID : string, args : Utilities.Dictionary,
                    presenter : CoreClasses.WegasComponentPresenter,
                    commandSender : CoreClasses.ICentralRequestSender,
                    mapManagerArg : CoreClasses.ICentralMapManager)
        {
            super(entityID, args, presenter, commandSender);
            this.lastTimeCall = 0;
            this.mapManager = mapManagerArg;
        }

        public  setTimeSpeed(speed : number)
        {
            if(speed > 0)
            {
                this.timeThresholdSpeed = speed;
            }
        }

        public respondsToCommand(command : string) : boolean
        {
            return command === CoreConstants.kMoveCommandName ||
                command === CoreConstants.kFollowCommandName;
        }


        public executeCommand(command : DTOs.Command)
        {
            this.lastTimeCall = 0;
            this.command = command;

              if (!this.respondsToCommand(command.getName())) {
                  alert('To move component, just sent an invalid command! ' + command.toJson());
              }

            var numX : number;
            var numY : number;
            numX = command.getParameters().objectForKey(CoreConstants.kPositionXParameterKey);
            numY = command.getParameters().objectForKey(CoreConstants.kPositionYParameterKey);


            this.isActive = true;

            if(command.getName() === CoreConstants.kFollowCommandName)
            {
                this.isInFollowState = true;
                if(command.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey) == null)
                {
                    alert('Null entity id for follow command!');
                }
                this.targetFollowEntityID = <string>command.getParameters().objectForKey(
                    CoreConstants.kCommandEntityIdKey);


                return;
            }

            this.isInFollowState = false;

            if((numX == null || numY == null) && this.isInFollowState == false)
            {
                alert('Invalid x or y parameters in move command ' + command.toJson());
            }


            this.targetPoint = new Utilities.CellPoint(numX, numY);
        }


        public getIsActive() : boolean
        {
            return this.isActive;
        }

        public update(currentTime : number)
        {

            if(this.lastTimeCall == 0 )
            {
                this.delta =100; //arbitrarily chosen
            }
            else
            {
                this.delta += currentTime - this.lastTimeCall;
            }

            this.lastTimeCall = currentTime;

            if(this.delta >= this.timeThresholdSpeed)
            {
                this.delta = 0;
                var pathArray : Utilities.CellPoint[];
                var numX = <number>this.getAttributesDict().objectForKey(CoreConstants.kPositionXParameterKey);
                var numY = <number>this.getAttributesDict().objectForKey(CoreConstants.kPositionYParameterKey);

                if(numX == null || numY == null)
                {
                    alert('Invalid x or y in attribute set of move component!');
                }

                var myPoint : Utilities.CellPoint;
                myPoint = new Utilities.CellPoint(numX, numY);

                if(this.isInFollowState == true)
                {
                    pathArray = this.mapManager.getPathBetweenEntities(this.getEntityID(),
                                                                        this.targetFollowEntityID);

                }
                else
                    pathArray = this.mapManager.getPathBetweenCellPoints(myPoint,this.targetPoint);

                if(pathArray.length > 0) {
                    var newPos:Utilities.CellPoint;
                    newPos = pathArray[0];


                    //console.log('must send command to update new position to ' + newPos.getLine() + " and " +
                      //  newPos.getColumn() + " for entity " + this.getEntityID());

                    this.mapManager.setEntityAtCellPoint(this.getEntityID(), newPos);
                    //DEBUG
                    this.getAttributesDict().setObjectForKey(newPos.getLine(), CoreConstants.kPositionXParameterKey);
                    this.getAttributesDict().setObjectForKey(newPos.getColumn(), CoreConstants.kPositionYParameterKey);


                    if(this.isInFollowState == false)
                    {
                        if(this.targetPoint.getLine() == newPos.getLine() &&
                            this.targetPoint.getColumn() == newPos.getColumn())
                        {
                            this.isActive = false;
                            // MUST RESET TO NEXT COMMAND
                            super.checkAndCallNextCommandFromExecutedCommand(this.command);

                        }
                    }
                    else
                    {

                        var point = this.mapManager.getCellPointOfEntity(this.targetFollowEntityID);
                        if(Utilities.CellPoint.areCellsClose(myPoint, point))
                        {
                            this.isActive = false;
                            // MUST RESET TO NEXT COMMAND
                            super.checkAndCallNextCommandFromExecutedCommand(this.command);

                        }
                    }
                }

            }

            this.getComponentPresenter().update(currentTime);
        }


    }


    export class AttackedComponent extends CoreClasses.WegasComponent
    {
        private command : DTOs.Command;

        public respondsToCommand(command : string) : boolean
        {
            return command === CoreConstants.kGetAttackedCommandName;
        }

        public executeCommand(command : DTOs.Command)
        {
            this.command = command;
        }



        public update(time : number)
        {

            var currentHealth : number;
            currentHealth = this.getAttributesDict().objectForKey(CoreConstants.kHealthParameterKey);

            var damage : number;
            damage = this.command.getParameters().objectForKey(CoreConstants.kDamageParameterKey);

            if(damage == null || currentHealth == null)
            {
                alert('missing health or damage in get attacked!');
            }

            currentHealth -= damage;

            if(currentHealth <= 0)
            {
                super.sendDieCommandToSelf();
                var idleCommand = CoreCommandFactory.createIdleCommand();
                var request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity,
                    this.command.getParameters().objectForKey(CoreConstants.kAttackerEntityID),
                    idleCommand);

                this.commandSender.sendRequest(request);
                return;
            }

            //must send request!
            this.getAttributesDict().setObjectForKey(currentHealth, CoreConstants.kHealthParameterKey);
            this.sendPreviousCommandToSelf();
            this.getComponentPresenter().update(time);
        }


    }



    export class AttackComponent extends CoreClasses.WegasComponent
    {


        private delta : number;
        private static kThreshold = 1500;
        private counter : number;
        private mapManager : CoreClasses.ICentralMapManager;

        private attackCommand : DTOs.Command;

        public respondsToCommand(command : string)
        {
            return command === CoreConstants.kAttackCommandName;
        }

        public executeCommand(command : DTOs.Command)
        {
            this.attackCommand = command;
            this.counter = -1;
        }

        public setMapManager(arg : CoreClasses.ICentralMapManager)
        {
            this.mapManager = arg;
        }

        public update(time : number)
        {
            if(this.amICloseEnough() == false)
            {
                this.sendFollowCommandToSelf();
                return;
            }

            if(this.counter == -1)
            {
                this.delta = 0;
            }
            else
            {
                this.delta += time - this.counter;

            }

            this.counter = time;

            if(this.delta > AttackComponent.kThreshold)
            {


                var damage : number;
                damage = this.attributesDict.objectForKey(CoreConstants.kDamageParameterKey);
                var entityID : string;
                entityID = this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey);

                if(damage == null || entityID == null)
                {
                    alert('null damage  or entity id to attack component');
                }


                var  hisPoint = this.mapManager.getCellPointOfEntity(
                    this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey));

                this.attributesDict.setObjectForKey(hisPoint, CoreConstants.kAttackedEntityPosition);

                var  request : DTOs.Request;
                var command = CoreCommandFactory.createGetAttackedCommand(damage, this.getEntityID());

                request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, entityID, command);
                this.commandSender.sendRequest(request);

                this.getComponentPresenter().changeAppearance(time);

                this.delta = 0;

            }

            this.getComponentPresenter().update(time);

        }

        private sendFollowCommandToSelf()
        {
            var targetID : string;
            targetID = this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey);

            var followCommand = CoreCommandFactory.createFollowCommandTo(targetID);

            this.attackCommand = CoreCommandFactory.addNextCommandToCommand(this.attackCommand,followCommand);

            var request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity,
            this.entityID,followCommand);

            this.commandSender.sendRequest(request);

        }


        private amICloseEnough() :boolean
        {
            var myX : number;
            var myY : number;
            var hisX : number;
            var hixY : number;

            myX = this.attributesDict.objectForKey(CoreConstants.kPositionXParameterKey);
            myY = this.attributesDict.objectForKey(CoreConstants.kPositionYParameterKey);

            var myPoint = new Utilities.CellPoint(myX, myY);
            var hisPoint = this.mapManager.getCellPointOfEntity(this.attackCommand.getParameters().objectForKey(
                CoreConstants.kCommandEntityIdKey
            ));

            if (hisPoint == null)
            {
                alert('null his point !');
            }

            return Utilities.CellPoint.areCellsClose(myPoint, hisPoint);

        }

    }


    export class DieComponent extends CoreClasses.WegasComponent
    {



        public respondsToCommand(command : string)
        {
            return command === CoreConstants.kDieCommandName;
        }

        public executeCommand(command : DTOs.Command)
        {
            //nothing to do
        }

        public update(time : number)
        {

            this.componentPresenter.update(time);


            var args : Utilities.Dictionary;
            args = new Utilities.Dictionary();
            args.setObjectForKey(this.getEntityID(), CoreConstants.kCommandEntityIdKey);

            var request : DTOs.Request;

            var removecommand : DTOs.Command;
            removecommand = new DTOs.Command(CoreConstants.kRemoveEntityCommandName, args);

            request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntityManager,
            null, removecommand);

            this.commandSender.sendRequest(request);
        }

    }


    export  class GatheredComponent extends CoreClasses.WegasComponent
    {

        private gatheredCommand : DTOs.Command;

        public respondsToCommand(command : string) : boolean
        {
            return command === CoreConstants.kGetGatheredCommandName;
        }

        public executeCommand(command : DTOs.Command)
        {
            this.gatheredCommand= command;
        }

        public update(time : number)
        {

            var myAmount : number = this.getAttributesDict().objectForKey(CoreConstants.kResourceAmountKey);
            var depletionAmount : number = this.gatheredCommand.getParameters().objectForKey(
                CoreConstants.kDepletionAmountKey
            );

            myAmount -= depletionAmount;


            if(myAmount <= 0)
            {
                super.sendDieCommandToSelf();
                var idleCommand = CoreCommandFactory.createIdleCommand();
                var request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity,
                    this.gatheredCommand.getParameters().objectForKey(CoreConstants.kGatheringEntityIdKey),
                    idleCommand);

                this.commandSender.sendRequest(request);
                return;
            }

            //must send request!
            this.getAttributesDict().setObjectForKey(myAmount, CoreConstants.kResourceAmountKey);
            this.getComponentPresenter().update(time);

            super.checkAndCallNextCommandFromExecutedCommand(this.gatheredCommand);

        }

    }


    export class GatherComponent extends CoreClasses.WegasComponent
    {

        private delta : number;
        private static kThreshold = 2000;
        private counter : number;
        private mapManager : CoreClasses.ICentralMapManager;

        private attackCommand : DTOs.Command;

        public respondsToCommand(command : string)
        {
            return command === CoreConstants.kGatherCommandName;
        }

        public executeCommand(command : DTOs.Command)
        {
            this.attackCommand = command;
            this.counter = -1;
        }

        public setMapManager(arg : CoreClasses.ICentralMapManager)
        {
            this.mapManager = arg;
        }

        public update(time : number)
        {
            if(this.amICloseEnough() == false)
            {
                this.sendFollowCommandToSelf();
                return;
            }

            if(this.counter == -1)
            {
                this.delta = 0;
            }
            else
            {
                this.delta += time - this.counter;

            }

            this.counter = time;

            if(this.delta > GatherComponent.kThreshold)
            {


                var damage : number;
                damage = this.attributesDict.objectForKey(CoreConstants.kDepletionAmountKey);
                var entityID : string;
                entityID = this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey);

                if(damage == null || entityID == null)
                {
                    alert('null depletion  or entity id to attack component');
                }


                var  hisPoint = this.mapManager.getCellPointOfEntity(
                    this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey));

                this.attributesDict.setObjectForKey(hisPoint, CoreConstants.kGatheredEntityPosition);

                var  request : DTOs.Request;
                var command = CoreCommandFactory.createGetGatheredCommand(damage, this.getEntityID());

                request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, entityID, command);
                this.commandSender.sendRequest(request);


                var reqToAdd : DTOs.Request;
                var addArgs : Utilities.Dictionary;
                addArgs = new Utilities.Dictionary();
                addArgs.setObjectForKey(damage,CoreConstants.kResourceAmountKey);
                var commandAdd : DTOs.Command;
                commandAdd = new DTOs.Command(CoreConstants.kAddAmountToResources,addArgs);

                reqToAdd = new DTOs.Request(CoreConstants.kRequestTargetTypeUserManager,null,commandAdd);

                this.commandSender.sendRequest(reqToAdd);
                this.getComponentPresenter().changeAppearance(time);

                this.delta = 0;

            }

            this.getComponentPresenter().update(time);

        }

        private sendFollowCommandToSelf()
        {
            var targetID : string;
            targetID = this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey);

            var followCommand = CoreCommandFactory.createFollowCommandTo(targetID);

            this.attackCommand = CoreCommandFactory.addNextCommandToCommand(this.attackCommand,followCommand);

            var request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity,
                this.entityID,followCommand);

            this.commandSender.sendRequest(request);

        }


        private amICloseEnough() :boolean
        {
            var myX : number;
            var myY : number;
            var hisX : number;
            var hixY : number;

            myX = this.attributesDict.objectForKey(CoreConstants.kPositionXParameterKey);
            myY = this.attributesDict.objectForKey(CoreConstants.kPositionYParameterKey);

            var myPoint = new Utilities.CellPoint(myX, myY);
            var hisPoint = this.mapManager.getCellPointOfEntity(this.attackCommand.getParameters().objectForKey(
                CoreConstants.kCommandEntityIdKey
            ));

            if (hisPoint == null)
            {
                alert('null his point !');
            }

            return Utilities.CellPoint.areCellsClose(myPoint, hisPoint);

        }

    }


}