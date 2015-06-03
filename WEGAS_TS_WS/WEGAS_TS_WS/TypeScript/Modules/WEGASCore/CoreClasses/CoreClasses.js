/**
 * Created by Costinel on 6/1/15.
 */
/// <reference path = "../CoreConstants/CoreConstants.ts" />
/// <reference path = "../DTOs/DTOs.ts" />
/// <reference path = "../CoreCommandFactory/CoreCommandFactory.ts" />
var CoreClasses;
(function (CoreClasses) {
    var WegasEntity = (function () {
        function WegasEntity(idArg, compsArg, attrArg) {
            this.id = idArg;
            this.componentsArray = compsArg;
            this.attributesDict = attrArg;
        }
        WegasEntity.prototype.getID = function () {
            return this.id;
        };
        WegasEntity.prototype.addAttributeForKey = function (attr, key) {
            this.attributesDict.setObjectForKey(attr, key);
        };
        WegasEntity.prototype.getAttributes = function () {
            return this.attributesDict;
        };
        WegasEntity.prototype.addComponent = function (comp) {
            this.componentsArray.push(comp);
        };
        WegasEntity.prototype.respondsToCommand = function (command) {
            if (command === CoreConstants.kUpdateAttributesCommandName) {
                return true;
            }
            for (var i = 0; i < this.componentsArray.length; i++) {
                var component = this.componentsArray[i];
                if (component.respondsToCommand(command) == true) {
                    return true;
                }
            }
            return false;
        };
        WegasEntity.prototype.executeCommand = function (command) {
            if (command.getName() == CoreConstants.kUpdateAttributesCommandName) {
                this.modifyAttributesFrom(command.getParameters());
                return;
            }
            for (var i = 0; i < this.componentsArray.length; i++) {
                var component = this.componentsArray[i];
                if (component.respondsToCommand(command.getName()) == true) {
                    this.currentActiveComponent = component;
                    component.executeCommand(command);
                    this.attributesDict.setObjectForKey(this.currentExecutingCommand, CoreConstants.kEntityPreviousCommand);
                    this.currentExecutingCommand = command;
                }
            }
        };
        WegasEntity.prototype.update = function (time) {
            this.currentActiveComponent.update(time);
        };
        WegasEntity.prototype.modifyAttributesFrom = function (dict) {
            this.attributesDict.overwriteExistingByImportingFrom(dict);
        };
        return WegasEntity;
    })();
    CoreClasses.WegasEntity = WegasEntity;
    var WegasComponent = (function () {
        function WegasComponent(entityIDArg, attrArg, presenter, commandSenderArg) {
            this.componentPresenter = presenter;
            this.attributesDict = attrArg;
            this.entityID = entityIDArg;
            this.commandSender = commandSenderArg;
        }
        WegasComponent.prototype.respondsToCommand = function (command) {
            alert('Base class called to responds to command!');
            return false;
        };
        WegasComponent.prototype.executeCommand = function (command) {
            alert('Base component class called to execute command!');
        };
        WegasComponent.prototype.update = function (currentTime) {
            alert('Called update on base component class');
        };
        WegasComponent.prototype.getEntityID = function () {
            return this.entityID;
        };
        WegasComponent.prototype.getAttributesDict = function () {
            return this.attributesDict;
            // for subclasses
        };
        WegasComponent.prototype.getComponentPresenter = function () {
            return this.componentPresenter;
        };
        WegasComponent.prototype.checkAndCallNextCommandFromExecutedCommand = function (command) {
            var jsonCommand;
            jsonCommand = command.getParameters().objectForKey(CoreConstants.kNextCommandJsonKey);
            if (jsonCommand != null) {
                var nextCommand;
                nextCommand = DTOs.Command.createFromJSON(jsonCommand);
                var rq;
                rq = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.entityID, nextCommand);
                this.commandSender.sendRequest(rq);
            }
            else {
                this.sendIdleCommandToSelf();
            }
        };
        WegasComponent.prototype.sendDieCommandToSelf = function () {
            var rq;
            var die;
            die = new DTOs.Command(CoreConstants.kDieCommandName, null);
            rq = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.getEntityID(), die);
            this.commandSender.sendRequest(rq);
        };
        WegasComponent.prototype.sendIdleCommandToSelf = function () {
            var rq;
            var die;
            die = new DTOs.Command(CoreConstants.kBecomeIdleCommandName, null);
            rq = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.getEntityID(), die);
            this.commandSender.sendRequestLocally(rq);
        };
        WegasComponent.prototype.sendPreviousCommandToSelf = function () {
            var rq;
            var die;
            die = this.attributesDict.objectForKey(CoreConstants.kEntityPreviousCommand);
            rq = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.getEntityID(), die);
            this.commandSender.sendRequest(rq);
        };
        return WegasComponent;
    })();
    CoreClasses.WegasComponent = WegasComponent;
    var WegasComponentPresenter = (function () {
        function WegasComponentPresenter(idAttr, attrArg, commandSendeArg, colorArg, renderArg) {
            this.renderManager = renderArg;
            this.color = colorArg;
            this.commandSender = commandSendeArg;
            this.entityID = idAttr;
            this.attributesDict = attrArg;
        }
        WegasComponentPresenter.prototype.beginPresenting = function () {
            alert('Begin presenting called on base component presenter class!');
        };
        WegasComponentPresenter.prototype.update = function (time) {
            alert('Update called on base component presenter class!');
        };
        WegasComponentPresenter.prototype.changeAppearance = function (time) {
            alert('change appearance called on base component presenter class!');
        };
        WegasComponentPresenter.prototype.getEntityId = function () {
            return this.entityID;
        };
        WegasComponentPresenter.prototype.getAttributesDict = function () {
            return this.attributesDict;
        };
        WegasComponentPresenter.prototype.getCommandSender = function () {
            return this.commandSender;
        };
        return WegasComponentPresenter;
    })();
    CoreClasses.WegasComponentPresenter = WegasComponentPresenter;
})(CoreClasses || (CoreClasses = {}));
//# sourceMappingURL=CoreClasses.js.map