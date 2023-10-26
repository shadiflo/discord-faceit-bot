const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ]
});

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/./config.env` });

const token = process.env.DISCORD_KEY;
const apiKey = process.env.API_KEY; // Replace with your actual FACEIT API key

const scheduledTasks = [];

const messages = [
    { content: 'Join our Clan: https://www.faceit.com/en/inv/xb7l4wE', interval: 2000,color: '#FF0000' }, // Send 'Message 1' every 6 seconds
    { content: 'Minty thanks for denying my golden application u nub', interval: 3000 ,color: '#00ff00'}, // Send 'Message 2' every 10 seconds
    { content: 'JS>TS', interval: 4000 ,color: '#0000FF'}, // Send 'Message 3' every 15 seconds
  ];


  const sendScheduledMessage = async (message) => {
    const channel_id = '1166773713857937438'; // Replace with your channel ID
    const channel = await client.channels.fetch(channel_id);
  
    if (channel) {
      const embed = new EmbedBuilder()
        .setTitle('Join Our Clan for awesome prizes.')
        .setDescription(message.content)
        .setColor(message.color); // Set the embed color
  
      await channel.send({ embeds: [embed] });
    } else {
      console.log(`Channel with ID ${channel_id} not found.`);
    }
  };
  
  // Schedule tasks for sending messages with different intervals and colors
  messages.forEach((message) => {
    scheduledTasks.push(
      setInterval(() => sendScheduledMessage(message), message.interval)
    );
  });
  
  client.on('ready', () => {
    console.log('Starting schedule loop');
  });

client.login(token);
