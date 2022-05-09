const ServerConfig = require("../../database/schemeServerConfig");

module.exports = {
    config: {
        name: "setstatschannel",
        aliases: ["ssc"],
        description: "Set an member statistics channel.",
        usage: "<auto>/<channel id or a channel mention>%|%[channel name prefix]",
        category: "moderation"
    },
    run: async (bot, message, args) => {
        args = args.join(" ").split("%|%");

        let channelName = "Member Count:";

        if (!args[0]) {
            message.channel.send({
                embed: {
                    color: color.red,
                    description: "❌ You did not specify the channel or its id.",
                    footer: {
                        text: "If you wanted auto generated channel, you must have typed 'auto' in the first parameter."
                    }
                }
            })

            return;
        } else if (args[0] == "reset") {
            await ServerConfig.updateOne({ guildId: message.guild.id }, {
                $unset: {
                    guildStatisticsChannelID: 1,
                    guildStatisticsChannelContent: 1
                }
            });

            message.channel.send({
                embed: {
                    color: color.green,
                    description: "✅ Successfully reset the channel.",
                }
            });
        } else if (args[0] == "auto") {
            if (args[1]) channelName = args[1];

            message.guild.channels.create(`${channelName} ${message.guild.memberCount}`, {
                type: "voice",
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        allow: ['VIEW_CHANNEL'],
                        deny: ['CONNECT']
                    }
                ]
            }).then(channel => {
                updateDatabase(channel.id, channelName);
            });
        } else if (!isNaN(args[0])) {
            let channel = bot.channels.resolve(args[0]);
            if (channel) {
                if (args[1]) channelName = args[1];

                channel.overwritePermissions([
                    {
                        id: message.guild.roles.everyone.id,
                        allow: ['VIEW_CHANNEL'],
                        deny: ['CONNECT']
                    }
                ])

                channel.setName(channelName + " " + message.guild.memberCount);
                updateDatabase(args[0], channelName);
            } else {
                message.channel.send({
                    embed: {
                        color: color.red,
                        description: "❌ Channel id is invalid.",
                    }
                })

                return;
            }

        } else {
            message.channel.send({
                embed: {
                    color: color.red,
                    description: "❌ Unknown error has occured.",
                    footer: {
                        text: "You might have misspelled the channel id."
                    }
                }
            })

            return;
        }

        // Database Update
        async function updateDatabase(channelID, channelContent) {
            await ServerConfig.updateOne({ guildId: message.guild.id }, {
                $set: {
                    guildStatisticsChannelID: channelID,
                    guildStatisticsChannelContent: channelContent
                }
            });
        }
    }
}