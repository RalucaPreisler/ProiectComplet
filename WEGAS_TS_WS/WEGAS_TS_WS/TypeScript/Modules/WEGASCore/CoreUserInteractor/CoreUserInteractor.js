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
var CoreUserInteractor = (function () {
    function CoreUserInteractor(canvasArg) {
        this.canvas = canvasArg;
        this.attackBtn = document.getElementById("attackBtn");
        this.moveBtn = document.getElementById("moveBtn");
        this.gatherBtn = document.getElementById("gatherBtn");
        this.createSoldierBtn = document.getElementById("crateSoldierBtn");
        this.createGathererBtn = document.getElementById("createGathererBtn");
        var interactor = this;
        this.attackBtn.onclick = function () {
            interactor.attackButtonPressed();
        };
        this.moveBtn.onclick = function () {
            interactor.movePressed();
        };
        this.gatherBtn.onclick = function () {
            interactor.gatherPressed();
        };
        this.createGathererBtn.onclick = function () {
            interactor.createGathererClicked();
        };
        this.createSoldierBtn.onclick = function () {
            interactor.createSoldierClicked();
        };
        this.canvas.addEventListener('click', function (ev) {
            interactor.mouseClicked(ev);
        }, false);
    }
    CoreUserInteractor.prototype.setCurrentState = function (state) {
        this.currentState = state;
    };
    CoreUserInteractor.prototype.attackButtonPressed = function () {
        this.currentState.attackBtnClicked();
    };
    CoreUserInteractor.prototype.movePressed = function () {
        this.currentState.moveBtnClicked();
    };
    CoreUserInteractor.prototype.gatherPressed = function () {
        this.currentState.gatherBtnClicked();
    };
    CoreUserInteractor.prototype.mouseClicked = function (ev) {
        var elemLeft = this.canvas.offsetLeft;
        var elemTop = this.canvas.offsetTop;
        var x = ev.pageX - elemLeft;
        var y = ev.pageY - elemTop;
        var cell;
        this.currentState.mouseCanvasClicked(x, y);
    };
    CoreUserInteractor.prototype.createSoldierClicked = function () {
        this.currentState.createSoldierBtnClicked();
    };
    CoreUserInteractor.prototype.createGathererClicked = function () {
        this.currentState.createGathererBtnClicked();
    };
    return CoreUserInteractor;
})();
//# sourceMappingURL=CoreUserInteractor.js.map