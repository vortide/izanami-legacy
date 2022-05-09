const ServerConfig = require("../../database/schemeServerConfig");

module.exports = async (bot, member) => {
    const guildDatabase = await ServerConfig.findOne({ guildId: member.guild.id });
    //#region Ban/Kick logs
    // Ban Logs - not working due to taking ANY first entry.
    /*
    const fetchedBanLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_BAN_ADD',
    });
    const banLog = fetchedBanLogs.entries.first();

    // Kick Logs
    const fetchedKickLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_KICK',
    });
    const kickLog = fetchedKickLogs.entries.first();

    // Ban and Kick Events
    if (banLog.target.id == member.id) {
        const { executor, target, reason } = banLog;

        if (target.id === member.id) {
            await ServerConfig.updateOne({ guildId: member.guild.id }, {
                $push: {
                    guildModerationAuditList: ([
                        { action: "ban", target: target.tag, executor: executor.tag, reason: reason }
                    ])
                }
            });
        }
    } else if (kickLog.target.id == member.id) {
        const { executor, target, reason } = kickLog;

        if (target.id === member.id) {
            await ServerConfig.updateOne({ guildId: member.guild.id }, {
                $push: {
                    guildModerationAuditList: ([
                        { action: "kick", target: target.tag, executor: executor.tag, reason: reason }
                    ])
                }
            });
        }
    } */
    //#endregion

    //#region Guild Statistics
    if (guildDatabase.guildStatisticsChannelID) {
        // For Discord Server
        let channel = bot.channels.resolve(guildDatabase.guildStatisticsChannelID);
        channel.setName(`${guildDatabase.guildStatisticsChannelContent} ${member.guild.memberCount}`);
    }

    // For Database
    let memberCount = member.guild.members.cache.filter(member => !member.user.bot).size;
    let botCount = member.guild.members.cache.filter(member => member.user.bot).size;

    await ServerConfig.updateOne({ guildId: member.guild.id }, {
        $set: {
            guildTotalMembers: member.guild.memberCount,
            guildUserMembers: memberCount,
            guildBotMembers: botCount
        }
    });
    //#endregion
}