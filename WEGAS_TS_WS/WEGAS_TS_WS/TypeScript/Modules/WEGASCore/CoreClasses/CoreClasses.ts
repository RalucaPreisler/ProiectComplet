/**
 * Created by Costinel on 6/1/15.
 */

/// <reference path = "../CoreConstants/CoreConstants.ts" />
/// <reference path = "../DTOs/DTOs.ts" />
/// <reference path = "../CoreCommandFactory/CoreCommandFactory.ts" />

module CoreClasses
{

    export class WegasEntity
    {
        private id : string;
        private componentsArray : WegasComponent[];
        private currentActiveComponent : WegasComponent;

        private currentExecutingCommand : DTOs.Command;

        private attributesDict : Utilities.Dictionary;

        constructor(idArg : string, compsArg : WegasComponent[], attrArg:
                    Utilities.Dictionary)
        {

            this.id = idArg;
            this.componentsArray = compsArg;
            this.attributesDict = attrArg;
        }

        public getID()
        {
            return this.id;
        }

        public addAttributeForKey(attr : number, key : string)
        {
            this.attributesDict.setObjectForKey(attr,key);
        }

        public getAttributes()
        {
            return this.attributesDict;
        }

        public addComponent(comp : WegasComponent)
        {
            this.componentsArray.push(comp);
        }

        public respondsToCommand(command : string) : boolean
        {

            if(command === CoreConstants.kUpdateAttributesCommandName)
            {
                return true;
            }


            for(var i=0; i<this.componentsArray.length; i++)
            {
                var  component = this.componentsArray[i];
                if(component.respondsToCommand(command) == true)
                {
                    return true;
                }
            }

            return false;
        }

        public executeCommand(command : DTOs.Command)
        {
            if(command.getName() == CoreConstants.kUpdateAttributesCommandName)
            {
                this.modifyAttributesFrom(command.getParameters());
                return;
            }

            for(var i=0; i<this.componentsArray.length; i++)
            {
                var  component = this.componentsArray[i];
                if(component.respondsToCommand(command.getName()) == true)
                {
                   this.currentActiveComponent = component;
                    component.executeCommand(command);

                    this.attributesDict.setObjectForKey(this.currentExecutingCommand, CoreConstants.kEntityPreviousCommand);
                    this.currentExecutingCommand = command;
                }
            }
        }

        public update(time : number)
        {
            this.currentActiveComponent.update(time);
        }

        private modifyAttributesFrom(dict : Utilities.Dictionary)
        {
            this.attributesDict.overwriteExistingByImportingFrom(dict);
        }

    }


    export class WegasComponent
    {
        protected isActive : boolean;
        protected entityID : string;
        protected attributesDict : Utilities.Dictionary;
        protected componentPresenter : WegasComponentPresenter;
        protected commandSender : ICentralRequestSender;



        public respondsToCommand(command : string) : boolean
        {
            alert('Base class called to responds to command!');
            return false;
        }

        public executeCommand(command : DTOs.Command)
        {
            alert('Base component class called to execute command!');
        }

        constructor(entityIDArg : string, attrArg : Utilities.Dictionary,
                    presenter : WegasComponentPresenter, commandSenderArg : ICentralRequestSender)
        {
            this.componentPresenter = presenter;
            this.attributesDict = attrArg;
            this.entityID = entityIDArg;
            this.commandSender = commandSenderArg;
        }

        public update(currentTime: number)
        {
            alert('Called update on base component class');
        }

        public getEntityID() : string
        {
            return this.entityID;
        }

        public getAttributesDict() : Utilities.Dictionary
        {
            return this.attributesDict;
            // for subclasses
        }

        public getComponentPresenter() : WegasComponentPresenter
        {
            return this.componentPresenter;
        }

        protected checkAndCallNextCommandFromExecutedCommand(command : DTOs.Command)
        {
            var jsonCommand : string;
            jsonCommand = command.getParameters().objectForKey(CoreConstants.kNextCommandJsonKey);

            if(jsonCommand != null)
            {
                var nextCommand : DTOs.Command;
                nextCommand = DTOs.Command.createFromJSON(jsonCommand);
                var rq : DTOs.Request;

                rq = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity,this.entityID,nextCommand);

                this.commandSender.sendRequest(rq);

            }
            else
            {
                this.sendIdleCommandToSelf();

            }
        }

