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

class CoreUserManager
{

    private currentResourcesAmount : number = 80;

    private static kEntityPrice = 20;

    private requestSender : CoreClasses.ICentralRequestSender;
    private mapManager : CoreClasses.ICentralMapManager;

    constructor(requestSenderArg : CoreClasses.ICentralRequestSender,
                mapManagerArg : CoreClasses.ICentralMapManager)
    {
        this.requestSender = requestSenderArg;
        this.mapManager = mapManagerArg;
    }

    public executeCommand(command : DTOs.Command)
    {
        if(command.getName() == CoreConstants.kBuyAndCreateCommand)
        {
            this.processCreateCommandParams(command.getParameters());
            return;
        }

        if(command.getName() === CoreConstants.kAddAmountToResources)
        {
            this.processAddCommandParameters(command.getParameters());
            return;
        }

        alert('unknown command sent to user manager ' + command.toJson());
    }


    private processAddCommandParameters(params : Utilities.Dictionary)
    {
        var amount : number = params.objectForKey(CoreConstants.kResourceAmountKey);

        if(amount == null)
        {
            alert('null amount to add!!');
        }

        this.currentResourcesAmount += amount;


    }


    private processCreateCommandParams(params : Utilities.Dictionary)
    {
        if(this.currentResourcesAmount > CoreUserManager.kEntityPrice)
        {
            console.log('found enough funds');
            this.currentResourcesAmount -= CoreUserManager.kEntityPrice;


            var  request : DTOs.Request;

            var createCommand : DTOs.Command;
            createCommand = new DTOs.Command(CoreConstants.kCreateCommandName, params);

            request = new DTOs.Request(CoreConstants.kRequestTargetTypeEntityManager,null,createCommand);

            this.requestSender.sendRequest(request);
        }

    }

}