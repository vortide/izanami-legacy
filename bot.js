// Izanami Libraries
const { Client, Collection } = require("discord.js");
global.color = require("./colors.json");

// Izanami Client
const Izanami = new Client();

// Handler Links - Izanami
["aliases", "commands"].forEach(x => Izanami[x] = new Collection());
["event", "command", "console"].forEach(x => require(`./handlers/${x}`)(Izanami));

// Database
const db = require("./database/mongodb");
db.then(() => console.log("[DATABASE] Connected to MongoDB.")).catch(err => console.log(err));

// Izanami Login
Izanami.login(process.env.IZANAMI_TOKEN);