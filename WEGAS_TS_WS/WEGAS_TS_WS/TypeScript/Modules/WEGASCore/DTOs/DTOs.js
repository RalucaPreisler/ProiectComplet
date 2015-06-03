/**
 * Created by Costinel on 5/30/15.
 */
/// <reference path = "../../Utilities/Utilities.ts" />
/// <reference path = "../CoreConstants/CoreConstants.ts" />
var DTOs;
(function (DTOs) {
    var Command = (function () {
        function Command(nameArg, paramsArg) {
            this.name = nameArg;
            this.parameters = paramsArg;
        }
        Command.prototype.getName = function () {
            return this.name;
        };
        Command.prototype.getParameters = function () {
            return this.parameters;
        };
        Command.prototype.toJson = function () {
            var pojo = {};
            if (this.parameters != null) {
                pojo[CoreConstants.kCommandParametersKey] = this.parameters.toPojo();
            }
            pojo[CoreConstants.kCommandNameKey] = this.getName();
            return JSON.stringify(pojo);
        };
        Command.createFromJSON = function (json) {
            var eID;
            var name;
            var params;
            params = new Utilities.Dictionary();
            var obj = JSON.parse(json);
            name = obj[CoreConstants.kCommandNameKey];
            var dictObj = obj[CoreConstants.kCommandParametersKey];
            for (var propertyName in dictObj) {
                var anyobj = dictObj[propertyName];
                params.setObjectForKey(anyobj, propertyName);
            }
            return new Command(name, params);
        };
        return Command;
    })();
    DTOs.Command = Command;
    var Request = (function () {
        function Request(targetTypeArg, targetIDArg, commandArg) {
            this.command = commandArg;
            this.targetType = targetTypeArg;
            this.targetID = targetIDArg;
        }
        Request.prototype.getTargetId = function () {
            return this.targetID;
        };
        Request.prototype.getTargetType = function () {
            return this.targetType;
        };
        Request.prototype.getCommand = function () {
            return this.command;
        };
        Request.prototype.toJson = function () {
            var pojo = {};
            pojo[CoreConstants.kRequestTargetIdKey] = this.targetID;
            pojo[CoreConstants.kRequestTargetTypeKey] = this.targetType;
            var jsonCommandString = this.command.toJson();
            pojo[CoreConstants.kDispatchedCommandJSonStringKey] = jsonCommandString;
            var stringJSON;
            stringJSON = JSON.stringify(pojo);
            return stringJSON;
        };
        Request.createFromJson = function (json) {
            console.log(json);
            var obj = JSON.parse(json);
            var type;
            var targetid;
            targetid = obj[CoreConstants.kRequestTargetIdKey];
            type = obj[CoreConstants.kRequestTargetTypeKey];
            var jsonCommandString = obj[CoreConstants.kDispatchedCommandJSonStringKey];
            var command = Command.createFromJSON(jsonCommandString);
            var request;
            request = new Request(type, targetid, command);
            return request;
        };
        return Request;
    })();
    DTOs.Request = Request;
})(DTOs || (DTOs = {}));
//# sourceMappingURL=DTOs.js.map