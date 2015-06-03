/**
 * Created by costin on 01.06.2015.
 */

    /// <reference path = "../CoreClasses/CoreClasses.ts" />
    /// <reference path = "../../Utilities/Utilities.ts" />
    /// <reference path = "../CoreConstants/CoreConstants.ts" />
    /// <reference path = "../../../Extern/AStarTS/ts/astar.ts" />
    /// <reference path = "../CoreEntities/CoreEntities.ts" />
    /// <reference path = "../CoreUserManager/CoreUserManager.ts" />
    /// <reference path = "../CentralUserSettings/CentralUserSettings.ts" />
    /// <reference path = "../../Client/SocketHandler.ts" />

module CoreImplementations
{

    export class CoreMapManager implements CoreClasses.ICentralMapManager
    {
        private lines : number;
        private columns : number;
        private positions : Utilities.Dictionary;

        private queuedCommands : DTOs.Command[] = [];

        constructor(linesArg : number, columnsArg : number)
        {
            this.lines = linesArg;
            this.columns = columnsArg;
            this.positions = new Utilities.Dictionary();
        }

        public setEntityAtCellPoint(entityID : string, cell : Utilities.CellPoint)
        {
            var newDict : Utilities.Dictionary;
            newDict = new Utilities.Dictionary();

            newDict.setObjectForKey(cell.getLine(), CoreConstants.kPositionXParameterKey);
            newDict.setObjectForKey(cell.getColumn(), CoreConstants.kPositionYParameterKey);

            this.positions.setObjectForKey(newDict, entityID);

        }

        public removeEntity(entityID : string)
        {
            this.positions = Utilities.Dictionary.dictByRemovingKey(this.positions,entityID);

        }

        public getPathBetweenCellPoints(start : Utilities.CellPoint,
                                        stop : Utilities.CellPoint) : Utilities.CellPoint[]
        {

            var map : number[][] = [];
            for(var i = 0; i< this.lines; i++)
            {
                map[i] = [];
                for(var j=0; j< this.columns; j++)
                {
                    map[i][j] = 1;
                }
            }

            var keys : string[];
            keys = this.positions.getKeysArray();
            for(var i=0; i<keys.length; i++ )
            {
                var key : string;
                key = keys[i];

                var dict : Utilities.Dictionary;
                dict = this.positions.objectForKey(key);

                var numX : number = dict.objectForKey(CoreConstants.kPositionXParameterKey);
                var numY : number = dict.objectForKey(CoreConstants.kPositionYParameterKey);

                map[numX][numY] = 0;
            }


            var startGN : astar.GraphNode;
            var endGN : astar.GraphNode;

            startGN = new astar.GraphNode(start.getLine(), start.getColumn(), astar.GraphNodeType.OPEN);
            endGN = new astar.GraphNode(stop.getLine(), stop.getColumn(),astar.GraphNodeType.OPEN);


            map[stop.getLine()][stop.getColumn()] = 1;
            map[start.getLine()][start.getColumn()] = 1;



            var result : astar.AStarData[];
            result = astar.AStar.search(map,startGN,endGN,[],true,null);

            var cellPointsResult : Utilities.CellPoint[];
            cellPointsResult = [];



            for(var i=0; i<result.length; i++)
            {
                var pos : astar.AStarData;
                pos = result[i];
                cellPointsResult[i] = new Utilities.CellPoint(pos.pos.x, pos.pos.y);
            }

            return cellPointsResult;
        }


        public getPathBetweenEntities(entity1 : string, entity2 : string) : Utilities.CellPoint[]
        {
            var p1 = this.getCellPointOfEntity(entity1);
            var p2 = this.getCellPointOfEntity(entity2);
            return this.getPathBetweenCellPoints(p1, p2);
        }

        public getCellPointOfEntity(entityID : string) : Utilities.CellPoint
        {
            var result : Utilities.CellPoint;
            var numX : number;
            var numY : number;
            var dict = <Utilities.Dictionary> this.positions.objectForKey(entityID);

            numX = <number> dict.objectForKey(CoreConstants.kPositionXParameterKey);
            numY = <number> dict.objectForKey(CoreConstants.kPositionYParameterKey);

            result = new Utilities.CellPoint(numX, numY);
            return result;
        }


        public getFreeSpawnPoint() : Utilities.CellPoint
        {
            return new Utilities.CellPoint(5,5); //DEBUG
        }


