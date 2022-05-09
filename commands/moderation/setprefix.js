const ServerConfig = require("../../database/schemeServerConfig");

module.exports = {
    config: {
        name: "setprefix",
        aliases: ["sprfx", "spr"],
        description: "Set the prefix that will be used exclusively for this Discord server.",
        usage: "<prefix>",
        category: "moderation"
    },
    run: async (bot, message, args) => {
        if (message.author.id !== message.guild.ownerID) return message.channel.send({
            embed: {
                color: color.red,
                description: '❌ Only server owner can set the prefix.'
            }
        });

        if (!args[0]) return message.channel.send({
            embed: {
                color: color.red,
                description: "❌ You didn't specify a prefix!",
            }
        });

        if (args[0].length > 2) return message.channel.send({
            embed: {
                color: color.red,
                description: "❌ Prefix is too long! Maximum prefix length is two symbols.",
            }
        });

        try {
            const guildDatabase = await ServerConfig.findOne({ guildId: message.guild.id });

            await ServerConfig.updateOne({ guildId: message.guild.id }, {
                guildPrefix: args[0]
            });

            message.channel.send({
                embed: {
                    color: color.green,
                    description: `✅ Successfully changed the prefix **${guildDatabase.guildPrefix}** to **${args[0]}**`
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
}