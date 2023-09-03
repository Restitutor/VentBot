// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const { token, VENT_ID } = require("./config.json");

// Create a new client instance
const client = new Client({
  allowedMentions: { parse: [] },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.User, Partials.Channel, Partials.Message],
});

let VENT_CHANNEL;
const MINUTE = 1000 * 60;

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  VENT_CHANNEL = await client.channels.fetch(VENT_ID);
});

const LAST_VENT = new Map();

client.on("messageCreate", (message) => {
  if (!message.channel.isDMBased()) return;
  const last = LAST_VENT.get(message.channel.id);

  let msg = message.content;
  if (!last || new Date() - last > 60 * MINUTE) msg = `**New Vent:**\n${msg}`;

  VENT_CHANNEL.send(msg).catch(console.error);
  LAST_VENT.set(message.channel.id, new Date());
});

// Log in to Discord with your client's token
client.login(token);