        public getEntityIdFromCell(cell : Utilities.CellPoint) : string
        {
            var keys : string[] = this.positions.getKeysArray();

            for(var i =0; i<keys.length; i++)
            {
                var key = keys[i];
                var dict = <Utilities.Dictionary>this.positions.objectForKey(key);

                var numX = <number> dict.objectForKey(CoreConstants.kPositionXParameterKey);
                var numY = <number> dict.objectForKey(CoreConstants.kPositionYParameterKey);

                if(numX == cell.getLine() && numY == cell.getColumn())
                {
                    return key;
                }
            }

            return null;
        }

        public processCommand(command : DTOs.Command)
        {
            if(! (command.getName() === CoreConstants.kPlaceEntityCommandName))
            {
                alert('uknown command sent to entity manager');
            }


        }

        private processPlaceEntityParams(params : Utilities.Dictionary)
        {

            var entityID : string = params.objectForKey(CoreConstants.kCommandEntityIdKey);
            var spawnX : number = params.objectForKey(CoreConstants.kCreatedEntitySpawnPointX);
            var spawnY : number = params.objectForKey(CoreConstants.kCreatedEntitySpawnPointY);

            if(entityID == null || spawnX == null || spawnY)
            {
                alert('missing parameters in place command ' + JSON.stringify(params.toPojo));
            }

            var cell = new Utilities.CellPoint(spawnX, spawnY);
            this.setEntityAtCellPoint(entityID, cell);
        }

        public queueCommand(command : DTOs.Command)
        {
            this.queuedCommands.push(command);
        }

        public update(time : number)
        {
            for(var i =0; i< this.queuedCommands.length; i++)
            {
                var command : DTOs.Command = this.queuedCommands[i];
                this.processCommand(command);
            }

            this.queuedCommands = [];
        }

    }


    export class CoreRenderingManager implements CoreClasses.ICentralRenderingManager
    {
        public  static  cellSizePx = CoreConstants.kCellSizePx;
        private numOfLines : number;
        private numOfColumns : number;

        private canvas : HTMLCanvasElement;
        private context : CanvasRenderingContext2D;

        private commandsArray : DTOs.Command[];
        private commandFunctionsMap : Utilities.Dictionary;

        private width : number;
        private height : number;
        constructor(linesArg : number, columnsArg : number, canvasArg : HTMLCanvasElement)
        {
            this.numOfLines = linesArg;
            this.numOfColumns = columnsArg;
            this.canvas = canvasArg;
            this.width = CoreRenderingManager.cellSizePx * this.numOfLines;
            this.height = CoreRenderingManager.cellSizePx * this.numOfColumns;

            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.context = canvasArg.getContext("2d");

            this.commandsArray = [];

            this.commandFunctionsMap = new Utilities.Dictionary();
            this.commandFunctionsMap.setObjectForKey(this.processDrawCircleCommand, CoreConstants.kDrawCircleElement);
            this.commandFunctionsMap.setObjectForKey(this.processDrawRectangleCommand, CoreConstants.kDrawRectangleElement);
            this.commandFunctionsMap.setObjectForKey(this.processDrawCrossCommand, CoreConstants.kDrawCrossElement);
            this.commandFunctionsMap.setObjectForKey(this.processDrawLineCommand, CoreConstants.kDrawLineElement);
        }

        public queueDrawCommand(command : DTOs.Command)
        {
            this.commandsArray.push(command);
        }

        public renderMap()
        {
            this.renderFull();


            for(var i = 0; i < this.commandsArray.length; i++)
            {
                var command = this.commandsArray[i];
                var fn : (arg : Utilities.Dictionary) => void;

                fn = <(arg : Utilities.Dictionary) => void> this.commandFunctionsMap.objectForKey(command.getName());

                if(fn == null)
                {
                    alert('Called a command with no predefined function x..x ' + command.toJson());
                }
                else
                {
                    fn.call(this,command.getParameters());
                    //fn(command.getParameters());
                }
            }

            this.commandsArray = [];

        }

        private renderFull()
        {
            var ctx = this.context;
            ctx.fillStyle = Utilities.RGBColor.GREEN;
            ctx.fillRect(0, 0, this.width, this.height);

        }

        public drawCircleAtCellPointWithColor(cell : Utilities.CellPoint, color : string)
        {
            var cX : number;
            var cY : number;

            cX = cell.getColumn() * CoreRenderingManager.cellSizePx + CoreRenderingManager.cellSizePx/2;
            cY = cell.getLine() * CoreRenderingManager.cellSizePx + CoreRenderingManager.cellSizePx/2;

            var ctx = this.context;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cX, cY, CoreRenderingManager.cellSizePx/2, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();

        }

