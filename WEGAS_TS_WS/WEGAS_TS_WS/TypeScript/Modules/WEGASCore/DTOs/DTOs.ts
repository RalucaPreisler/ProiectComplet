/**
 * Created by Costinel on 5/30/15.
 */


/// <reference path = "../../Utilities/Utilities.ts" />
/// <reference path = "../CoreConstants/CoreConstants.ts" />

module DTOs
{
    export class Command {
        private  parameters:Utilities.Dictionary;
        private name : string;

        constructor(nameArg:string, paramsArg:Utilities.Dictionary) {
            this.name = nameArg;
            this.parameters = paramsArg;
        }

        public getName():string {
            return this.name;
        }

        public getParameters():Utilities.Dictionary {
            return this.parameters;
        }

        public toJson():string {
            var pojo = {};

            if(this.parameters != null)
            {
                pojo[CoreConstants.kCommandParametersKey] = this.parameters.toPojo();
            }

            pojo[CoreConstants.kCommandNameKey] = this.getName();
            return JSON.stringify(pojo);
        }

        public static createFromJSON(json : string):Command
        {
            var eID : string;
            var name : string;
            var params : Utilities.Dictionary;
            params = new Utilities.Dictionary();

            var obj = JSON.parse(json);
            name = obj[CoreConstants.kCommandNameKey];
            var dictObj = obj[CoreConstants.kCommandParametersKey];


            for (var propertyName in dictObj)
            {
                var anyobj : any = dictObj[propertyName];
                params.setObjectForKey(anyobj, propertyName);
            }

            return new Command(name, params);
        }
    }



    export class Request
    {
        private command : Command;
        private targetType : string;
        private targetID : string;

        public getTargetId() : string
        {
            return this.targetID;
        }

        public getTargetType() : string
        {
            return this.targetType;
        }

        public getCommand() : DTOs.Command
        {
            return this.command;
        }

        constructor(targetTypeArg : string, targetIDArg: string, commandArg : Command)
        {
            this.command = commandArg;
            this.targetType = targetTypeArg;
            this.targetID = targetIDArg;
        }


        public toJson() : string
        {
            var pojo = {};
            pojo[CoreConstants.kRequestTargetIdKey] = this.targetID;
            pojo[CoreConstants.kRequestTargetTypeKey] = this.targetType;


                var jsonCommandString = this.command.toJson();
                pojo[CoreConstants.kDispatchedCommandJSonStringKey] = jsonCommandString;



            var stringJSON : string;
            stringJSON = JSON.stringify(pojo);

            return stringJSON;
        }

        public static createFromJson(json : string) : Request
        {
            console.log(json);
            var obj = JSON.parse(json);
            var type : string;
            var targetid : string;

            targetid = <string>obj[CoreConstants.kRequestTargetIdKey];
            type = <string>obj[CoreConstants.kRequestTargetTypeKey];
            var jsonCommandString = <string>obj[CoreConstants.kDispatchedCommandJSonStringKey];
            var command = Command.createFromJSON(jsonCommandString);

            var request : Request;
            request = new Request(type, targetid,command);
            return request;
        }
    }

}