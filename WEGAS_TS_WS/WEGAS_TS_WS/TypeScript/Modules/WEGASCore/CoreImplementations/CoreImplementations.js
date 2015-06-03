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
var CoreImplementations;
(function (CoreImplementations) {
    var CoreMapManager = (function () {
        function CoreMapManager(linesArg, columnsArg) {
            this.queuedCommands = [];
            this.lines = linesArg;
            this.columns = columnsArg;
            this.positions = new Utilities.Dictionary();
        }
        CoreMapManager.prototype.setEntityAtCellPoint = function (entityID, cell) {
            var newDict;
            newDict = new Utilities.Dictionary();
            newDict.setObjectForKey(cell.getLine(), CoreConstants.kPositionXParameterKey);
            newDict.setObjectForKey(cell.getColumn(), CoreConstants.kPositionYParameterKey);
            this.positions.setObjectForKey(newDict, entityID);
        };
        CoreMapManager.prototype.removeEntity = function (entityID) {
            this.positions = Utilities.Dictionary.dictByRemovingKey(this.positions, entityID);
        };
        CoreMapManager.prototype.getPathBetweenCellPoints = function (start, stop) {
            var map = [];
            for (var i = 0; i < this.lines; i++) {
                map[i] = [];
                for (var j = 0; j < this.columns; j++) {
                    map[i][j] = 1;
                }
            }
            var keys;
            keys = this.positions.getKeysArray();
            for (var i = 0; i < keys.length; i++) {
                var key;
                key = keys[i];
                var dict;
                dict = this.positions.objectForKey(key);
                var numX = dict.objectForKey(CoreConstants.kPositionXParameterKey);
                var numY = dict.objectForKey(CoreConstants.kPositionYParameterKey);
                map[numX][numY] = 0;
            }
            var startGN;
            var endGN;
            startGN = new astar.GraphNode(start.getLine(), start.getColumn(), 1 /* OPEN */);
            endGN = new astar.GraphNode(stop.getLine(), stop.getColumn(), 1 /* OPEN */);
            map[stop.getLine()][stop.getColumn()] = 1;
            map[start.getLine()][start.getColumn()] = 1;
            var result;
            result = astar.AStar.search(map, startGN, endGN, [], true, null);
            var cellPointsResult;
            cellPointsResult = [];
            for (var i = 0; i < result.length; i++) {
                var pos;
                pos = result[i];
                cellPointsResult[i] = new Utilities.CellPoint(pos.pos.x, pos.pos.y);
            }
            return cellPointsResult;
        };
        CoreMapManager.prototype.getPathBetweenEntities = function (entity1, entity2) {
            var p1 = this.getCellPointOfEntity(entity1);
            var p2 = this.getCellPointOfEntity(entity2);
            return this.getPathBetweenCellPoints(p1, p2);
        };
        CoreMapManager.prototype.getCellPointOfEntity = function (entityID) {
            var result;
            var numX;
            var numY;
            var dict = this.positions.objectForKey(entityID);
            numX = dict.objectForKey(CoreConstants.kPositionXParameterKey);
            numY = dict.objectForKey(CoreConstants.kPositionYParameterKey);
            result = new Utilities.CellPoint(numX, numY);
            return result;
        };
        CoreMapManager.prototype.getFreeSpawnPoint = function () {
            return new Utilities.CellPoint(5, 5); //DEBUG
        };
        CoreMapManager.prototype.getEntityIdFromCell = function (cell) {
            var keys = this.positions.getKeysArray();
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var dict = this.positions.objectForKey(key);
                var numX = dict.objectForKey(CoreConstants.kPositionXParameterKey);
                var numY = dict.objectForKey(CoreConstants.kPositionYParameterKey);
                if (numX == cell.getLine() && numY == cell.getColumn()) {
                    return key;
                }
            }
            return null;
        };
        CoreMapManager.prototype.processCommand = function (command) {
            if (!(command.getName() === CoreConstants.kPlaceEntityCommandName)) {
                alert('uknown command sent to entity manager');
            }
        };
        CoreMapManager.prototype.processPlaceEntityParams = function (params) {
            var entityID = params.objectForKey(CoreConstants.kCommandEntityIdKey);
            var spawnX = params.objectForKey(CoreConstants.kCreatedEntitySpawnPointX);
            var spawnY = params.objectForKey(CoreConstants.kCreatedEntitySpawnPointY);
            if (entityID == null || spawnX == null || spawnY) {
                alert('missing parameters in place command ' + JSON.stringify(params.toPojo));
            }
            var cell = new Utilities.CellPoint(spawnX, spawnY);
            this.setEntityAtCellPoint(entityID, cell);
        };
        CoreMapManager.prototype.queueCommand = function (command) {
            this.queuedCommands.push(command);
        };
        CoreMapManager.prototype.update = function (time) {
            for (var i = 0; i < this.queuedCommands.length; i++) {
                var command = this.queuedCommands[i];
                this.processCommand(command);
            }
            this.queuedCommands = [];
        };
        return CoreMapManager;
    })();
    CoreImplementations.CoreMapManager = CoreMapManager;
    var CoreRenderingManager = (function () {
        function CoreRenderingManager(linesArg, columnsArg, canvasArg) {
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
        CoreRenderingManager.prototype.queueDrawCommand = function (command) {
            this.commandsArray.push(command);
        };
        CoreRenderingManager.prototype.renderMap = function () {
            this.renderFull();
            for (var i = 0; i < this.commandsArray.length; i++) {
                var command = this.commandsArray[i];
                var fn;
                fn = this.commandFunctionsMap.objectForKey(command.getName());
                if (fn == null) {
                    alert('Called a command with no predefined function x..x ' + command.toJson());
                }
                else {
                    fn.call(this, command.getParameters());
                }
            }
            this.commandsArray = [];
        };
        CoreRenderingManager.prototype.renderFull = function () {
            var ctx = this.context;
            ctx.fillStyle = Utilities.RGBColor.GREEN;
            ctx.fillRect(0, 0, this.width, this.height);
        };
        CoreRenderingManager.prototype.drawCircleAtCellPointWithColor = function (cell, color) {
            var cX;
            var cY;
            cX = cell.getColumn() * CoreRenderingManager.cellSizePx + CoreRenderingManager.cellSizePx / 2;
            cY = cell.getLine() * CoreRenderingManager.cellSizePx + CoreRenderingManager.cellSizePx / 2;
            var ctx = this.context;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cX, cY, CoreRenderingManager.cellSizePx / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        };
        CoreRenderingManager.prototype.drawLineBetweenCells = function (cell1, cell2, color) {
            var cX1;
            var cY1;
            cX1 = cell1.getColumn() * CoreRenderingManager.cellSizePx + CoreRenderingManager.cellSizePx / 2;
            cY1 = cell1.getLine() * CoreRenderingManager.cellSizePx + CoreRenderingManager.cellSizePx / 2;
            var cX2;
            var cY2;
            cX2 = cell2.getColumn() * CoreRenderingManager.cellSizePx + CoreRenderingManager.cellSizePx / 2;
            cY2 = cell2.getLine() * CoreRenderingManager.cellSizePx + CoreRenderingManager.cellSizePx / 2;
            var ctx = this.context;
            ctx.strokeStyle = color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(cX1, cY1);
            ctx.lineTo(cX2, cY2);
            ctx.stroke();
        };
        CoreRenderingManager.prototype.drawRectangleAtCell = function (cell, color) {
            var originX;
            var originY;
            originX = cell.getColumn() * CoreRenderingManager.cellSizePx;
            originY = cell.getLine() * CoreRenderingManager.cellSizePx;
            var ctx = this.context;
            ctx.fillStyle = color;
            ctx.fillRect(originX, originY, CoreRenderingManager.cellSizePx, CoreRenderingManager.cellSizePx);
        };
        CoreRenderingManager.prototype.drawCrossAt = function (cell, color) {
            var originX;
            var originY;
            originX = cell.getColumn() * CoreRenderingManager.cellSizePx;
            originY = cell.getLine() * CoreRenderingManager.cellSizePx;
            originX += CoreRenderingManager.cellSizePx / 2;
            originY += CoreRenderingManager.cellSizePx / 2;
            var crossLength = CoreRenderingManager.cellSizePx / 3;
            var point1 = new Utilities.CellPoint(originX - crossLength, originY - crossLength);
            var point2 = new Utilities.CellPoint(originX + crossLength, originY + crossLength);
            var point3 = new Utilities.CellPoint(originX + crossLength, originY - crossLength);
            var point4 = new Utilities.CellPoint(originX - crossLength, originY + crossLength);
            this.drawLineBetweenCells(point1, point2, color);
            this.drawLineBetweenCells(point3, point4, color);
        };
        CoreRenderingManager.prototype.processDrawCircleCommand = function (params) {
            var cellPoint = CoreRenderingManager.extractCellPointFromParams(params);
            var color = params.objectForKey(CoreConstants.kDrawColorKey);
            this.drawCircleAtCellPointWithColor(cellPoint, color);
        };
        CoreRenderingManager.prototype.processDrawRectangleCommand = function (params) {
            var cellPoint = CoreRenderingManager.extractCellPointFromParams(params);
            var color = params.objectForKey(CoreConstants.kDrawColorKey);
            this.drawRectangleAtCell(cellPoint, color);
        };
        CoreRenderingManager.prototype.processDrawCrossCommand = function (params) {
            var cellPoint = CoreRenderingManager.extractCellPointFromParams(params);
            var color = params.objectForKey(CoreConstants.kDrawColorKey);
        };
        CoreRenderingManager.prototype.processDrawLineCommand = function (params) {
            var x1;
            var y1;
            var x2;
            var y2;
            var color;
            x1 = params.objectForKey(CoreConstants.kDrawLineX1);
            y1 = params.objectForKey(CoreConstants.kDrawLineY1);
            x2 = params.objectForKey(CoreConstants.kDrawLineX2);
            y2 = params.objectForKey(CoreConstants.kDrawLineY2);
            color = params.objectForKey(CoreConstants.kDrawColorKey);
            var point1 = new Utilities.CellPoint(x1, y1);
            var point2 = new Utilities.CellPoint(x2, y2);
            this.drawLineBetweenCells(point1, point2, color);
        };
        CoreRenderingManager.extractCellPointFromParams = function (params) {
            var numX;
            var numY;
            numX = params.objectForKey(CoreConstants.kDrawCellPointXKey);
            numY = params.objectForKey(CoreConstants.kDrawCellPointYKey);
            return new Utilities.CellPoint(numX, numY);
        };
        CoreRenderingManager.prototype.getCellFromRawXY = function (x, y) {
            var size = CoreRenderingManager.cellSizePx;
            return new Utilities.CellPoint(Math.floor(y / size), Math.floor(x / size));
        };
        CoreRenderingManager.cellSizePx = CoreConstants.kCellSizePx;
        return CoreRenderingManager;
    })();
    CoreImplementations.CoreRenderingManager = CoreRenderingManager;
    var CoreEntityManager = (function () {
        function CoreEntityManager(mapManagerArg, renderingManagerArg, senderArg) {
            this.queuedCommands = [];
            this.commandProcessingFnsMap = new Utilities.Dictionary();
            this.entityMap = new Utilities.Dictionary();
            this.commandSender = senderArg;
            this.mapManager = mapManagerArg;
            this.renderingManager = renderingManagerArg;
        }
        CoreEntityManager.prototype.passThroughCommands = function () {
            for (var i = 0; i < this.queuedCommands.length; i++) {
                var command = this.queuedCommands[i];
                this.processCommand(command);
            }
            this.queuedCommands = [];
        };
        CoreEntityManager.prototype.update = function (time) {
            this.passThroughCommands();
            var eKeys;
            eKeys = this.entityMap.getKeysArray();
            for (var i = 0; i < eKeys.length; i++) {
                var entity;
                entity = this.entityMap.objectForKey(eKeys[i]);
                entity.update(time);
            }
        };
        CoreEntityManager.prototype.getEntityForId = function (id) {
            return this.entityMap.objectForKey(id);
        };
        CoreEntityManager.prototype.processEntityRequest = function (request) {
            var entityID;
            entityID = request.getTargetId();
            if (entityID == null || this.entityMap.objectForKey(entityID) == null) {
                alert('null or invalid entity id for request! ' + entityID);
            }
            var entity;
            entity = this.entityMap.objectForKey(entityID);
            entity.executeCommand(request.getCommand());
        };
        CoreEntityManager.prototype.processCommand = function (command) {
            if (command.getName() == CoreConstants.kCreateCommandName) {
                this.processCreateCommandParameters(command.getParameters());
                return;
            }
            if (command.getName() === CoreConstants.kRemoveEntityCommandName) {
                this.processRemoveCommandParameters(command.getParameters());
                return;
            }
            alert('unkown command sent to entity manager ' + command.toJson());
        };
        CoreEntityManager.prototype.processRemoveCommandParameters = function (params) {
            var entityID;
            entityID = params.objectForKey(CoreConstants.kCommandEntityIdKey);
            this.entityMap = Utilities.Dictionary.dictByRemovingKey(this.entityMap, entityID);
        };
        CoreEntityManager.prototype.processCreateCommandParameters = function (params) {
            var entityID;
            var type;
            var spawnX;
            var spawnY;
            var color;
            entityID = params.objectForKey(CoreConstants.kCreatedEntityIdKey);
            type = params.objectForKey(CoreConstants.kEntityTypeKey);
            spawnX = params.objectForKey(CoreConstants.kCreatedEntitySpawnPointX);
            spawnY = params.objectForKey(CoreConstants.kCreatedEntitySpawnPointY);
            color = params.objectForKey(CoreConstants.kCreatedEntityColor);
            if (entityID == null || type == null || spawnX == null || spawnY == null || color == null) {
                alert('null entity id/spawn/type/color in create command!');
            }
            var entity;
            var pos = new Utilities.CellPoint(spawnX, spawnY);
            if (type == CoreConstants.kGatheringEntityType) {
                entity = CoreEntities.GatheringEntity.createGatheringEntityWithId(entityID, this.mapManager, this.commandSender, this.renderingManager, pos, color);
            }
            if (type == CoreConstants.kResourceEntityType) {
                entity = CoreEntities.ResourceEntity.createResourceEntityWithId(entityID, this.mapManager, this.commandSender, this.renderingManager, pos, color);
            }
            if (type == CoreConstants.kSoldierEntityType) {
                entity = CoreEntities.SoldierEntity.createSoldierEntityWithId(entityID, this.mapManager, this.commandSender, this.renderingManager, pos, color);
            }
            var point = new Utilities.CellPoint(spawnX, spawnY);
            if (this.entityMap.objectForKey(entityID) != null) {
                return;
            }
            this.entityMap.setObjectForKey(entity, entityID);
            this.mapManager.setEntityAtCellPoint(entityID, pos);
        };
        CoreEntityManager.prototype.queueCommand = function (command) {
            this.queuedCommands.push(command);
        };
        return CoreEntityManager;
    })();
    CoreImplementations.CoreEntityManager = CoreEntityManager;
    var CoreRequestSender = (function () {
        function CoreRequestSender() {
        }
        CoreRequestSender.prototype.setRequestReceiver = function (handler) {
            this.socketHandler = handler;
        };
        CoreRequestSender.prototype.sendRequest = function (request) {
            var reqString = request.toJson();
            if (this.socketHandler != null) {
                this.socketHandler.sendMessage(reqString);
            }
        };
        CoreRequestSender.prototype.setRequestReceiverLocal = function (recv) {
            this.receiver = recv;
        };
        CoreRequestSender.prototype.sendRequestLocally = function (request) {
            this.receiver.queueJsonRequest(request.toJson());
        };
        return CoreRequestSender;
    })();
    CoreImplementations.CoreRequestSender = CoreRequestSender;
    var CoreRequestReceiver = (function () {
        function CoreRequestReceiver(entityManArg, userManArg, centralSettingsArg, gameArg) {
            this.queuedRequests = [];
            this.game = gameArg;
            this.centralSettings = centralSettingsArg;
            this.userManager = userManArg;
            this.entityManager = entityManArg;
        }
        CoreRequestReceiver.prototype.setSender = function (senderArg) {
            this.sender = senderArg;
        };
        CoreRequestReceiver.prototype.startSendingRaf = function () {
            this.sender.sendMessage("RAF");
        };
        CoreRequestReceiver.prototype.setupWithTheSettings = function (obj) {
            var centralSettingsObj = obj[CoreConstants.kCentralSettingsDictKey];
            this.centralSettings.initWithObject(centralSettingsObj);
            var resPos = obj[CoreConstants.kResourcePositionsDictKey];
            for (var i = 0; i < resPos.length; i++) {
                var resObj = resPos[i];
                var line = resObj[CoreConstants.kResourceLineDictKey];
                var col = resObj[CoreConstants.kResourceColumnDictKey];
                var id = resObj["idEnt"];
                console.log(line + ", " + col + ", " + id);
                var createResourceCommand;
                createResourceCommand = CoreCommandFactory.createCreateEntityCommand(id, CoreConstants.kResourceEntityType, line, col, Utilities.RGBColor.YELLOW);
                this.entityManager.queueCommand(createResourceCommand);
            }
        };
        CoreRequestReceiver.prototype.processStringRequest = function (str) {
            if (str == "FRAME") {
                this.game.update();
                this.sender.sendMessage("RAF");
                return;
            }
            if (!this.centralSettings.isInitialized()) {
                var obj = JSON.parse(str);
                this.setupWithTheSettings(obj);
            }
            else {
                this.processJSONRequest(str);
            }
        };
        CoreRequestReceiver.prototype.processRequest = function (request) {
            if (request.getTargetType() == CoreConstants.kRequestTargetTypeEntityManager) {
                this.entityManager.queueCommand(request.getCommand());
            }
            if (request.getTargetType() == CoreConstants.kRequestTargetTypeEntity) {
                this.entityManager.processEntityRequest(request);
            }
            if (request.getTargetType() === CoreConstants.kRequestTargetTypeUserManager) {
                this.userManager.executeCommand(request.getCommand());
            }
        };
        CoreRequestReceiver.prototype.processJSONRequest = function (jsonReq) {
            var request = DTOs.Request.createFromJson(jsonReq);
            this.processRequest(request);
        };
        CoreRequestReceiver.prototype.queueJsonRequest = function (jsonReq) {
            this.queuedRequests.push(jsonReq);
        };
        CoreRequestReceiver.prototype.update = function (time) {
            for (var i = 0; i < this.queuedRequests.length; i++) {
                var jsonReq = this.queuedRequests[i];
                this.processJSONRequest(jsonReq);
            }
            this.queuedRequests = [];
        };
        return CoreRequestReceiver;
    })();
    CoreImplementations.CoreRequestReceiver = CoreRequestReceiver;
})(CoreImplementations || (CoreImplementations = {}));
//# sourceMappingURL=CoreImplementations.js.map