        public drawLineBetweenCells(cell1 : Utilities.CellPoint, cell2 : Utilities.CellPoint,
                                    color : string)
        {


            var cX1 : number;
            var cY1 : number;

            cX1 = cell1.getColumn() * CoreRenderingManager.cellSizePx + CoreRenderingManager.cellSizePx/2;
            cY1 = cell1.getLine() * CoreRenderingManager.cellSizePx + CoreRenderingManager.cellSizePx/2;



            var cX2 : number;
            var cY2 : number;

            cX2 = cell2.getColumn() * CoreRenderingManager.cellSizePx + CoreRenderingManager.cellSizePx/2;
            cY2 = cell2.getLine() * CoreRenderingManager.cellSizePx + CoreRenderingManager.cellSizePx/2;


            var ctx = this.context;
            ctx.strokeStyle = color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(cX1,cY1);
            ctx.lineTo(cX2,cY2);
            ctx.stroke();

        }

        public drawRectangleAtCell(cell : Utilities.CellPoint, color : string)
        {
            var originX : number;
            var originY : number;

            originX = cell.getColumn() * CoreRenderingManager.cellSizePx;
            originY = cell.getLine() * CoreRenderingManager.cellSizePx;


            var ctx = this.context;
            ctx.fillStyle= color;
            ctx.fillRect(originX, originY, CoreRenderingManager.cellSizePx, CoreRenderingManager.cellSizePx);
        }

        private drawCrossAt(cell : Utilities.CellPoint, color : string)
        {
            var originX : number;
            var originY : number;

            originX = cell.getColumn() * CoreRenderingManager.cellSizePx;
            originY = cell.getLine() * CoreRenderingManager.cellSizePx;

            originX += CoreRenderingManager.cellSizePx/2;
            originY += CoreRenderingManager.cellSizePx/2;

            var crossLength : number = CoreRenderingManager.cellSizePx/3;

            var point1 = new Utilities.CellPoint(originX-crossLength, originY - crossLength);
            var point2 = new Utilities.CellPoint(originX+crossLength, originY + crossLength);

            var point3 = new Utilities.CellPoint(originX + crossLength, originY - crossLength);
            var point4 = new Utilities.CellPoint(originX - crossLength, originY + crossLength);

            this.drawLineBetweenCells(point1,point2,color);
            this.drawLineBetweenCells(point3, point4, color);

        }

        private processDrawCircleCommand(params : Utilities.Dictionary)
        {

            var cellPoint = CoreRenderingManager.extractCellPointFromParams(params);
            var color = <string> params.objectForKey(CoreConstants.kDrawColorKey);

            this.drawCircleAtCellPointWithColor(cellPoint,color);
        }

        private processDrawRectangleCommand(params : Utilities.Dictionary)
        {
            var cellPoint = CoreRenderingManager.extractCellPointFromParams(params);
            var color = <string> params.objectForKey(CoreConstants.kDrawColorKey);

            this.drawRectangleAtCell(cellPoint, color);
        }

        private processDrawCrossCommand(params : Utilities.Dictionary)
        {
            var cellPoint = CoreRenderingManager.extractCellPointFromParams(params);
            var color = <string> params.objectForKey(CoreConstants.kDrawColorKey);
        }

        private processDrawLineCommand(params : Utilities.Dictionary)
        {
            var x1 : number;
            var y1 : number;
            var x2 : number;
            var y2 : number;

            var color : string;

            x1 = params.objectForKey(CoreConstants.kDrawLineX1);
            y1 = params.objectForKey(CoreConstants.kDrawLineY1);

            x2 = params.objectForKey(CoreConstants.kDrawLineX2);
            y2 = params.objectForKey(CoreConstants.kDrawLineY2);


            color = params.objectForKey(CoreConstants.kDrawColorKey);

            var  point1 = new Utilities.CellPoint(x1, y1);
            var  point2 = new Utilities.CellPoint(x2, y2);

            this.drawLineBetweenCells(point1, point2, color);
        }

        private static extractCellPointFromParams(params : Utilities.Dictionary) : Utilities.CellPoint
        {
            var numX : number;
            var numY : number;

            numX = params.objectForKey(CoreConstants.kDrawCellPointXKey);
            numY = params.objectForKey(CoreConstants.kDrawCellPointYKey);

            return new Utilities.CellPoint(numX, numY);
        }

