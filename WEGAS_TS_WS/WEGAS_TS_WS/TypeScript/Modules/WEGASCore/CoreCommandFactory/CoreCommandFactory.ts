/**
 * Created by costin on 02.06.2015.
 */

    /// <reference path = "../CoreClasses/CoreClasses.ts" />
    /// <reference path = "../../Utilities/Utilities.ts" />
    /// <reference path = "../CoreConstants/CoreConstants.ts" />
    /// <reference path = "../../../Extern/AStarTS/ts/astar.ts" />
    /// <reference path = "../CoreEntities/CoreEntities.ts" />

class CoreCommandFactory
{

    public static createMoveCommandTo(line : number, col : number) : DTOs.Command
    {
        var command : DTOs.Command;
        var args : Utilities.Dictionary;
        args = new Utilities.Dictionary();
        args.setObjectForKey(line, CoreConstants.kPositionXParameterKey);
        args.setObjectForKey(col, CoreConstants.kPositionYParameterKey);

        command = new DTOs.Command(CoreConstants.kMoveCommandName, args);
        return command;
    }

    public static createFollowCommandTo(entityID : string) : DTOs.Command
    {
        var command : DTOs.Command;
        var args : Utilities.Dictionary;

        args = new Utilities.Dictionary();
        args.setObjectForKey(entityID, CoreConstants.kCommandEntityIdKey);

        command = new DTOs.Command(CoreConstants.kFollowCommandName, args);
        return command;
    }


    public static createIdleCommand() : DTOs.Command
    {
        return new DTOs.Command(CoreConstants.kBecomeIdleCommandName, null);
    }

    public static addNextCommandToCommand(nextCommand : DTOs.Command,command:DTOs.Command ) : DTOs.Command
    {
        var newCommand : DTOs.Command;

        var dict = command.getParameters();
        var nextCommandString = nextCommand.toJson();
        dict.setObjectForKey(nextCommandString, CoreConstants.kNextCommandJsonKey);

        newCommand = new DTOs.Command(command.getName(), dict);
        return newCommand;
    }



    public static createCreateEntityCommand(id : String, type : string, spawnX : number,
                                            spawnY : number, color : string) : DTOs.Command
    {

        var command : DTOs.Command;
        var args : Utilities.Dictionary;

        args = new Utilities.Dictionary();

        args.setObjectForKey(id, CoreConstants.kCreatedEntityIdKey);
        args.setObjectForKey(type, CoreConstants.kEntityTypeKey);
        args.setObjectForKey(spawnX, CoreConstants.kCreatedEntitySpawnPointX);
        args.setObjectForKey(spawnY, CoreConstants.kCreatedEntitySpawnPointY);
        args.setObjectForKey(color, CoreConstants.kCreatedEntityColor);

        command = new DTOs.Command(CoreConstants.kCreateCommandName, args);

        return command;
    }



    public static createGetAttackedCommand(damage : number, attacker : string) : DTOs.Command
    {
        var args : Utilities.Dictionary;
        args = new Utilities.Dictionary();

        args.setObjectForKey(damage, CoreConstants.kDamageParameterKey);
        args.setObjectForKey(attacker, CoreConstants.kAttackerEntityID);

        return new DTOs.Command(CoreConstants.kGetAttackedCommandName, args);
    }

    public static createGetGatheredCommand(amount : number, gatherer : string) : DTOs.Command
    {
        var args : Utilities.Dictionary;
        args = new Utilities.Dictionary();

        args.setObjectForKey(amount, CoreConstants.kDepletionAmountKey);
        args.setObjectForKey(gatherer, CoreConstants.kGatheringEntityIdKey);

        return new DTOs.Command(CoreConstants.kGetGatheredCommandName, args);
    }

    public static createAttackCommand(target : string) : DTOs.Command
    {
        var args : Utilities.Dictionary;
        args = new Utilities.Dictionary();

        args.setObjectForKey(target, CoreConstants.kCommandEntityIdKey);

        return new DTOs.Command(CoreConstants.kAttackCommandName, args);
    }

    public static createGatherCommand(target : string) : DTOs.Command
    {
        var args : Utilities.Dictionary;
        args = new Utilities.Dictionary();

        args.setObjectForKey(target, CoreConstants.kCommandEntityIdKey);

        return new DTOs.Command(CoreConstants.kGatherCommandName, args);
    }


}