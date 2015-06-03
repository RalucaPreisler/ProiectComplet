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

class CoreUserInteractor
{


    private canvas : HTMLCanvasElement;


    private currentState : CoreInteractorStates.BaseInteractorState;

    public attackBtn : HTMLButtonElement;
    public moveBtn : HTMLButtonElement;
    public gatherBtn : HTMLButtonElement;
    public createSoldierBtn : HTMLButtonElement;
    public createGathererBtn : HTMLButtonElement;

    public setCurrentState(state : CoreInteractorStates.BaseInteractorState)
    {
        this.currentState = state;
    }

    constructor(canvasArg : HTMLCanvasElement)
    {

        this.canvas = canvasArg;



        this.attackBtn = <HTMLButtonElement> document.getElementById("attackBtn");
        this.moveBtn = <HTMLButtonElement>document.getElementById("moveBtn");
        this.gatherBtn = <HTMLButtonElement>document.getElementById("gatherBtn");
        this.createSoldierBtn = <HTMLButtonElement>document.getElementById("crateSoldierBtn");
        this.createGathererBtn = <HTMLButtonElement>document.getElementById("createGathererBtn");

        var interactor = this;

        this.attackBtn.onclick = () => {
            interactor.attackButtonPressed();
        };

        this.moveBtn.onclick = () =>
        {
            interactor.movePressed();
        };

        this.gatherBtn.onclick = () =>
        {
          interactor.gatherPressed();
        };

        this.createGathererBtn.onclick = () =>
        {
          interactor.createGathererClicked();
        };

        this.createSoldierBtn.onclick = () =>
        {
          interactor.createSoldierClicked();
        };

        this.canvas.addEventListener('click',(ev:MouseEvent) =>
            {
                interactor.mouseClicked(ev);
            },
            false
        );

    }



    private attackButtonPressed()
    {
        this.currentState.attackBtnClicked();

    }

    private movePressed()
    {
        this.currentState.moveBtnClicked();

    }

    private gatherPressed()
    {
        this.currentState.gatherBtnClicked();
    }

    private mouseClicked(ev : MouseEvent)
    {
        var elemLeft = this.canvas.offsetLeft;
        var  elemTop = this.canvas.offsetTop;

        var x = ev.pageX - elemLeft;
        var y = ev.pageY - elemTop;



        var cell : Utilities.CellPoint;


        this.currentState.mouseCanvasClicked(x, y);

    }

    private createSoldierClicked()
    {
        this.currentState.createSoldierBtnClicked();
    }

    private createGathererClicked()
    {
        this.currentState.createGathererBtnClicked();
    }



}