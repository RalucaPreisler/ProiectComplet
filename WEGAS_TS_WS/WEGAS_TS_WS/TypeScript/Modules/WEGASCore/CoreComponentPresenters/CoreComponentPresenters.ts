/**
 * Created by costin on 02.06.2015.
 */

/// <reference path="../../Utilities/Utilities.ts" />
/// <reference path="../CoreClasses/CoreClasses.ts" />
/// <reference path="../CoreConstants/CoreConstants.ts" />
/// <reference path="../CoreImplementations/CoreImplementations.ts" />

module CoreComponentPresenters
{

    export class IdleComponentPresenter extends CoreClasses.WegasComponentPresenter
    {
        private lastTimeCalled : number;

        public beginPresenting()
        {
            this.lastTimeCalled = 0;
        }

        public update(time : number)
        {
            var numX : number;
            var numY : number;

            numX = this.attributesDict.objectForKey(CoreConstants.kPositionXParameterKey);
            numY = this.attributesDict.objectForKey(CoreConstants.kPositionYParameterKey);

            var cp = new Utilities.CellPoint(numX, numY);

            var commandArgs : Utilities.Dictionary;
            commandArgs = new Utilities.Dictionary();
            commandArgs.setObjectForKey(numX, CoreConstants.kDrawCellPointXKey);
            commandArgs.setObjectForKey(numY, CoreConstants.kDrawCellPointYKey);
            commandArgs.setObjectForKey(this.color, CoreConstants.kDrawColorKey);

            var command : DTOs.Command;
            command = new DTOs.Command(CoreConstants.kDrawRectangleElement, commandArgs);
            this.renderManager.queueDrawCommand(command);
        }


    }

    export class MovementComponentPresenter extends IdleComponentPresenter
    {

    }


    export class AttackedComponentPresenter extends IdleComponentPresenter
    {

        constructor(id : string,attributes : Utilities.Dictionary, renderer : CoreClasses.ICentralRenderingManager,
                    color : string)
        {
            super(id,attributes,null,color,renderer);
        }

        public update(time : number)
        {
            var oldColor = this.color;
            this.color = Utilities.RGBColor.WHITE;
            super.update(time);
            this.color = oldColor;

        }
    }

    export class GatheredComponentPresenter extends IdleComponentPresenter
    {

        constructor(id : string,attributes : Utilities.Dictionary, renderer : CoreClasses.ICentralRenderingManager,
                    color : string)
        {
            super(id,attributes,null,color,renderer);
        }

        public update(time : number)
        {
            var oldColor = this.color;
            this.color = Utilities.RGBColor.MAGENTA;
            super.update(time);
            this.color = oldColor;

        }
    }

    export class AttackerComponentPresenter extends IdleComponentPresenter
    {
        constructor(id : string,attributes : Utilities.Dictionary, renderer : CoreClasses.ICentralRenderingManager,
        color : string)
        {
            super(id,attributes,null,color,renderer);
        }

        public changeAppearance(time : number)
        {
            var numX : number;
            var numY : number;

            numX = this.attributesDict.objectForKey(CoreConstants.kPositionXParameterKey);
            numY = this.attributesDict.objectForKey(CoreConstants.kPositionYParameterKey);

            var cp = new Utilities.CellPoint(numX, numY);

            var hisPoint : Utilities.CellPoint;
            hisPoint = this.attributesDict.objectForKey(CoreConstants.kAttackedEntityPosition);

            if(hisPoint == null)
            {
                alert('his point not set !');
            }



            var commandArgs : Utilities.Dictionary;
            commandArgs = new Utilities.Dictionary();
            commandArgs.setObjectForKey("#000000", CoreConstants.kDrawColorKey);

            commandArgs.setObjectForKey(numX, CoreConstants.kDrawLineX1);
            commandArgs.setObjectForKey(numY, CoreConstants.kDrawLineY1);

            commandArgs.setObjectForKey(hisPoint.getLine(), CoreConstants.kDrawLineX2);
            commandArgs.setObjectForKey(hisPoint.getColumn(), CoreConstants.kDrawLineY2);


            var command : DTOs.Command;
            command = new DTOs.Command(CoreConstants.kDrawLineElement, commandArgs);
            this.renderManager.queueDrawCommand(command);
        }

    }


    export class DieComponentPresenter extends  IdleComponentPresenter
    {
        public update(time : number)
        {
            var oldColor = this.color;
            this.color = Utilities.RGBColor.BLACK;
            super.update(time);
            this.color = oldColor;
        }
    }


    export class GathererComponentPresenter extends IdleComponentPresenter
    {
        constructor(id : string,attributes : Utilities.Dictionary, renderer : CoreClasses.ICentralRenderingManager,
                    color : string)
        {
            super(id,attributes,null,color,renderer);
        }

        public changeAppearance(time : number)
        {
            var numX : number;
            var numY : number;

            numX = this.attributesDict.objectForKey(CoreConstants.kPositionXParameterKey);
            numY = this.attributesDict.objectForKey(CoreConstants.kPositionYParameterKey);

            var cp = new Utilities.CellPoint(numX, numY);

            var hisPoint : Utilities.CellPoint;
            hisPoint = this.attributesDict.objectForKey(CoreConstants.kGatheredEntityPosition);

            if(hisPoint == null)
            {
                alert('his point not set !');
            }



            var commandArgs : Utilities.Dictionary;
            commandArgs = new Utilities.Dictionary();
            commandArgs.setObjectForKey("#FF00FF", CoreConstants.kDrawColorKey);

            commandArgs.setObjectForKey(numX, CoreConstants.kDrawLineX1);
            commandArgs.setObjectForKey(numY, CoreConstants.kDrawLineY1);

            commandArgs.setObjectForKey(hisPoint.getLine(), CoreConstants.kDrawLineX2);
            commandArgs.setObjectForKey(hisPoint.getColumn(), CoreConstants.kDrawLineY2);


            var command : DTOs.Command;
            command = new DTOs.Command(CoreConstants.kDrawLineElement, commandArgs);
            this.renderManager.queueDrawCommand(command);
        }

    }

}
