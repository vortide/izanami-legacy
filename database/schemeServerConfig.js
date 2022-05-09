const mongoose = require("mongoose");

const ServerConfigSchema = new mongoose.Schema({
    guildName: String,
    guildId: String,
    guildOwnerName: String,
    guildOwnerID: String,
    guildTotalMembers: Number,
    guildUserMembers: Number,
    guildBotMembers: Number,
    guildPremium: Boolean,
    guildCommands: Array,
    guildPrefix: String,
    guildBotSpamChannel: Array,
    guildVerificationMessageID: String,
    guildUnverifiedRoleID: String,
    guildDefaultRoleID: String,
    guildMusicChannel: String,
    guildDCSCategoryID: String,
    guildDCSChannelID: String,
    guildStatisticsChannelID: String,
    guildStatisticsChannelContent: String,
    guildModerationAuditList: Array
});

module.exports = mongoose.model("ServerConfig", ServerConfigSchema);