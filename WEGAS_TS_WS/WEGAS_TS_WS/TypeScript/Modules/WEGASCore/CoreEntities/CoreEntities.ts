/**
 * Created by costin on 02.06.2015.
 */

    /// <reference path = "../CoreClasses/CoreClasses.ts" />
    /// <reference path = "../../Utilities/Utilities.ts" />
    /// <reference path = "../CoreConstants/CoreConstants.ts" />
    /// <reference path = "../../../Extern/AStarTS/ts/astar.ts" />
    /// <reference path = "../CoreComponents/CoreComponents.ts" />
    /// <reference path = "../CoreComponentPresenters/CoreComponentPresenters.ts" />
    /// <reference path = "../CoreCommandFactory/CoreCommandFactory.ts" />


module CoreEntities
{
    export class GatheringEntity extends CoreClasses.WegasEntity
    {

        public static createGatheringEntityWithId(id : string, mapManager : CoreClasses.ICentralMapManager,
         sender : CoreClasses.ICentralRequestSender, renderer:CoreClasses.ICentralRenderingManager,
        position : Utilities.CellPoint, color : string) : GatheringEntity
        {
            var  entity : CoreClasses.WegasEntity;

            entity = CoreEntities.createBasicEntityWithIdleAnd(id,mapManager,sender,renderer,position,color);
            CoreEntities.addMovementComponentToEntity(entity,id,mapManager,sender,renderer,position,color);
            CoreEntities.addAttackedComponentToEntity(entity,sender,renderer, color);

            CoreEntities.addGatherComponentToEntity(entity,sender,mapManager,renderer,color);

            return entity;
        }

    }

    export class ResourceEntity extends CoreClasses.WegasEntity
    {

        public static createResourceEntityWithId(id : string, mapManager : CoreClasses.ICentralMapManager,
           sender : CoreClasses.ICentralRequestSender, renderer:CoreClasses.ICentralRenderingManager,
        position : Utilities.CellPoint, color : string) : ResourceEntity
        {
            var  entity : CoreClasses.WegasEntity;

            entity = CoreEntities.createBasicEntityWithIdleAnd(id,mapManager,sender,renderer,position,color);
            CoreEntities.addGatheredComponentToEntity(entity,sender,renderer,color);

            return entity;
        }
    }


    export  class SoldierEntity extends CoreClasses.WegasEntity
    {

        public static createSoldierEntityWithId(id : string, mapManager : CoreClasses.ICentralMapManager,
        sender : CoreClasses.ICentralRequestSender, renderer:CoreClasses.ICentralRenderingManager,
        position : Utilities.CellPoint, color : string) : SoldierEntity
        {
            var  entity : CoreClasses.WegasEntity;

            entity = CoreEntities.createBasicEntityWithIdleAnd(id,mapManager,sender,renderer,position,color);
            CoreEntities.addMovementComponentToEntity(entity,id,mapManager,sender,renderer,position,color);
            CoreEntities.addAttackedComponentToEntity(entity,sender,renderer, color);
            CoreEntities.addAttackComponentToEntity(entity,sender,mapManager,renderer, color);

            return entity;
        }
    }






    export function createBasicEntityWithIdleAnd(id : string, mapManager : CoreClasses.ICentralMapManager,
                                          sender : CoreClasses.ICentralRequestSender, renderer:CoreClasses.ICentralRenderingManager,
                                          position : Utilities.CellPoint, color : string) : CoreClasses.WegasEntity
    {
        var entity : CoreClasses.WegasEntity;

        var posAttr = new Utilities.Dictionary();
        posAttr.setObjectForKey(position.getLine(),CoreConstants.kPositionXParameterKey);
        posAttr.setObjectForKey(position.getColumn(), CoreConstants.kPositionYParameterKey);

        var idleComponent : CoreComponents.IdleComponent;
        var idleComponentPresenter : CoreComponentPresenters.IdleComponentPresenter;

        idleComponentPresenter = new CoreComponentPresenters.IdleComponentPresenter(id,posAttr,sender,
            color,renderer
        );
        idleComponent = new CoreComponents.IdleComponent(id,posAttr,idleComponentPresenter,
            sender);


        entity = new CoreClasses.WegasEntity(id,[idleComponent],posAttr);

        var idleCommand : DTOs.Command;
        idleCommand = CoreCommandFactory.createIdleCommand();
        entity.executeCommand(idleCommand);
        return entity;
    }

    export function addMovementComponentToEntity(entity : CoreClasses.WegasEntity, id : string, mapManager : CoreClasses.ICentralMapManager,
                                                 sender : CoreClasses.ICentralRequestSender, renderer:CoreClasses.ICentralRenderingManager,
                                                 position : Utilities.CellPoint, color : string) : void

