/**
 * Created by Costinel on 5/30/15.
 */
var Utilities;
(function (Utilities) {
    var Dictionary = (function () {
        function Dictionary() {
            this.pojo = {};
            this.objectsArray = [];
            this.keysArray = [];
        }
        Dictionary.prototype.getKeysArray = function () {
            return this.keysArray;
        };
        Dictionary.prototype.toPojo = function () {
            return this.pojo;
        };
        Dictionary.prototype.setObjectForKey = function (obj, key) {
            var i = this.indexOfKey(key);
            if (i >= 0) {
                this.objectsArray[i] = obj;
            }
            else {
                this.keysArray.push(key);
                this.objectsArray.push(obj);
            }
            this.pojo[key] = obj;
        };
        Dictionary.prototype.objectForKey = function (key) {
            var index = this.indexOfKey(key);
            if (index < 0) {
                return null;
            }
            else {
                return this.objectsArray[index];
            }
        };
        Dictionary.prototype.indexOfKey = function (key) {
            for (var i = 0; i < this.keysArray.length; i++) {
                if (this.keysArray[i] == key) {
                    return i;
                }
            }
            return -1;
        };
        Dictionary.prototype.overwriteExistingByImportingFrom = function (dict) {
            var keys = dict.getKeysArray();
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (this.indexOfKey(key) >= 0) {
                    this.setObjectForKey(dict.objectForKey(key), key);
                }
            }
        };
        Dictionary.dictByRemovingKey = function (dict, keyArg) {
            var oldDict;
            oldDict = dict;
            var newDict;
            newDict = new Utilities.Dictionary();
            var keys = oldDict.getKeysArray();
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key != keyArg) {
                    newDict.setObjectForKey(oldDict.objectForKey(key), key);
                }
            }
            oldDict = null;
            return newDict;
        };
        return Dictionary;
    })();
    Utilities.Dictionary = Dictionary;
    var CellPoint = (function () {
        function CellPoint(lineArg, columnArg) {
            this.line = lineArg;
            this.column = columnArg;
        }
        CellPoint.prototype.getLine = function () {
            return this.line;
        };
        CellPoint.prototype.getColumn = function () {
            return this.column;
        };
        CellPoint.areCellsClose = function (cell1, cell2) {
            var lineDiff = cell1.getLine() - cell2.getLine();
            var colDiff = cell1.getColumn() - cell2.getColumn();
            //console.log('coll diff ' + colDiff + ' line diff ' + lineDiff);
            return ((Math.abs(lineDiff) <= 2) && (Math.abs(colDiff) <= 2));
        };
        return CellPoint;
    })();
    Utilities.CellPoint = CellPoint;
    var RGBColor = (function () {
        function RGBColor(argR, argG, argB) {
            this.r = argR;
            this.g = argG;
            this.b = argB;
        }
        RGBColor.YELLOW = "#FFFF00";
        RGBColor.RED = "#FF0000";
        RGBColor.GREEN = "#00FF00";
        RGBColor.BLUE = "#0000FF";
        RGBColor.WHITE = "#FFFFFF";
        RGBColor.BLACK = "#000000";
        RGBColor.CYAM = "#01DFD7";
        RGBColor.MAGENTA = "#FF00FF";
        return RGBColor;
    })();
    Utilities.RGBColor = RGBColor;
})(Utilities || (Utilities = {}));
//# sourceMappingURL=Utilities.js.map