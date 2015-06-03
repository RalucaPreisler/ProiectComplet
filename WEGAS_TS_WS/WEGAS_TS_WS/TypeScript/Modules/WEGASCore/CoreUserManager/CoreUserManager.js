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
/// <reference path="../CoreInteractorStates/CoreInteractorStates.ts" />
var CoreUserManager = (function () {
    function CoreUserManager(requestSenderArg, mapManagerArg) {
        this.currentResourcesAmount = 80;
        this.requestSender = requestSenderArg;
        this.mapManager = mapManagerArg;
    }
    CoreUserManager.prototype.executeCommand = function (command) {
        if (command.getName() == CoreConstants.kBuyAndCreateCommand) {
            this.processCreateCommandParams(command.getParameters());
            return;
        }
        if (command.getName() === CoreConstants.kAddAmountToResources) {
            this.processAddCommandParameters(command.getParameters());
            return;
        }
        alert('unknown command sent to user manager ' + command.toJson());
    };
    CoreUserManager.prototype.processAddCommandParameters = function (params) {
        var amount = params.objectForKey(CoreConstants.kResourceAmountKey);
        if (amount == null) {
            alert('null amount to add!!');
        }
        this.currentResourcesAmount += amount;
    };
    CoreUserManager.prototype.processCreateCommandParams = function (params) {
        if (this.currentResourcesAmount > CoreUserManager.kEntityPrice) {
            console.log('found enough funds');
            this.currentResourcesAmount -= CoreUserManager.kEntityPrice;
            var request;
            var createCommand;
            createCommand = new DTOs.Command(CoreConstants.kCreateCommandName, params);
            request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntityManager, null, createCommand);
            this.requestSender.sendRequest(request);
        }
    };
    CoreUserManager.kEntityPrice = 20;
    return CoreUserManager;
})();
//# sourceMappingURL=CoreUserManager.js.map