    {


        var movePresenter : CoreComponentPresenters.MovementComponentPresenter;
        movePresenter = new CoreComponentPresenters.MovementComponentPresenter(id, entity.getAttributes(),
        sender,color,renderer);

        var moveComponent :CoreComponents.MoveComponent;
        moveComponent = new CoreComponents.MoveComponent(id,entity.getAttributes(),movePresenter,sender,mapManager);


        moveComponent.setTimeSpeed(1000);

        entity.addComponent(moveComponent);
    }

    export function addAttackedComponentToEntity(entity : CoreClasses.WegasEntity,
                                                 sender : CoreClasses.ICentralRequestSender,
                                                 renderer : CoreClasses.ICentralRenderingManager,
                                                color : string)
    {

        var attackedPresenter : CoreComponentPresenters.AttackedComponentPresenter;
        attackedPresenter = new CoreComponentPresenters.AttackedComponentPresenter(entity.getID(),
                                            entity.getAttributes(),
                                            renderer, color);

        var attackedComponent : CoreComponents.AttackedComponent;
        attackedComponent = new CoreComponents.AttackedComponent(entity.getID(),entity.getAttributes(),
        attackedPresenter,sender);

        entity.addComponent(attackedComponent);
        entity.addAttributeForKey(70, CoreConstants.kHealthParameterKey);

        CoreEntities.addDieComponentToEntity(entity,sender,renderer,color);


    }


    export function addAttackComponentToEntity(entity: CoreClasses.WegasEntity,
                                               sender : CoreClasses.ICentralRequestSender,
                                                map : CoreClasses.ICentralMapManager,
                                                renderer : CoreClasses.ICentralRenderingManager,
                                                color : string)
    {

        var attackedPresenter : CoreComponentPresenters.AttackerComponentPresenter;
        attackedPresenter = new CoreComponentPresenters.AttackerComponentPresenter(entity.getID(),
        entity.getAttributes(),renderer, color);

        var attacker : CoreComponents.AttackComponent;
        attacker = new CoreComponents.AttackComponent(entity.getID(),entity.getAttributes(),
        attackedPresenter,sender);

        attacker.setMapManager(map);

        entity.addComponent(attacker);
        entity.addAttributeForKey(2,CoreConstants.kDamageParameterKey);


    }


    export function addDieComponentToEntity(entity : CoreClasses.WegasEntity,
                                            sender : CoreClasses.ICentralRequestSender,
                                            renderer : CoreClasses.ICentralRenderingManager,
                                           color : string)
    {

        var diePresenter : CoreComponentPresenters.DieComponentPresenter;

        diePresenter = new CoreComponentPresenters.DieComponentPresenter(entity.getID(),
        entity.getAttributes(),sender,color,renderer);


        var dieComponent : CoreComponents.DieComponent;
        dieComponent = new CoreComponents.DieComponent(entity.getID(),entity.getAttributes(),
        diePresenter,sender);


        entity.addComponent(dieComponent);

    }


    export function addGatheredComponentToEntity(entity : CoreClasses.WegasEntity,
                                                 sender : CoreClasses.ICentralRequestSender,
                                                 renderer : CoreClasses.ICentralRenderingManager,
                                                 color : string)
    {

        var gatheredPresenter : CoreComponentPresenters.GatheredComponentPresenter;
        gatheredPresenter = new CoreComponentPresenters.GatheredComponentPresenter(entity.getID(),
            entity.getAttributes(),
            renderer, color);

        var gatheredComponent : CoreComponents.GatheredComponent;
        gatheredComponent = new CoreComponents.GatheredComponent(entity.getID(),entity.getAttributes(),
            gatheredPresenter,sender);

        entity.addComponent(gatheredComponent);
        entity.addAttributeForKey(90, CoreConstants.kResourceAmountKey);

        CoreEntities.addDieComponentToEntity(entity,sender,renderer,color);
    }

    export function addGatherComponentToEntity(entity: CoreClasses.WegasEntity,
                                               sender : CoreClasses.ICentralRequestSender,
                                               map : CoreClasses.ICentralMapManager,
                                               renderer : CoreClasses.ICentralRenderingManager,
                                               color : string)
    {

        var gathererPresenter : CoreComponentPresenters.GathererComponentPresenter;
        gathererPresenter = new CoreComponentPresenters.GathererComponentPresenter(entity.getID(),
            entity.getAttributes(),renderer, color);

        var gatherer : CoreComponents.GatherComponent;
        gatherer = new CoreComponents.GatherComponent(entity.getID(),entity.getAttributes(),
            gathererPresenter,sender);

        gatherer.setMapManager(map);

        entity.addComponent(gatherer);
        entity.addAttributeForKey(2,CoreConstants.kDepletionAmountKey);

    }

}