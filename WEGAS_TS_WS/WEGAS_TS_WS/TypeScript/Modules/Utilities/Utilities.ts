/**
 * Created by Costinel on 5/30/15.
 */
module Utilities
{
    export  class Dictionary
    {
        private pojo : any = {};
        private objectsArray : Array<any>;
        private keysArray : Array<string>;
        constructor() {
            this.objectsArray = [];
            this.keysArray = [];
        }


        public getKeysArray() : string[]
        {
            return this.keysArray;
        }

        public toPojo() : any
        {
            return this.pojo;
        }

        public  setObjectForKey(obj : any, key : string) : void
        {
            var i = this.indexOfKey(key);
            if (i >= 0) {
                this.objectsArray[i] = obj;
            } else {
                this.keysArray.push(key);
                this.objectsArray.push(obj);
            }
            this.pojo[key] = obj;
        }

        public objectForKey(key : string) : any
        {
            var index = this.indexOfKey(key);
            if(index < 0)
            {
                return null;
            }
            else
            {
                return this.objectsArray[index];
            }
        }

        private indexOfKey(key : string) : number
        {
            for(var i = 0; i< this.keysArray.length; i++)
            {
                if (this.keysArray[i] == key)
                {
                    return i;
                }
            }

            return -1;
        }


        public overwriteExistingByImportingFrom(dict : Dictionary)
        {
            var keys : string[] = dict.getKeysArray();
            for(var i = 0; i <keys.length; i++)
            {
                var key : string = keys[i];

                if(this.indexOfKey(key) >= 0)
                {
                    this.setObjectForKey(dict.objectForKey(key), key);
                }
            }
        }


        public static dictByRemovingKey(dict: Utilities.Dictionary, keyArg : string) : Dictionary
        {
            var oldDict : Utilities.Dictionary;
            oldDict = dict;
            var newDict : Utilities.Dictionary;
            newDict = new Utilities.Dictionary();

            var keys : string[] = oldDict.getKeysArray();
            for(var i =0; i<keys.length; i++)
            {
                var key = keys[i];
                if (key != keyArg)
                {
                    newDict.setObjectForKey(oldDict.objectForKey(key), key);
                }
            }

            oldDict = null;

            return newDict;
        }
    }

    export class CellPoint
    {
        private line : number;
        private column :number;

        public getLine() : number
        {
            return this.line;
        }

        public getColumn() : number
        {
            return this.column;
        }

        constructor(lineArg : number, columnArg : number)
        {
            this.line = lineArg;
            this.column = columnArg;
        }



        public static areCellsClose(cell1 : CellPoint, cell2 : CellPoint) : boolean
        {
            var lineDiff = cell1.getLine() - cell2.getLine();
            var colDiff = cell1.getColumn() - cell2.getColumn();
            //console.log('coll diff ' + colDiff + ' line diff ' + lineDiff);
            return ((Math.abs(lineDiff) <= 2) && (Math.abs(colDiff) <= 2));
        }
    }

    export class RGBColor
    {
        r : number;
        g : number;
        b : number;

        constructor(argR : number, argG : number, argB : number)
        {
            this.r = argR;
            this.g = argG;
            this.b = argB;
        }

        public static YELLOW = "#FFFF00";
        public static RED = "#FF0000";
        public static GREEN = "#00FF00";
        public static BLUE = "#0000FF";
        public static WHITE = "#FFFFFF";
        public static BLACK = "#000000";
        public static CYAM = "#01DFD7";
        public static MAGENTA = "#FF00FF";


    }
}