const ServerConfig = require("../../database/schemeServerConfig");

module.exports = {
    config: {
        name: "setbotspamchannel",
        aliases: ["sbsc"],
        description: "Set a channel where all commands should be written in.",
        usage: "<prefix>",
        category: "moderation"
    },
    run: async (bot, message, args) => {
        if (args[0] === "remove") {
            await ServerConfig.updateOne({ guildId: message.guild.id }, {
                $unset: {
                    guildBotSpamChannelID: 1
                }
            });

            message.channel.send({embed: {
                color: color.green,
                description: "✅ Bot spam channel successfully added."
            }})

            return;
        }

        await ServerConfig.updateOne({ guildId: message.guild.id }, {
            $set: {
                guildBotSpamChannelID: message.channel.id
            }
        });

        message.channel.send({embed: {
            color: color.green,
            description: "✅ Bot spam channel successfully added."
        }})
    }
}