        public getCellFromRawXY(x : number, y:number) : Utilities.CellPoint
        {
            var size = CoreRenderingManager.cellSizePx;
            return new Utilities.CellPoint(Math.floor(y / size), Math.floor(x/size) );
        }

    }



    export class CoreEntityManager implements CoreClasses.ICentralEntityManager
    {

        private commandProcessingFnsMap : Utilities.Dictionary;
        private entityMap: Utilities.Dictionary;

        private queuedCommands : DTOs.Command[] = [];

        private renderingManager : CoreClasses.ICentralRenderingManager;
        private mapManager : CoreClasses.ICentralMapManager;
        private commandSender : CoreClasses.ICentralRequestSender;

        constructor(mapManagerArg : CoreClasses.ICentralMapManager,
                    renderingManagerArg : CoreClasses.ICentralRenderingManager,
                    senderArg : CoreClasses.ICentralRequestSender)
        {
            this.commandProcessingFnsMap = new Utilities.Dictionary();
            this.entityMap = new Utilities.Dictionary();

            this.commandSender = senderArg;
            this.mapManager = mapManagerArg;
            this.renderingManager = renderingManagerArg;
        }

        public passThroughCommands()
        {
            for(var i=0; i<this.queuedCommands.length; i++)
            {
                var command : DTOs.Command = this.queuedCommands[i];
                this.processCommand(command);
            }

            this.queuedCommands = [];
        }

        public update(time : number)
        {
            this.passThroughCommands();

            var eKeys : string[];
            eKeys = this.entityMap.getKeysArray();
            for(var i = 0; i< eKeys.length; i++)
            {
                var entity : CoreClasses.WegasEntity;
                entity = this.entityMap.objectForKey(eKeys[i]);
                entity.update(time);
            }

        }

        public getEntityForId(id : string) : CoreClasses.WegasEntity
        {
            return this.entityMap.objectForKey(id);
        }


        public processEntityRequest(request : DTOs.Request)
        {
            var entityID : string;
            entityID = request.getTargetId();
            if(entityID == null || this.entityMap.objectForKey(entityID) == null)
            {
                alert('null or invalid entity id for request! ' + entityID);
            }

            var entity : CoreClasses.WegasEntity;
            entity = this.entityMap.objectForKey(entityID);
            entity.executeCommand(request.getCommand());
        }

        public processCommand(command : DTOs.Command)
        {
            if(command.getName() == CoreConstants.kCreateCommandName)
            {
                this.processCreateCommandParameters(command.getParameters());
                return;
            }

            if(command.getName() === CoreConstants.kRemoveEntityCommandName)
            {
                this.processRemoveCommandParameters(command.getParameters());
                return;
            }

            alert('unkown command sent to entity manager ' + command.toJson());

        }


        private processRemoveCommandParameters(params : Utilities.Dictionary)
        {
            var entityID : string;
            entityID = params.objectForKey(CoreConstants.kCommandEntityIdKey);

            this.entityMap = Utilities.Dictionary.dictByRemovingKey(this.entityMap,entityID);
        }

        private processCreateCommandParameters(params : Utilities.Dictionary)
        {

            var entityID : string;
            var type : string;
            var spawnX : number;
            var spawnY : number;
            var color : string;

            entityID = <string> params.objectForKey(CoreConstants.kCreatedEntityIdKey);
            type = <string>params.objectForKey(CoreConstants.kEntityTypeKey);
            spawnX = <number>params.objectForKey(CoreConstants.kCreatedEntitySpawnPointX);
            spawnY = <number>params.objectForKey(CoreConstants.kCreatedEntitySpawnPointY);
            color = <string>params.objectForKey(CoreConstants.kCreatedEntityColor);

            if(entityID == null || type == null || spawnX == null || spawnY == null || color == null)
            {
                alert('null entity id/spawn/type/color in create command!');
            }

            var entity : CoreClasses.WegasEntity;
            var  pos = new Utilities.CellPoint(spawnX, spawnY);

            if(type == CoreConstants.kGatheringEntityType)
            {
                entity = CoreEntities.GatheringEntity.createGatheringEntityWithId(entityID,
                this.mapManager,this.commandSender,this.renderingManager, pos, color);
            }

            if(type == CoreConstants.kResourceEntityType)
            {
                entity = CoreEntities.ResourceEntity.createResourceEntityWithId(entityID,
                    this.mapManager,this.commandSender,this.renderingManager, pos, color);
            }

            if(type == CoreConstants.kSoldierEntityType)
            {
                entity = CoreEntities.SoldierEntity.createSoldierEntityWithId(entityID,
                    this.mapManager,this.commandSender,this.renderingManager, pos, color);
            }

            var point = new Utilities.CellPoint(spawnX, spawnY);

            if(this.entityMap.objectForKey(entityID) != null)
            {
                return;
            }

            this.entityMap.setObjectForKey(entity, entityID);
            this.mapManager.setEntityAtCellPoint(entityID, pos);

        }


