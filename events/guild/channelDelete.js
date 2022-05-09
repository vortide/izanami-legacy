const ServerConfig = require("../../database/schemeServerConfig");

module.exports = async (bot, channel) => {
    const guildDatabase = await ServerConfig.findOne({ guildId: channel.guild.id });

    //#region Statistics Channel
    if (guildDatabase.guildStatisticsChannelID != null) {
        if(channel.id == guildDatabase.guildStatisticsChannelID) {
            await ServerConfig.updateOne({ guildId: channel.guild.id }, {
                $unset: {
                    guildStatisticsChannelID: 1,
                    guildStatisticsChannelContent: 1
                }
            });
        }
    }
    //#endregion

    //#region 
    if (guildDatabase.guildBotSpamChannelID != null) {
        if(channel.id == guildDatabase.guildBotSpamChannelID) {
            await ServerConfig.updateOne({ guildId: channel.guild.id }, {
                $unset: {
                    guildBotSpamChannelID: 1
                }
            });
        }
    }
    //#endregion
}