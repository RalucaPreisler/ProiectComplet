/**
 * Created by costin on 02.06.2015.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path = "../CoreClasses/CoreClasses.ts" />
/// <reference path = "../../Utilities/Utilities.ts" />
/// <reference path = "../CoreConstants/CoreConstants.ts" />
/// <reference path = "../../../Extern/AStarTS/ts/astar.ts" />
/// <reference path = "../CoreComponents/CoreComponents.ts" />
/// <reference path = "../CoreComponentPresenters/CoreComponentPresenters.ts" />
/// <reference path = "../CoreCommandFactory/CoreCommandFactory.ts" />
var CoreEntities;
(function (CoreEntities) {
    var GatheringEntity = (function (_super) {
        __extends(GatheringEntity, _super);
        function GatheringEntity() {
            _super.apply(this, arguments);
        }
        GatheringEntity.createGatheringEntityWithId = function (id, mapManager, sender, renderer, position, color) {
            var entity;
            entity = CoreEntities.createBasicEntityWithIdleAnd(id, mapManager, sender, renderer, position, color);
            CoreEntities.addMovementComponentToEntity(entity, id, mapManager, sender, renderer, position, color);
            CoreEntities.addAttackedComponentToEntity(entity, sender, renderer, color);
            CoreEntities.addGatherComponentToEntity(entity, sender, mapManager, renderer, color);
            return entity;
        };
        return GatheringEntity;
    })(CoreClasses.WegasEntity);
    CoreEntities.GatheringEntity = GatheringEntity;
    var ResourceEntity = (function (_super) {
        __extends(ResourceEntity, _super);
        function ResourceEntity() {
            _super.apply(this, arguments);
        }
        ResourceEntity.createResourceEntityWithId = function (id, mapManager, sender, renderer, position, color) {
            var entity;
            entity = CoreEntities.createBasicEntityWithIdleAnd(id, mapManager, sender, renderer, position, color);
            CoreEntities.addGatheredComponentToEntity(entity, sender, renderer, color);
            return entity;
        };
        return ResourceEntity;
    })(CoreClasses.WegasEntity);
    CoreEntities.ResourceEntity = ResourceEntity;
    var SoldierEntity = (function (_super) {
        __extends(SoldierEntity, _super);
        function SoldierEntity() {
            _super.apply(this, arguments);
        }
        SoldierEntity.createSoldierEntityWithId = function (id, mapManager, sender, renderer, position, color) {
            var entity;
            entity = CoreEntities.createBasicEntityWithIdleAnd(id, mapManager, sender, renderer, position, color);
            CoreEntities.addMovementComponentToEntity(entity, id, mapManager, sender, renderer, position, color);
            CoreEntities.addAttackedComponentToEntity(entity, sender, renderer, color);
            CoreEntities.addAttackComponentToEntity(entity, sender, mapManager, renderer, color);
            return entity;
        };
        return SoldierEntity;
    })(CoreClasses.WegasEntity);
    CoreEntities.SoldierEntity = SoldierEntity;
    function createBasicEntityWithIdleAnd(id, mapManager, sender, renderer, position, color) {
        var entity;
        var posAttr = new Utilities.Dictionary();
        posAttr.setObjectForKey(position.getLine(), CoreConstants.kPositionXParameterKey);
        posAttr.setObjectForKey(position.getColumn(), CoreConstants.kPositionYParameterKey);
        var idleComponent;
        var idleComponentPresenter;
        idleComponentPresenter = new CoreComponentPresenters.IdleComponentPresenter(id, posAttr, sender, color, renderer);
        idleComponent = new CoreComponents.IdleComponent(id, posAttr, idleComponentPresenter, sender);
        entity = new CoreClasses.WegasEntity(id, [idleComponent], posAttr);
        var idleCommand;
        idleCommand = CoreCommandFactory.createIdleCommand();
        entity.executeCommand(idleCommand);
        return entity;
    }
    CoreEntities.createBasicEntityWithIdleAnd = createBasicEntityWithIdleAnd;
    function addMovementComponentToEntity(entity, id, mapManager, sender, renderer, position, color) {
        var movePresenter;
        movePresenter = new CoreComponentPresenters.MovementComponentPresenter(id, entity.getAttributes(), sender, color, renderer);
        var moveComponent;
        moveComponent = new CoreComponents.MoveComponent(id, entity.getAttributes(), movePresenter, sender, mapManager);
        moveComponent.setTimeSpeed(1000);
        entity.addComponent(moveComponent);
    }
    CoreEntities.addMovementComponentToEntity = addMovementComponentToEntity;
    function addAttackedComponentToEntity(entity, sender, renderer, color) {
        var attackedPresenter;
        attackedPresenter = new CoreComponentPresenters.AttackedComponentPresenter(entity.getID(), entity.getAttributes(), renderer, color);
        var attackedComponent;
        attackedComponent = new CoreComponents.AttackedComponent(entity.getID(), entity.getAttributes(), attackedPresenter, sender);
        entity.addComponent(attackedComponent);
        entity.addAttributeForKey(70, CoreConstants.kHealthParameterKey);
        CoreEntities.addDieComponentToEntity(entity, sender, renderer, color);
    }
    CoreEntities.addAttackedComponentToEntity = addAttackedComponentToEntity;
    function addAttackComponentToEntity(entity, sender, map, renderer, color) {
        var attackedPresenter;
        attackedPresenter = new CoreComponentPresenters.AttackerComponentPresenter(entity.getID(), entity.getAttributes(), renderer, color);
        var attacker;
        attacker = new CoreComponents.AttackComponent(entity.getID(), entity.getAttributes(), attackedPresenter, sender);
        attacker.setMapManager(map);
        entity.addComponent(attacker);
        entity.addAttributeForKey(2, CoreConstants.kDamageParameterKey);
    }
    CoreEntities.addAttackComponentToEntity = addAttackComponentToEntity;
    function addDieComponentToEntity(entity, sender, renderer, color) {
        var diePresenter;
        diePresenter = new CoreComponentPresenters.DieComponentPresenter(entity.getID(), entity.getAttributes(), sender, color, renderer);
        var dieComponent;
        dieComponent = new CoreComponents.DieComponent(entity.getID(), entity.getAttributes(), diePresenter, sender);
        entity.addComponent(dieComponent);
    }
    CoreEntities.addDieComponentToEntity = addDieComponentToEntity;
    function addGatheredComponentToEntity(entity, sender, renderer, color) {
        var gatheredPresenter;
        gatheredPresenter = new CoreComponentPresenters.GatheredComponentPresenter(entity.getID(), entity.getAttributes(), renderer, color);
        var gatheredComponent;
        gatheredComponent = new CoreComponents.GatheredComponent(entity.getID(), entity.getAttributes(), gatheredPresenter, sender);
        entity.addComponent(gatheredComponent);
        entity.addAttributeForKey(90, CoreConstants.kResourceAmountKey);
        CoreEntities.addDieComponentToEntity(entity, sender, renderer, color);
    }
    CoreEntities.addGatheredComponentToEntity = addGatheredComponentToEntity;
    function addGatherComponentToEntity(entity, sender, map, renderer, color) {
        var gathererPresenter;
        gathererPresenter = new CoreComponentPresenters.GathererComponentPresenter(entity.getID(), entity.getAttributes(), renderer, color);
        var gatherer;
        gatherer = new CoreComponents.GatherComponent(entity.getID(), entity.getAttributes(), gathererPresenter, sender);
        gatherer.setMapManager(map);
        entity.addComponent(gatherer);
        entity.addAttributeForKey(2, CoreConstants.kDepletionAmountKey);
    }
    CoreEntities.addGatherComponentToEntity = addGatherComponentToEntity;
})(CoreEntities || (CoreEntities = {}));
//# sourceMappingURL=CoreEntities.js.map