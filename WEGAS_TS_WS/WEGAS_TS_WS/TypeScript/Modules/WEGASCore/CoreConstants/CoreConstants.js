/**
 * Created by Costinel on 5/30/15.
 */
var CoreConstants = (function () {
    function CoreConstants() {
    }
    CoreConstants.kCommandNameKey = "name";
    CoreConstants.kCommandParametersKey = "params";
    CoreConstants.kCommandEntityIdKey = "entityID";
    // active commands
    CoreConstants.kMoveCommandName = "move";
    CoreConstants.kAttackCommandName = "attack";
    CoreConstants.kGatherCommandName = "gather";
    CoreConstants.kFollowCommandName = "follow";
    CoreConstants.kCreateCommandName = "create";
    //pasive commands -- aka. commands issued to entities by another entity
    CoreConstants.kGetAttackedCommandName = "receiveDamage";
    CoreConstants.kGetGatheredCommandName = "depleteResources";
    CoreConstants.kBecomeIdleCommandName = "idle";
    CoreConstants.kDieCommandName = "die";
    CoreConstants.kUpdateAttributesCommandName = "update";
    CoreConstants.kAttackedEntityPosition = "attackerPos";
    //command parameters
    CoreConstants.kPositionXParameterKey = "x";
    CoreConstants.kPositionYParameterKey = "y";
    CoreConstants.kDamageParameterKey = "dmg";
    CoreConstants.kHealthParameterKey = "health";
    CoreConstants.kAttackerEntityID = "attackerID";
    CoreConstants.kNextCommandJsonKey = "nextCommand";
    CoreConstants.kDepletionAmountKey = "depletionAmount";
    CoreConstants.kGatheringEntityIdKey = "gatheringID";
    CoreConstants.kGatheredEntityIdKEy = "gatheredID";
    CoreConstants.kGatheredEntityPosition = "gatheredPos";
    //request parameters
    CoreConstants.kRequestTargetTypeKey = "targetType";
    CoreConstants.kRequestCommandKey = "requestParams";
    CoreConstants.kRequestTargetIdKey = "targetID";
    CoreConstants.kRequestTargetTypeEntity = "entity";
    CoreConstants.kRequestTargetTypeEntityManager = "entityManager";
    CoreConstants.kRequestTargetTypeRenderingManager = "renderingManager";
    CoreConstants.kRequestTargetTypeUserManager = "userManager";
    //draw command
    CoreConstants.kDrawCommandName = "draw";
    CoreConstants.kDrawCommandElementKey = "element";
    CoreConstants.kDrawCircleElement = "circle";
    CoreConstants.kCircleRadiusKey = "circleRadius";
    CoreConstants.kDrawLineElement = "line";
    CoreConstants.kDrawCrossElement = "cross";
    CoreConstants.kDrawCellPointXKey = "cellPointX";
    CoreConstants.kDrawCellPointYKey = "cellPointY";
    CoreConstants.kDrawColorKey = "color";
    CoreConstants.kDrawRectangleElement = "rect";
    CoreConstants.kDrawLineX1 = "x1";
    CoreConstants.kDrawLineY1 = "y1";
    CoreConstants.kDrawLineX2 = "x2";
    CoreConstants.kDrawLineY2 = "y2";
    CoreConstants.kNumOfLines = 20;
    CoreConstants.kNumOfColumns = 20;
    CoreConstants.kCellSizePx = 20;
    // entity manager commands
    CoreConstants.kCreateEntityCommandName = 'createEntity';
    CoreConstants.kRemoveEntityCommandName = 'removeEntity';
    CoreConstants.kDispatchCommandCommandName = "dispatchCommand";
    CoreConstants.kEntityTypeKey = "entityType";
    CoreConstants.kCreatedEntityIdKey = "createdWithId";
    CoreConstants.kCreatedEntitySpawnPointX = "spawnX";
    CoreConstants.kCreatedEntitySpawnPointY = "spawnY";
    CoreConstants.kCreatedEntityColor = "createdColor";
    CoreConstants.kResourceEntityType = "resourceEntity";
    CoreConstants.kGatheringEntityType = "gatheringEntity";
    CoreConstants.kSoldierEntityType = "soldierEntity";
    CoreConstants.kDispatchedCommandJSonStringKey = "commandJson";
    CoreConstants.kDispatchedCommandEntityIdKey = "dispatchedToEntity";
    CoreConstants.kEntityPreviousCommand = "previousCommand";
    //user manager command
    CoreConstants.kBuyAndCreateCommand = "buyCreate";
    CoreConstants.kAddAmountToResources = "add";
    CoreConstants.kResourceAmountKey = "amount";
    CoreConstants.kCreateEntityTypeKey = "createType";
    //map manager command
    CoreConstants.kPlaceEntityCommandName = "placeEntity";
    //config parameters
    CoreConstants.kCentralSettingsDictKey = "userCentralSettings";
    CoreConstants.kUserIdDictKey = "userID";
    CoreConstants.kGathererColorDictKey = "gathererColor";
    CoreConstants.kSoldierColorDictKey = "soldierColor";
    CoreConstants.kResourcePositionsDictKey = "resourcePositions";
    CoreConstants.kResourceLineDictKey = "line";
    CoreConstants.kResourceColumnDictKey = "column";
    return CoreConstants;
})();
//# sourceMappingURL=CoreConstants.js.map