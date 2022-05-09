const ServerConfig = require("../../database/schemeServerConfig");

module.exports = async (bot, channel) => {
    const guildDatabase = await ServerConfig.findOne({ guildId: channel.guild.id });

    if (guildDatabase.guildUnverifiedRoleID != null) {
        channel.createOverwrite(guildDatabase.guildUnverifiedRoleID, {
            VIEW_CHANNEL: false,
            CONNECT: false
        });
    }
}