const ServerConfig = require("../../database/schemeServerConfig");

module.exports = {
    config: {
        name: "setupverification",
        aliases: ["sv"],
        description: "Set a verification message and its content.",
        usage: "<auto/manual>%|%[message content if using auto mode/message id if using manual mode]%|%<unverified role id>/<generate>%|%[<hex color code for the embed if using auto mode]",
        category: "moderation"
    },
    run: async (bot, message, args) => {
        await message.delete();
        args = args.join(" ").split("%|%");

        if (!args[0]) return message.channel.send({
            embed: {
                color: color.red,
                description: "❌ You didn't specify enough parameters."
            }
        })

        if (args[0] == "reset") {
            await ServerConfig.updateOne({ guildId: message.guild.id }, {
                $unset: {
                    guildVerificationMessageID: 1,
                    guildUnverifiedRoleID: 1
                }
            });

            return message.channel.send({
                embed: {
                    color: color.green,
                    description: "✅ Successfully reset the verification configuration."
                }
            });
        }


        if (args[0] == "auto") {
            let embedDescription = args[1];
            let embedColor = args[3];

            if (!embedColor) {
                embedColor = 0x778899
            }

            if (args[2] == "generate") {
                message.guild.roles.create({
                    data: {
                        name: 'unverified',
                        color: 'GREY',
                        permissions: 0
                    }
                }).then(async role => {
                    let channel = message.channel;

                    channel.overwritePermissions([
                        {
                            id: role.id,
                            deny: ['SEND_MESSAGES'],
                            allow: ['ADD_REACTIONS', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                        },
                        {
                            id: message.guild.roles.everyone.id,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                    ], 'Channel override for verification use.');

                    await ServerConfig.updateOne({ guildId: message.guild.id }, {
                        $set: {
                            guildUnverifiedRoleID: role.id,
                        }
                    });
                });
            } else {
                let role = args[2];
                if (!message.guild.roles.resolve(role)) return message.channel.send({ embed: { color: color.red, description: "❌ You didn't specify the correct role id." } })

                let channel = message.channel;
                channel.overwritePermissions([
                    {
                        id: role,
                        deny: ['SEND_MESSAGES'],
                        allow: ['ADD_REACTIONS', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                    },
                    {
                        id: message.guild.roles.everyone.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                ], 'Channel override for verification use.');

                await ServerConfig.updateOne({ guildId: message.guild.id }, {
                    $set: {
                        guildUnverifiedRoleID: role,
                    }
                });
            }

            message.channel.send({
                embed: {
                    color: embedColor,
                    description: embedDescription
                }
            }).then(async message => {
                await ServerConfig.updateOne({ guildId: message.guild.id }, {
                    $set: {
                        guildVerificationMessageID: message.id,
                    }
                });
            });
        }

        if (args[0] == "manual") {
            if (!args[1]) return message.channel.send({
                embed: {
                    color: color.red,
                    description: "❌ You didn't specify an message id.",
                }
            })

            if (!args[2]) {
                message.guild.roles.create({
                    data: {
                        name: 'unverified',
                        color: 'GREY',
                        permissions: 0
                    }
                }).then(async role => {
                    let channel = message.channel;

                    channel.overwritePermissions([
                        {
                            id: role.id,
                            deny: ['SEND_MESSAGES'],
                            allow: ['ADD_REACTIONS', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                        },
                        {
                            id: message.guild.roles.everyone.id,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                        },
                    ], 'Channel override for verification use.');

                    await ServerConfig.updateOne({ guildId: message.guild.id }, {
                        $set: {
                            guildUnverifiedRoleID: role.id,
                        }
                    });
                });
            } else {
                let role = args[2];
                if (!message.guild.roles.resolve(role)) return message.channel.send({ embed: { color: color.red, description: "❌ You didn't specify the correct role id." } });

                let channel = message.channel;
                channel.overwritePermissions([
                    {
                        id: role,
                        deny: ['SEND_MESSAGES'],
                        allow: ['ADD_REACTIONS', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                    },
                    {
                        id: message.guild.roles.everyone.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                ], 'Channel override for verification use.');

                await ServerConfig.updateOne({ guildId: message.guild.id }, {
                    $set: {
                        guildUnverifiedRoleID: role,
                    }
                });
            }

            await ServerConfig.updateOne({ guildId: message.guild.id }, {
                $set: {
                    guildVerificationMessageID: args[1]
                }
            });
        }
    }
}