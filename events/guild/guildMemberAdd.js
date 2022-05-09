const ServerConfig = require("../../database/schemeServerConfig");

module.exports = async (bot, member) => {
    const guildDatabase = await ServerConfig.findOne({ guildId: member.guild.id });
    
    //#region Verification
    let role;
    if (guildDatabase.guildUnverifiedRoleID) {
        role = member.guild.roles.resolve(guildDatabase.guildUnverifiedRoleID);
        member.roles.add(role);
    } else if (guildDatabase.guildDefaultRoleID) {
        role = member.guild.roles.resolve(guildDatabase.guildDefaultRoleID);
        member.roles.add(role);
    }
    //#endregion

    //#region Member Count
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