// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
const { token, CHANNEL_ID, prefix } = require("./config.json");

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

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  const LAST_MSG = new Map();
  const MINUTE = 1000 * 60;
  const CHANNEL = await client.channels.fetch(CHANNEL_ID);

  client.on("messageCreate", (message) => {
    if (!message.channel.isDMBased()) return;
    const last = LAST_MSG.get(message.channel.id);

    let msg = message.content;
    if (!last || new Date() - last > 60 * MINUTE) msg = `**New ${prefix}:**\n${msg}`;

    CHANNEL.send(msg).catch(console.error);
    LAST_MSG.set(message.channel.id, new Date());
  });
});

// Log in to Discord with your client's token
client.login(token);
