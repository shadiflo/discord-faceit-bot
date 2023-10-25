const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

const token = 'MTAzMjY5MzU1MzQ3MTcwNTI1MA.GFv-Ko.GbPcPBbkOpVhFMv58-HJsh9me4_rjhp9kss0-o';

client.on('ready', () => {
 
  console.log(`Logged in as ${client.user.tag}`);


});





const axios = require('axios');

const apiKey = '803a2694-c9ce-4605-8cd8-82258018096a'; // Replace with your actual FACEIT API key
const hubId = 'aa40994c-f893-45bb-9c2f-b8662008ea33'; // Replace with your hub ID

const apiUrl = `https://open.faceit.com/data/v4/hubs/${hubId}/members`;

axios
  .get(apiUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  .then((response) => {
    // Handle the response data
    console.log(response.data);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
  
  
 
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
  
    const { commandName } = interaction;
  
    if (commandName === 'test') {
      // Your command logic here
    }
  });
  
  client.on('messageCreate', async (message) => {
    if (message.content === '!ping') {
      message.channel.send('Pong!');
    }
  })
  client.login(token)