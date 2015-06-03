/**
 * Created by costin on 01.06.2015.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../Utilities/Utilities.ts" />
/// <reference path="../CoreClasses/CoreClasses.ts" />
/// <reference path="../CoreConstants/CoreConstants.ts" />
/// <reference path="../CoreImplementations/CoreImplementations.ts" />
var CoreComponents;
(function (CoreComponents) {
    var IdleComponent = (function (_super) {
        __extends(IdleComponent, _super);
        function IdleComponent() {
            _super.apply(this, arguments);
        }
        IdleComponent.prototype.update = function (time) {
            this.getComponentPresenter().update(time);
        };
        IdleComponent.prototype.respondsToCommand = function (command) {
            return command === CoreConstants.kBecomeIdleCommandName;
        };
        IdleComponent.prototype.executeCommand = function (command) {
        };
        return IdleComponent;
    })(CoreClasses.WegasComponent);
    CoreComponents.IdleComponent = IdleComponent;
    var MoveComponent = (function (_super) {
        __extends(MoveComponent, _super);
        function MoveComponent(entityID, args, presenter, commandSender, mapManagerArg) {
            _super.call(this, entityID, args, presenter, commandSender);
            this.isInFollowState = false;
            this.timeThresholdSpeed = 100;
            this.delta = 0;
            this.lastTimeCall = 0;
            this.mapManager = mapManagerArg;
        }
        MoveComponent.prototype.setTimeSpeed = function (speed) {
            if (speed > 0) {
                this.timeThresholdSpeed = speed;
            }
        };
        MoveComponent.prototype.respondsToCommand = function (command) {
            return command === CoreConstants.kMoveCommandName || command === CoreConstants.kFollowCommandName;
        };
        MoveComponent.prototype.executeCommand = function (command) {
            this.lastTimeCall = 0;
            this.command = command;
            if (!this.respondsToCommand(command.getName())) {
                alert('To move component, just sent an invalid command! ' + command.toJson());
            }
            var numX;
            var numY;
            numX = command.getParameters().objectForKey(CoreConstants.kPositionXParameterKey);
            numY = command.getParameters().objectForKey(CoreConstants.kPositionYParameterKey);
            this.isActive = true;
            if (command.getName() === CoreConstants.kFollowCommandName) {
                this.isInFollowState = true;
                if (command.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey) == null) {
                    alert('Null entity id for follow command!');
                }
                this.targetFollowEntityID = command.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey);
                return;
            }
            this.isInFollowState = false;
            if ((numX == null || numY == null) && this.isInFollowState == false) {
                alert('Invalid x or y parameters in move command ' + command.toJson());
            }
            this.targetPoint = new Utilities.CellPoint(numX, numY);
        };
        MoveComponent.prototype.getIsActive = function () {
            return this.isActive;
        };
        MoveComponent.prototype.update = function (currentTime) {
            if (this.lastTimeCall == 0) {
                this.delta = 100; //arbitrarily chosen
            }
            else {
                this.delta += currentTime - this.lastTimeCall;
            }
            this.lastTimeCall = currentTime;
            if (this.delta >= this.timeThresholdSpeed) {
                this.delta = 0;
                var pathArray;
                var numX = this.getAttributesDict().objectForKey(CoreConstants.kPositionXParameterKey);
                var numY = this.getAttributesDict().objectForKey(CoreConstants.kPositionYParameterKey);
                if (numX == null || numY == null) {
                    alert('Invalid x or y in attribute set of move component!');
                }
                var myPoint;
                myPoint = new Utilities.CellPoint(numX, numY);
                if (this.isInFollowState == true) {
                    pathArray = this.mapManager.getPathBetweenEntities(this.getEntityID(), this.targetFollowEntityID);
                }
                else
                    pathArray = this.mapManager.getPathBetweenCellPoints(myPoint, this.targetPoint);
                if (pathArray.length > 0) {
                    var newPos;
                    newPos = pathArray[0];
                    //console.log('must send command to update new position to ' + newPos.getLine() + " and " +
                    //  newPos.getColumn() + " for entity " + this.getEntityID());
                    this.mapManager.setEntityAtCellPoint(this.getEntityID(), newPos);
                    //DEBUG
                    this.getAttributesDict().setObjectForKey(newPos.getLine(), CoreConstants.kPositionXParameterKey);
                    this.getAttributesDict().setObjectForKey(newPos.getColumn(), CoreConstants.kPositionYParameterKey);
                    if (this.isInFollowState == false) {
                        if (this.targetPoint.getLine() == newPos.getLine() && this.targetPoint.getColumn() == newPos.getColumn()) {
                            this.isActive = false;
                            // MUST RESET TO NEXT COMMAND
                            _super.prototype.checkAndCallNextCommandFromExecutedCommand.call(this, this.command);
                        }
                    }
                    else {
                        var point = this.mapManager.getCellPointOfEntity(this.targetFollowEntityID);
                        if (Utilities.CellPoint.areCellsClose(myPoint, point)) {
                            this.isActive = false;
                            // MUST RESET TO NEXT COMMAND
                            _super.prototype.checkAndCallNextCommandFromExecutedCommand.call(this, this.command);
                        }
                    }
                }
            }
            this.getComponentPresenter().update(currentTime);
        };
        return MoveComponent;
    })(CoreClasses.WegasComponent);
    CoreComponents.MoveComponent = MoveComponent;
    var AttackedComponent = (function (_super) {
        __extends(AttackedComponent, _super);
        function AttackedComponent() {
            _super.apply(this, arguments);
        }
        AttackedComponent.prototype.respondsToCommand = function (command) {
            return command === CoreConstants.kGetAttackedCommandName;
        };
        AttackedComponent.prototype.executeCommand = function (command) {
            this.command = command;
        };
        AttackedComponent.prototype.update = function (time) {
            var currentHealth;
            currentHealth = this.getAttributesDict().objectForKey(CoreConstants.kHealthParameterKey);
            var damage;
            damage = this.command.getParameters().objectForKey(CoreConstants.kDamageParameterKey);
            if (damage == null || currentHealth == null) {
                alert('missing health or damage in get attacked!');
            }
            currentHealth -= damage;
            if (currentHealth <= 0) {
                _super.prototype.sendDieCommandToSelf.call(this);
                var idleCommand = CoreCommandFactory.createIdleCommand();
                var request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.command.getParameters().objectForKey(CoreConstants.kAttackerEntityID), idleCommand);
                this.commandSender.sendRequest(request);
                return;
            }
            //must send request!
            this.getAttributesDict().setObjectForKey(currentHealth, CoreConstants.kHealthParameterKey);
            this.sendPreviousCommandToSelf();
            this.getComponentPresenter().update(time);
        };
        return AttackedComponent;
    })(CoreClasses.WegasComponent);
    CoreComponents.AttackedComponent = AttackedComponent;
    var AttackComponent = (function (_super) {
        __extends(AttackComponent, _super);
        function AttackComponent() {
            _super.apply(this, arguments);
        }
        AttackComponent.prototype.respondsToCommand = function (command) {
            return command === CoreConstants.kAttackCommandName;
        };
        AttackComponent.prototype.executeCommand = function (command) {
            this.attackCommand = command;
            this.counter = -1;
        };
        AttackComponent.prototype.setMapManager = function (arg) {
            this.mapManager = arg;
        };
        AttackComponent.prototype.update = function (time) {
            if (this.amICloseEnough() == false) {
                this.sendFollowCommandToSelf();
                return;
            }
            if (this.counter == -1) {
                this.delta = 0;
            }
            else {
                this.delta += time - this.counter;
            }
            this.counter = time;
            if (this.delta > AttackComponent.kThreshold) {
                var damage;
                damage = this.attributesDict.objectForKey(CoreConstants.kDamageParameterKey);
                var entityID;
                entityID = this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey);
                if (damage == null || entityID == null) {
                    alert('null damage  or entity id to attack component');
                }
                var hisPoint = this.mapManager.getCellPointOfEntity(this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey));
                this.attributesDict.setObjectForKey(hisPoint, CoreConstants.kAttackedEntityPosition);
                var request;
                var command = CoreCommandFactory.createGetAttackedCommand(damage, this.getEntityID());
                request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, entityID, command);
                this.commandSender.sendRequest(request);
                this.getComponentPresenter().changeAppearance(time);
                this.delta = 0;
            }
            this.getComponentPresenter().update(time);
        };
        AttackComponent.prototype.sendFollowCommandToSelf = function () {
            var targetID;
            targetID = this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey);
            var followCommand = CoreCommandFactory.createFollowCommandTo(targetID);
            this.attackCommand = CoreCommandFactory.addNextCommandToCommand(this.attackCommand, followCommand);
            var request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.entityID, followCommand);
            this.commandSender.sendRequest(request);
        };
        AttackComponent.prototype.amICloseEnough = function () {
            var myX;
            var myY;
            var hisX;
            var hixY;
            myX = this.attributesDict.objectForKey(CoreConstants.kPositionXParameterKey);
            myY = this.attributesDict.objectForKey(CoreConstants.kPositionYParameterKey);
            var myPoint = new Utilities.CellPoint(myX, myY);
            var hisPoint = this.mapManager.getCellPointOfEntity(this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey));
            if (hisPoint == null) {
                alert('null his point !');
            }
            return Utilities.CellPoint.areCellsClose(myPoint, hisPoint);
        };
        AttackComponent.kThreshold = 1500;
        return AttackComponent;
    })(CoreClasses.WegasComponent);
    CoreComponents.AttackComponent = AttackComponent;
    var DieComponent = (function (_super) {
        __extends(DieComponent, _super);
        function DieComponent() {
            _super.apply(this, arguments);
        }
        DieComponent.prototype.respondsToCommand = function (command) {
            return command === CoreConstants.kDieCommandName;
        };
        DieComponent.prototype.executeCommand = function (command) {
            //nothing to do
        };
        DieComponent.prototype.update = function (time) {
            this.componentPresenter.update(time);
            var args;
            args = new Utilities.Dictionary();
            args.setObjectForKey(this.getEntityID(), CoreConstants.kCommandEntityIdKey);
            var request;
            var removecommand;
            removecommand = new DTOs.Command(CoreConstants.kRemoveEntityCommandName, args);
            request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntityManager, null, removecommand);
            this.commandSender.sendRequest(request);
        };
        return DieComponent;
    })(CoreClasses.WegasComponent);
    CoreComponents.DieComponent = DieComponent;
    var GatheredComponent = (function (_super) {
        __extends(GatheredComponent, _super);
        function GatheredComponent() {
            _super.apply(this, arguments);
        }
        GatheredComponent.prototype.respondsToCommand = function (command) {
            return command === CoreConstants.kGetGatheredCommandName;
        };
        GatheredComponent.prototype.executeCommand = function (command) {
            this.gatheredCommand = command;
        };
        GatheredComponent.prototype.update = function (time) {
            var myAmount = this.getAttributesDict().objectForKey(CoreConstants.kResourceAmountKey);
            var depletionAmount = this.gatheredCommand.getParameters().objectForKey(CoreConstants.kDepletionAmountKey);
            myAmount -= depletionAmount;
            if (myAmount <= 0) {
                _super.prototype.sendDieCommandToSelf.call(this);
                var idleCommand = CoreCommandFactory.createIdleCommand();
                var request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.gatheredCommand.getParameters().objectForKey(CoreConstants.kGatheringEntityIdKey), idleCommand);
                this.commandSender.sendRequest(request);
                return;
            }
            //must send request!
            this.getAttributesDict().setObjectForKey(myAmount, CoreConstants.kResourceAmountKey);
            this.getComponentPresenter().update(time);
            _super.prototype.checkAndCallNextCommandFromExecutedCommand.call(this, this.gatheredCommand);
        };
        return GatheredComponent;
    })(CoreClasses.WegasComponent);
    CoreComponents.GatheredComponent = GatheredComponent;
    var GatherComponent = (function (_super) {
        __extends(GatherComponent, _super);
        function GatherComponent() {
            _super.apply(this, arguments);
        }
        GatherComponent.prototype.respondsToCommand = function (command) {
            return command === CoreConstants.kGatherCommandName;
        };
        GatherComponent.prototype.executeCommand = function (command) {
            this.attackCommand = command;
            this.counter = -1;
        };
        GatherComponent.prototype.setMapManager = function (arg) {
            this.mapManager = arg;
        };
        GatherComponent.prototype.update = function (time) {
            if (this.amICloseEnough() == false) {
                this.sendFollowCommandToSelf();
                return;
            }
            if (this.counter == -1) {
                this.delta = 0;
            }
            else {
                this.delta += time - this.counter;
            }
            this.counter = time;
            if (this.delta > GatherComponent.kThreshold) {
                var damage;
                damage = this.attributesDict.objectForKey(CoreConstants.kDepletionAmountKey);
                var entityID;
                entityID = this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey);
                if (damage == null || entityID == null) {
                    alert('null depletion  or entity id to attack component');
                }
                var hisPoint = this.mapManager.getCellPointOfEntity(this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey));
                this.attributesDict.setObjectForKey(hisPoint, CoreConstants.kGatheredEntityPosition);
                var request;
                var command = CoreCommandFactory.createGetGatheredCommand(damage, this.getEntityID());
                request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, entityID, command);
                this.commandSender.sendRequest(request);
                var reqToAdd;
                var addArgs;
                addArgs = new Utilities.Dictionary();
                addArgs.setObjectForKey(damage, CoreConstants.kResourceAmountKey);
                var commandAdd;
                commandAdd = new DTOs.Command(CoreConstants.kAddAmountToResources, addArgs);
                reqToAdd = new DTOs.Request(CoreConstants.kRequestTargetTypeUserManager, null, commandAdd);
                this.commandSender.sendRequest(reqToAdd);
                this.getComponentPresenter().changeAppearance(time);
                this.delta = 0;
            }
            this.getComponentPresenter().update(time);
        };
        GatherComponent.prototype.sendFollowCommandToSelf = function () {
            var targetID;
            targetID = this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey);
            var followCommand = CoreCommandFactory.createFollowCommandTo(targetID);
            this.attackCommand = CoreCommandFactory.addNextCommandToCommand(this.attackCommand, followCommand);
            var request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.entityID, followCommand);
            this.commandSender.sendRequest(request);
        };
        GatherComponent.prototype.amICloseEnough = function () {
            var myX;
            var myY;
            var hisX;
            var hixY;
            myX = this.attributesDict.objectForKey(CoreConstants.kPositionXParameterKey);
            myY = this.attributesDict.objectForKey(CoreConstants.kPositionYParameterKey);
            var myPoint = new Utilities.CellPoint(myX, myY);
            var hisPoint = this.mapManager.getCellPointOfEntity(this.attackCommand.getParameters().objectForKey(CoreConstants.kCommandEntityIdKey));
            if (hisPoint == null) {
                alert('null his point !');
            }
            return Utilities.CellPoint.areCellsClose(myPoint, hisPoint);
        };
        GatherComponent.kThreshold = 2000;
        return GatherComponent;
    })(CoreClasses.WegasComponent);
    CoreComponents.GatherComponent = GatherComponent;
})(CoreComponents || (CoreComponents = {}));
//# sourceMappingURL=CoreComponents.js.map