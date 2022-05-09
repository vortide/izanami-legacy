const ServerConfig = require("../../database/schemeServerConfig");
const newGuild = require("../../database/newGuild");

module.exports = async (bot, message) => {
    // Channel check
    if (message.author.bot || message.channel.type === "dm") return;

    // Database | Server Configs
    try {
        const guildDatabase = await ServerConfig.findOne({ guildId: message.guild.id });

        if (guildDatabase) {
            newGuild.update(message);
            commandHandler(guildDatabase);
        } else {
            var promise = newGuild.add(message);
            promise.then(function (guildPromise) {
                commandHandler(guildPromise);
            });
        }

    } catch (err) {
        console.log(err);
    }

    function commandHandler(guildPromise) {
        if (guildPromise.guildBotSpamChannelID) {
            if (message.content.startsWith(guildPromise.guildPrefix) && message.channel.id == guildPromise.guildBotSpamChannelID) {
                return checkPermissions(guildPromise);
            }

            if (!message.content.startsWith && message.channel.id == guildPromise.guildBotSpamChannelID) {
                return message.delete();
            }

            if (message.content.startsWith(guildPromise.guildPrefix) && message.channel.id != guildPromise.guildBotSpamChannelID) {
                return message.delete();
            }

            return message.delete();
        } else {
            if (message.content.startsWith(guildPromise.guildPrefix)) {
                return checkPermissions(guildPromise);
            }
        }
    }

    function checkPermissions(guildPromise) {
        let args = message.content.slice(guildPromise.guildPrefix.length).trim().split(/ +/g)
        let cmd = args.shift().toLowerCase();

        function checkAliases(aliase) {
            return aliase == cmd;
        }
        let deny = true;
        guildPromise.guildCommands.forEach(command => {
            command.allow.forEach(permission => {
                if (command.command == cmd || command.aliases.some(checkAliases)) {
                    // Allow
                    if (permission == "everyone" || permission == "" || permission == null) // Everyone
                    {
                        deny = false;
                        return execute(args, cmd, deny);
                    }

                    if (permission == "owner" && message.author.id == message.guild.ownerID) // Owner
                    {
                        deny = false;
                        return execute(args, cmd, deny);
                    }

                    if (message.guild.channels.resolve(permission) && message.guild.channels.resolve(permission) == message.channel.id) // Specific Channel Only
                    {
                        deny = false;
                        return execute(args, cmd, deny);
                    }

                    if (message.guild.members.resolve(permission) && message.guild.members.resolve(permission) == message.author.id) // Specific User Only
                    {
                        deny = false;
                        return execute(args, cmd, deny);
                    }

                    if (message.guild.roles.resolve(permission) && message.member.roles.cache.get(permission) && message.guild.roles.resolve(permission) == message.member.roles.cache.get(permission).id) // Specific Roles Only
                    {
                        deny = false;
                        return execute(args, cmd, deny);
                    }
                }
            });
        });

        if (deny) {
            return message.channel.send({
                embed: {
                    color: color.red,
                    description: "❌ You are not allowed to use this commmand.",
                    footer: {
                        text: "You don't have the right permissions or this command is not allowed on this channel."
                    }
                }
            }).then(msg => { msg.delete({ timeout: 5000 }) });
        }
    }

    function execute(args, cmd, deny) {
        if (!deny)
        {
            let commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));
            if (commandfile) commandfile.run(bot, message, args);
            return;
        }
    }
}