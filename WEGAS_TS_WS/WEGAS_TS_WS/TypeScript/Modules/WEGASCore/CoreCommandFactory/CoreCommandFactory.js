/**
 * Created by costin on 02.06.2015.
 */
/// <reference path = "../CoreClasses/CoreClasses.ts" />
/// <reference path = "../../Utilities/Utilities.ts" />
/// <reference path = "../CoreConstants/CoreConstants.ts" />
/// <reference path = "../../../Extern/AStarTS/ts/astar.ts" />
/// <reference path = "../CoreEntities/CoreEntities.ts" />
var CoreCommandFactory = (function () {
    function CoreCommandFactory() {
    }
    CoreCommandFactory.createMoveCommandTo = function (line, col) {
        var command;
        var args;
        args = new Utilities.Dictionary();
        args.setObjectForKey(line, CoreConstants.kPositionXParameterKey);
        args.setObjectForKey(col, CoreConstants.kPositionYParameterKey);
        command = new DTOs.Command(CoreConstants.kMoveCommandName, args);
        return command;
    };
    CoreCommandFactory.createFollowCommandTo = function (entityID) {
        var command;
        var args;
        args = new Utilities.Dictionary();
        args.setObjectForKey(entityID, CoreConstants.kCommandEntityIdKey);
        command = new DTOs.Command(CoreConstants.kFollowCommandName, args);
        return command;
    };
    CoreCommandFactory.createIdleCommand = function () {
        return new DTOs.Command(CoreConstants.kBecomeIdleCommandName, null);
    };
    CoreCommandFactory.addNextCommandToCommand = function (nextCommand, command) {
        var newCommand;
        var dict = command.getParameters();
        var nextCommandString = nextCommand.toJson();
        dict.setObjectForKey(nextCommandString, CoreConstants.kNextCommandJsonKey);
        newCommand = new DTOs.Command(command.getName(), dict);
        return newCommand;
    };
    CoreCommandFactory.createCreateEntityCommand = function (id, type, spawnX, spawnY, color) {
        var command;
        var args;
        args = new Utilities.Dictionary();
        args.setObjectForKey(id, CoreConstants.kCreatedEntityIdKey);
        args.setObjectForKey(type, CoreConstants.kEntityTypeKey);
        args.setObjectForKey(spawnX, CoreConstants.kCreatedEntitySpawnPointX);
        args.setObjectForKey(spawnY, CoreConstants.kCreatedEntitySpawnPointY);
        args.setObjectForKey(color, CoreConstants.kCreatedEntityColor);
        command = new DTOs.Command(CoreConstants.kCreateCommandName, args);
        return command;
    };
    CoreCommandFactory.createGetAttackedCommand = function (damage, attacker) {
        var args;
        args = new Utilities.Dictionary();
        args.setObjectForKey(damage, CoreConstants.kDamageParameterKey);
        args.setObjectForKey(attacker, CoreConstants.kAttackerEntityID);
        return new DTOs.Command(CoreConstants.kGetAttackedCommandName, args);
    };
    CoreCommandFactory.createGetGatheredCommand = function (amount, gatherer) {
        var args;
        args = new Utilities.Dictionary();
        args.setObjectForKey(amount, CoreConstants.kDepletionAmountKey);
        args.setObjectForKey(gatherer, CoreConstants.kGatheringEntityIdKey);
        return new DTOs.Command(CoreConstants.kGetGatheredCommandName, args);
    };
    CoreCommandFactory.createAttackCommand = function (target) {
        var args;
        args = new Utilities.Dictionary();
        args.setObjectForKey(target, CoreConstants.kCommandEntityIdKey);
        return new DTOs.Command(CoreConstants.kAttackCommandName, args);
    };
    CoreCommandFactory.createGatherCommand = function (target) {
        var args;
        args = new Utilities.Dictionary();
        args.setObjectForKey(target, CoreConstants.kCommandEntityIdKey);
        return new DTOs.Command(CoreConstants.kGatherCommandName, args);
    };
    return CoreCommandFactory;
})();
//# sourceMappingURL=CoreCommandFactory.js.map