const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/./config.env` });



const token = process.env.DISCORD_KEY;
const apiKey = process.env.API_KEY; // Replace with your actual FACEIT API key
const hubId = 'aa40994c-f893-45bb-9c2f-b8662008ea33'; // Replace with your hub ID




client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content === 'ls') {
    const apiUrl = `https://open.faceit.com/data/v4/hubs/${hubId}/members?offset=0&limit=50&fields=nickname,user_id`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      // Extract nicknames from the response
      const membersData = response.data.items || [];
      const memberList = membersData.map((member) => {
        return `${member.nickname} - ${member.user_id}`;
      }).join('\n');
      // Send the list of nicknames as a response
      message.reply(`Names and GUIDS:\n${memberList}`);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.reply('An error occurred while fetching member data.');
    }
  }
});

client.login(token);
