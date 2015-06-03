/**
 * Created by Costinel on 5/30/15.
 */

class  CoreConstants
{
    public static kCommandNameKey = "name";
    public static kCommandParametersKey = "params";
    public static kCommandEntityIdKey = "entityID";

    // active commands
    public static kMoveCommandName = "move";
    public static kAttackCommandName = "attack";
    public static kGatherCommandName = "gather";
    public static kFollowCommandName = "follow";


    public static kCreateCommandName = "create";

    //pasive commands -- aka. commands issued to entities by another entity

    public static kGetAttackedCommandName = "receiveDamage";
    public static kGetGatheredCommandName = "depleteResources";
    public static kBecomeIdleCommandName = "idle";
    public static kDieCommandName = "die";
    public static kUpdateAttributesCommandName = "update";


    public static kAttackedEntityPosition = "attackerPos";

    //command parameters
    public static kPositionXParameterKey = "x";
    public static kPositionYParameterKey = "y";
    public static kDamageParameterKey = "dmg";
    public static kHealthParameterKey = "health";

    public static kAttackerEntityID = "attackerID";

    public static kNextCommandJsonKey = "nextCommand";


    public static kDepletionAmountKey = "depletionAmount";

    public static kGatheringEntityIdKey = "gatheringID";
    public static kGatheredEntityIdKEy ="gatheredID";
    public static kGatheredEntityPosition = "gatheredPos";

    //request parameters
    public static kRequestTargetTypeKey = "targetType";
    public static kRequestCommandKey = "requestParams";
    public static kRequestTargetIdKey = "targetID";

    public static kRequestTargetTypeEntity = "entity";
    public static kRequestTargetTypeEntityManager = "entityManager";
    public static kRequestTargetTypeRenderingManager = "renderingManager";
    public static kRequestTargetTypeUserManager = "userManager";


    //draw command
    public static kDrawCommandName = "draw";

    public static kDrawCommandElementKey ="element";


    public static kDrawCircleElement = "circle";
    public static kCircleRadiusKey = "circleRadius";

    public static kDrawLineElement = "line";

    public static kDrawCrossElement = "cross";

    public static kDrawCellPointXKey = "cellPointX";
    public static kDrawCellPointYKey = "cellPointY";

    public static kDrawColorKey = "color";

    public static kDrawRectangleElement = "rect";

    public static kDrawLineX1 = "x1";
    public static kDrawLineY1 = "y1";
    public static kDrawLineX2 = "x2";
    public static kDrawLineY2 = "y2";



    public static kNumOfLines = 20;
    public static kNumOfColumns = 20;
    public static kCellSizePx = 20;


    // entity manager commands

    public static kCreateEntityCommandName = 'createEntity';
    public static kRemoveEntityCommandName = 'removeEntity';
    public static kDispatchCommandCommandName = "dispatchCommand";

    public static kEntityTypeKey = "entityType";
    public static kCreatedEntityIdKey = "createdWithId";
    public static kCreatedEntitySpawnPointX = "spawnX";
    public static kCreatedEntitySpawnPointY = "spawnY";
    public static kCreatedEntityColor = "createdColor";


    public static kResourceEntityType = "resourceEntity";
    public static kGatheringEntityType = "gatheringEntity";
    public static kSoldierEntityType = "soldierEntity";

    public static kDispatchedCommandJSonStringKey = "commandJson";
    public static kDispatchedCommandEntityIdKey = "dispatchedToEntity";



    public static kEntityPreviousCommand = "previousCommand";


    //user manager command
    public static kBuyAndCreateCommand = "buyCreate";
    public static kAddAmountToResources = "add";
    public static kResourceAmountKey = "amount";
    public static kCreateEntityTypeKey = "createType";


    //map manager command

    public static kPlaceEntityCommandName = "placeEntity";

    //config parameters


    public static kCentralSettingsDictKey = "userCentralSettings";
    public static kUserIdDictKey = "userID";
    public static kGathererColorDictKey = "gathererColor";
    public static kSoldierColorDictKey = "soldierColor";
    public static kResourcePositionsDictKey = "resourcePositions";
    public static kResourceLineDictKey = "line";
    public static kResourceColumnDictKey = "column";


}