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


class CentralUserSettings
{

    private colorForSoldier : string;
    private colorForGatherer : string;
    private userID : string;

    private initialized : boolean = false;

    private countID : number = 0;

    public initWithObject(obj : any)
    {
        this.userID = obj[CoreConstants.kUserIdDictKey];
        this.colorForGatherer = obj[CoreConstants.kGathererColorDictKey];
        this.colorForSoldier = obj[CoreConstants.kSoldierColorDictKey];
        this.initialized = true;

        console.log('succesfully initialized central settings with ' + this.userID);
    }

    public isInitialized() : boolean
    {
        return this.initialized;
    }

    public getSoldierColor()
    {
        return this.colorForSoldier;
    }

    public getGathererColor()
    {
        return this.colorForGatherer;
    }


    public getNewEntityId() : string
    {
        this.countID++;
        return this.userID + "" + this.countID;
    }

    public isOwnEntity(entityID : string) : boolean
    {
        return entityID.indexOf(this.userID) > -1;
    }

}