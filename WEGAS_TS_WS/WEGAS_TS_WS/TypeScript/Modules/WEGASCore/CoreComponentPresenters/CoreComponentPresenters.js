/**
 * Created by costin on 02.06.2015.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../Utilities/Utilities.ts" />
/// <reference path="../CoreClasses/CoreClasses.ts" />
/// <reference path="../CoreConstants/CoreConstants.ts" />
/// <reference path="../CoreImplementations/CoreImplementations.ts" />
var CoreComponentPresenters;
(function (CoreComponentPresenters) {
    var IdleComponentPresenter = (function (_super) {
        __extends(IdleComponentPresenter, _super);
        function IdleComponentPresenter() {
            _super.apply(this, arguments);
        }
        IdleComponentPresenter.prototype.beginPresenting = function () {
            this.lastTimeCalled = 0;
        };
        IdleComponentPresenter.prototype.update = function (time) {
            var numX;
            var numY;
            numX = this.attributesDict.objectForKey(CoreConstants.kPositionXParameterKey);
            numY = this.attributesDict.objectForKey(CoreConstants.kPositionYParameterKey);
            var cp = new Utilities.CellPoint(numX, numY);
            var commandArgs;
            commandArgs = new Utilities.Dictionary();
            commandArgs.setObjectForKey(numX, CoreConstants.kDrawCellPointXKey);
            commandArgs.setObjectForKey(numY, CoreConstants.kDrawCellPointYKey);
            commandArgs.setObjectForKey(this.color, CoreConstants.kDrawColorKey);
            var command;
            command = new DTOs.Command(CoreConstants.kDrawRectangleElement, commandArgs);
            this.renderManager.queueDrawCommand(command);
        };
        return IdleComponentPresenter;
    })(CoreClasses.WegasComponentPresenter);
    CoreComponentPresenters.IdleComponentPresenter = IdleComponentPresenter;
    var MovementComponentPresenter = (function (_super) {
        __extends(MovementComponentPresenter, _super);
        function MovementComponentPresenter() {
            _super.apply(this, arguments);
        }
        return MovementComponentPresenter;
    })(IdleComponentPresenter);
    CoreComponentPresenters.MovementComponentPresenter = MovementComponentPresenter;
    var AttackedComponentPresenter = (function (_super) {
        __extends(AttackedComponentPresenter, _super);
        function AttackedComponentPresenter(id, attributes, renderer, color) {
            _super.call(this, id, attributes, null, color, renderer);
        }
        AttackedComponentPresenter.prototype.update = function (time) {
            var oldColor = this.color;
            this.color = Utilities.RGBColor.WHITE;
            _super.prototype.update.call(this, time);
            this.color = oldColor;
        };
        return AttackedComponentPresenter;
    })(IdleComponentPresenter);
    CoreComponentPresenters.AttackedComponentPresenter = AttackedComponentPresenter;
    var GatheredComponentPresenter = (function (_super) {
        __extends(GatheredComponentPresenter, _super);
        function GatheredComponentPresenter(id, attributes, renderer, color) {
            _super.call(this, id, attributes, null, color, renderer);
        }
        GatheredComponentPresenter.prototype.update = function (time) {
            var oldColor = this.color;
            this.color = Utilities.RGBColor.MAGENTA;
            _super.prototype.update.call(this, time);
            this.color = oldColor;
        };
        return GatheredComponentPresenter;
    })(IdleComponentPresenter);
    CoreComponentPresenters.GatheredComponentPresenter = GatheredComponentPresenter;
    var AttackerComponentPresenter = (function (_super) {
        __extends(AttackerComponentPresenter, _super);
        function AttackerComponentPresenter(id, attributes, renderer, color) {
            _super.call(this, id, attributes, null, color, renderer);
        }
        AttackerComponentPresenter.prototype.changeAppearance = function (time) {
            var numX;
            var numY;
            numX = this.attributesDict.objectForKey(CoreConstants.kPositionXParameterKey);
            numY = this.attributesDict.objectForKey(CoreConstants.kPositionYParameterKey);
            var cp = new Utilities.CellPoint(numX, numY);
            var hisPoint;
            hisPoint = this.attributesDict.objectForKey(CoreConstants.kAttackedEntityPosition);
            if (hisPoint == null) {
                alert('his point not set !');
            }
            var commandArgs;
            commandArgs = new Utilities.Dictionary();
            commandArgs.setObjectForKey("#000000", CoreConstants.kDrawColorKey);
            commandArgs.setObjectForKey(numX, CoreConstants.kDrawLineX1);
            commandArgs.setObjectForKey(numY, CoreConstants.kDrawLineY1);
            commandArgs.setObjectForKey(hisPoint.getLine(), CoreConstants.kDrawLineX2);
            commandArgs.setObjectForKey(hisPoint.getColumn(), CoreConstants.kDrawLineY2);
            var command;
            command = new DTOs.Command(CoreConstants.kDrawLineElement, commandArgs);
            this.renderManager.queueDrawCommand(command);
        };
        return AttackerComponentPresenter;
    })(IdleComponentPresenter);
    CoreComponentPresenters.AttackerComponentPresenter = AttackerComponentPresenter;
    var DieComponentPresenter = (function (_super) {
        __extends(DieComponentPresenter, _super);
        function DieComponentPresenter() {
            _super.apply(this, arguments);
        }
        DieComponentPresenter.prototype.update = function (time) {
            var oldColor = this.color;
            this.color = Utilities.RGBColor.BLACK;
            _super.prototype.update.call(this, time);
            this.color = oldColor;
        };
        return DieComponentPresenter;
    })(IdleComponentPresenter);
    CoreComponentPresenters.DieComponentPresenter = DieComponentPresenter;
    var GathererComponentPresenter = (function (_super) {
        __extends(GathererComponentPresenter, _super);
        function GathererComponentPresenter(id, attributes, renderer, color) {
            _super.call(this, id, attributes, null, color, renderer);
        }
        GathererComponentPresenter.prototype.changeAppearance = function (time) {
            var numX;
            var numY;
            numX = this.attributesDict.objectForKey(CoreConstants.kPositionXParameterKey);
            numY = this.attributesDict.objectForKey(CoreConstants.kPositionYParameterKey);
            var cp = new Utilities.CellPoint(numX, numY);
            var hisPoint;
            hisPoint = this.attributesDict.objectForKey(CoreConstants.kGatheredEntityPosition);
            if (hisPoint == null) {
                alert('his point not set !');
            }
            var commandArgs;
            commandArgs = new Utilities.Dictionary();
            commandArgs.setObjectForKey("#FF00FF", CoreConstants.kDrawColorKey);
            commandArgs.setObjectForKey(numX, CoreConstants.kDrawLineX1);
            commandArgs.setObjectForKey(numY, CoreConstants.kDrawLineY1);
            commandArgs.setObjectForKey(hisPoint.getLine(), CoreConstants.kDrawLineX2);
            commandArgs.setObjectForKey(hisPoint.getColumn(), CoreConstants.kDrawLineY2);
            var command;
            command = new DTOs.Command(CoreConstants.kDrawLineElement, commandArgs);
            this.renderManager.queueDrawCommand(command);
        };
        return GathererComponentPresenter;
    })(IdleComponentPresenter);
    CoreComponentPresenters.GathererComponentPresenter = GathererComponentPresenter;
})(CoreComponentPresenters || (CoreComponentPresenters = {}));
//# sourceMappingURL=CoreComponentPresenters.js.map