const ServerConfig = require("../../database/schemeServerConfig");
module.exports = {
    config: {
        name: "setdefaultrole",
        aliases: ["sdr"],
        description: "Set default role that will be granted to the new users when they join your server or complete verification.",
        usage: "<role mention>",
        category: "moderation"
    },
    run: async (bot, message, args) => {
        if (!message.guild.owner) return message.channel.send({
            embed: {
                color: color.red,
                description: '❌ Only server owner can set the default role.'
            }
        });

        if (!args[0]) {
            return message.channel.send({
                embed: {
                    color: color.red,
                    description: "❌ You didn't specify a role!",
                }
            });
        }

        if (args[0] == "remove") {
            await ServerConfig.updateOne({ guildId: message.guild.id }, {
                $unset: {
                    guildDefaultRoleID: 1
                }
            });

            return message.channel.send({
                embed: {
                    color: color.green,
                    description: '✅ Default role has been successfully reset.',
                }
            });
        }

        try {
            let role = message.mentions.roles.first().id;

            await ServerConfig.updateOne({ guildId: message.guild.id }, {
                guildDefaultRoleID: role
            });

            message.channel.send({
                embed: {
                    color: color.green,
                    description: '✅ Default role has been successfully set.',
                }
            });
        }
        catch (e) {
            message.channel.send({
                embed: {
                    color: color.red,
                    description: '❌ Invalid role'
                }
            });
        }
    }
}