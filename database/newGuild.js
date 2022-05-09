const ServerConfig = require("./schemeServerConfig");

module.exports.add = function (message) {
    let memberCount = message.guild.members.cache.filter(member => !member.user.bot).size;
    let botCount = message.guild.members.cache.filter(member => member.user.bot).size;

    const newGuild = new ServerConfig({
        guildName: message.guild.name,
        guildId: message.guild.id,
        guildOwnerName: message.guild.owner.user.tag,
        guildOwnerId: message.guild.ownerID,
        guildPremium: false,
        guildCommands: ([
            // Moderation
            { command: "setbotspamchannel", aliases: ["sbsc"], allow: ["owner"] },
            { command: "setdefaultrole", aliases: ["sdr"], allow: ["owner"] },
            { command: "setprefix", aliases: ["sp"], allow: ["owner"] },
            { command: "setstatschannel", aliases: ["ssc"], allow: ["owner"] },
            { command: "setupverification", aliases: ["sv"], allow: ["owner"] },
            // Miscellaneous
            { command: "help", aliases: ["h"], allow: ["everyone"] },
            // Music
            { command: "play", aliases: ["p", "pl"], allow: ["everyone"] },
            { command: "leave", aliases: ["l", "lv"], allow: ["everyone"] },
            { command: "pause", aliases: ["ps", "paus", "resume", "rs"], allow: ["everyone"] },
            { command: "skip", aliases: ["s", "sk"], allow: ["everyone"] },
            { command: "queue", aliases: ["q", "qu"], allow: ["everyone"] },
            { command: "volume", aliases: ["v", "vol"], allow: ["everyone"] },
            { command: "nowplaying", aliases: ["np", "nowp"], allow: ["everyone"] },
            { command: "shuffle", aliases: ["shf", "shuff"], allow: ["everyone"] }
        ]),
        guildPrefix: "-",
        guildTotalMembers: message.guild.memberCount,
        guildUserMembers: memberCount,
        guildBotMembers: botCount
    });

    var promise = newGuild.save();

    return promise;
}

module.exports.update = async function (message) {
    let memberCount = message.guild.members.cache.filter(member => !member.user.bot).size;
    let botCount = message.guild.members.cache.filter(member => member.user.bot).size;

    await ServerConfig.updateOne({ guildId: message.guild.id }, {
        guildName: message.guild.name,
        guildOwnerName: message.guild.owner.user.tag,
        guildOwnerId: message.guild.ownerID,
        guildTotalMembers: message.guild.memberCount,
        guildUserMembers: memberCount,
        guildBotMembers: botCount
    });
}