        public queueCommand(command : DTOs.Command)
        {
            this.queuedCommands.push(command);
        }



    }


    export class CoreRequestSender implements CoreClasses.ICentralRequestSender
    {

        private receiver : CoreClasses.ICentralRequestReceiver;
        private socketHandler : SocketHandler;
        public setRequestReceiver(handler : SocketHandler)
        {
            this.socketHandler = handler;
        }

        public sendRequest(request : DTOs.Request)
        {
            var reqString : string = request.toJson();
            if(this.socketHandler!=null)
            {
                this.socketHandler.sendMessage(reqString);
            }
        }

        public setRequestReceiverLocal(recv: CoreClasses.ICentralRequestReceiver)
        {
            this.receiver = recv;
        }

        public sendRequestLocally(request : DTOs.Request)
        {
            this.receiver.queueJsonRequest(request.toJson());
        }
    }


    export interface ICoreGame
    {
        update();
    }

    export class CoreRequestReceiver implements CoreClasses.ICentralRequestReceiver
    {
        private entityManager : CoreClasses.ICentralEntityManager;
        private userManager : CoreUserManager;
        private centralSettings : CentralUserSettings;
        private sender : SocketHandler;

        private game : ICoreGame;

        private queuedRequests : string[] = [];

        constructor(entityManArg : CoreClasses.ICentralEntityManager,
                    userManArg : CoreUserManager,
                    centralSettingsArg : CentralUserSettings,
                    gameArg : ICoreGame)
        {
            this.game = gameArg;
            this.centralSettings = centralSettingsArg;
            this.userManager = userManArg;
            this.entityManager = entityManArg;
        }

        public setSender(senderArg : SocketHandler)
        {
          this.sender = senderArg;
        }

        public startSendingRaf()
        {
            this.sender.sendMessage("RAF");

        }

        private setupWithTheSettings(obj : any)
        {
            var centralSettingsObj = obj[CoreConstants.kCentralSettingsDictKey];
            this.centralSettings.initWithObject(centralSettingsObj);

            var resPos : any[] = obj[CoreConstants.kResourcePositionsDictKey];
            for(var i = 0; i<resPos.length; i++)
            {
                var resObj : any = resPos[i];
                var line : number = resObj[CoreConstants.kResourceLineDictKey];
                var col : number = resObj[CoreConstants.kResourceColumnDictKey];
                var id : string = resObj["idEnt"];

                console.log(line + ", " + col + ", " + id);

                var createResourceCommand : DTOs.Command;

                createResourceCommand = CoreCommandFactory.createCreateEntityCommand
                (id,CoreConstants.kResourceEntityType,line,col,Utilities.RGBColor.YELLOW);

                this.entityManager.queueCommand(createResourceCommand);
            }

        }

        public processStringRequest(str : string)
        {

            if(str == "FRAME")
            {
                this.game.update();
                this.sender.sendMessage("RAF");
                return;
            }

            if(!this.centralSettings.isInitialized())
            {
                var obj = JSON.parse(str);
                this.setupWithTheSettings(obj);
            }
            else
            {
                this.processJSONRequest(str);
            }
        }

        processRequest(request : DTOs.Request)
        {
            if(request.getTargetType() == CoreConstants.kRequestTargetTypeEntityManager)
            {
                this.entityManager.queueCommand(request.getCommand());
            }

            if(request.getTargetType() == CoreConstants.kRequestTargetTypeEntity)
            {
                this.entityManager.processEntityRequest(request);
            }

            if(request.getTargetType() === CoreConstants.kRequestTargetTypeUserManager)
            {
                this.userManager.executeCommand(request.getCommand());
            }

        }

        processJSONRequest(jsonReq : string) : void
        {
            var request = DTOs.Request.createFromJson(jsonReq);
            this.processRequest(request);

        }

        public queueJsonRequest(jsonReq : string)
        {
            this.queuedRequests.push(jsonReq);
        }

        public update(time : number)
        {
            for(var i=0; i<this.queuedRequests.length; i++)
            {
                var jsonReq : string = this.queuedRequests[i];
                this.processJSONRequest(jsonReq);


            }

            this.queuedRequests = [];
        }
    }

}