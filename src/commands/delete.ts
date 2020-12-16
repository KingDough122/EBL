import { Command, CommandContext, Permission } from './command';
import { getIDFromMention } from '../utils/command-utils';
import { HexColor, sendLog } from '../api/routes/bots/manage-bot-routes';
import Deps from '../utils/deps';
import Bots from '../data/bots';
import { SavedBot } from '../data/models/bot';

export default class DeleteCommand implements Command {
    name = 'delete';
    aliases = ['remove'];
    precondition: Permission = 'ADMINISTRATOR';

    constructor(private bots = Deps.get<Bots>(Bots)) {}
    
    execute = async (ctx: CommandContext, botUserMention: string, ...reason: string[]) => {
        const botId = getIDFromMention(botUserMention);
        const exists = await SavedBot.exists({ _id: botId });
        if (!exists)
            throw new TypeError('Bot not found.');
        
        const savedBot = await this.bots.get(botId);        
        await savedBot.remove();
        
        const message = reason?.join(' ') || 'No reason specified.';
        await sendLog(
            'Bot Deleted',
            `<@!${savedBot.ownerId}>'s bot, <@!${botId}> was deleted by <@!${ctx.user.id}> - \`${message}\``,
            HexColor.Red
        );

        return ctx.channel.send(`✅ Success`);
    }
}
