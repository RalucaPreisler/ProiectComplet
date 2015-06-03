/**
 * Created by Costinel on 6/3/15.
 */
/// <reference path="../CoreImplementations/CoreImplementations.ts" />
/// <reference path="../../Utilities/Utilities.ts" />
/// <reference path="../CoreComponents/CoreComponents.ts" />
/// <reference path="../CoreConstants/CoreConstants.ts" />
/// <reference path="../CoreComponentPresenters/CoreComponentPresenters.ts" />
/// <reference path= "../CoreEntities/CoreEntities.ts" />
/// <reference path="../CoreCommandFactory/CoreCommandFactory.ts" />
/// <reference path="../CoreInteractorStates/CoreInteractorStates.ts" />
var CentralUserSettings = (function () {
    function CentralUserSettings() {
        this.initialized = false;
        this.countID = 0;
    }
    CentralUserSettings.prototype.initWithObject = function (obj) {
        this.userID = obj[CoreConstants.kUserIdDictKey];
        this.colorForGatherer = obj[CoreConstants.kGathererColorDictKey];
        this.colorForSoldier = obj[CoreConstants.kSoldierColorDictKey];
        this.initialized = true;
        console.log('succesfully initialized central settings with ' + this.userID);
    };
    CentralUserSettings.prototype.isInitialized = function () {
        return this.initialized;
    };
    CentralUserSettings.prototype.getSoldierColor = function () {
        return this.colorForSoldier;
    };
    CentralUserSettings.prototype.getGathererColor = function () {
        return this.colorForGatherer;
    };
    CentralUserSettings.prototype.getNewEntityId = function () {
        this.countID++;
        return this.userID + "" + this.countID;
    };
    CentralUserSettings.prototype.isOwnEntity = function (entityID) {
        return entityID.indexOf(this.userID) > -1;
    };
    return CentralUserSettings;
})();
//# sourceMappingURL=CentralUserSettings.js.map