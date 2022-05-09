const { ShardingManager } = require("discord.js");

require("dotenv").config();

const managerA = new ShardingManager("./bot.js", { token: process.env.IZANAMI_TOKEN });

managerA.spawn();
managerA.on('shardCreate', shard => console.log(`[CLIENT - Izanami] Launched shard ${shard.id}`));