        protected sendDieCommandToSelf()
        {
            var rq : DTOs.Request;
            var die : DTOs.Command;

            die = new DTOs.Command(CoreConstants.kDieCommandName, null);

            rq = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.getEntityID(),die);
            this.commandSender.sendRequest(rq);
        }

        protected  sendIdleCommandToSelf()
        {
            var rq : DTOs.Request;
            var die : DTOs.Command;

            die = new DTOs.Command(CoreConstants.kBecomeIdleCommandName, null);

            rq = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.getEntityID(),die);
            this.commandSender.sendRequestLocally(rq);
        }

        protected sendPreviousCommandToSelf()
        {
            var rq : DTOs.Request;
            var die : DTOs.Command;

            die = this.attributesDict.objectForKey(CoreConstants.kEntityPreviousCommand);

            rq = new DTOs.Request(CoreConstants.kRequestTargetTypeEntity, this.getEntityID(),die);
            this.commandSender.sendRequest(rq);
        }

    }

    export class WegasComponentPresenter
    {
        protected color : string;
        protected entityID : string;
        protected attributesDict : Utilities.Dictionary;
        protected commandSender : ICentralRequestSender;
        protected renderManager : ICentralRenderingManager;

        constructor(idAttr : string, attrArg : Utilities.Dictionary, commandSendeArg : ICentralRequestSender,
                    colorArg : string, renderArg : ICentralRenderingManager)
        {
            this.renderManager = renderArg;
            this.color = colorArg;
            this.commandSender = commandSendeArg;
            this.entityID = idAttr;
            this.attributesDict = attrArg;
        }

        public beginPresenting()
        {
            alert('Begin presenting called on base component presenter class!');
        }

        public update(time : number)
        {
            alert('Update called on base component presenter class!');
        }

        public changeAppearance(time : number)
        {
            alert('change appearance called on base component presenter class!');

        }

        public getEntityId() : string
        {
            return this.entityID;
        }

        public getAttributesDict() : Utilities.Dictionary
        {
            return this.attributesDict;
        }

        public getCommandSender() : ICentralRequestSender
        {
            return this.commandSender;
        }
    }


    export interface ICentralRenderingManager
    {
        queueDrawCommand(command : DTOs.Command);
        getCellFromRawXY(x : number, y : number) : Utilities.CellPoint;

    }

    export interface ICentralRequestSender
    {
         sendRequest(request : DTOs.Request) : void;
        sendRequestLocally(request : DTOs.Request) : void;
    }

    export interface ICentralMapManager
    {
        removeEntity(entityID : string);
        setEntityAtCellPoint(entityID : string, cell : Utilities.CellPoint);

        getPathBetweenCellPoints(start : Utilities.CellPoint,
                                 stop:Utilities.CellPoint) : Utilities.CellPoint[];

        getCellPointOfEntity(entityID : string) : Utilities.CellPoint;

        getPathBetweenEntities(entity1 : string, entity2 : string) : Utilities.CellPoint[];

        getEntityIdFromCell(cell : Utilities.CellPoint) : string;

        queueCommand(command : DTOs.Command);
        update(time : number);
        processCommand(command : DTOs.Command);

    }

    export interface EntityIdGenerator
    {
        generateNewEntityID() : string;
        processCommand(command : DTOs.Command);
    }



    export interface ICentralEntityManager
    {
        processEntityRequest(request : DTOs.Request);
        processCommand(command : DTOs.Command);
        getEntityForId(id:string) : WegasEntity;

        queueCommand(command : DTOs.Command);
        update(time : number);
    }

    export interface ICentralRequestReceiver
    {
        queueJsonRequest(jsonReq : string);
        processJSONRequest(jsonReq : string) : void;
        processRequest(request : DTOs.Request) : void;
        update(time : number);
    }

}