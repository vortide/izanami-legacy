const ServerConfig = require("../database/schemeServerConfig");

module.exports = (bot) => {
    let prompt = process.openStdin();

    prompt.addListener("data", async res => {
        let args = res.toString().trim().split(/ +/g)
        let command = args.shift().toLowerCase();

        if (command === "update") {
            if (args[0] === "command") {
                const guildDatabase = await ServerConfig.find({});

                let guild = args[1];
                let commandqueryfrom = args[2];
                let commandqueryto = args[3];
                console.log(guild);

                if (guild === "all") {
                    guildDatabase.forEach(async guild => {
                        console.log(guild.id);

                        await ServerConfig.updateOne({_id: guild.id}, {
                            $set: {
                                guildPrefix: "-"
                            }
                        });

                    });
                }
            }
        }
    });
};

