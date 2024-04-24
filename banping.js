const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const dotenv = require("dotenv");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

dotenv.config({ path: `${__dirname}/./config.env` });
const token = process.env.DISCORD_KEY;
const apiKey = process.env.API_KEY; // Replace with your actual FACEIT API key
const hubId = "aa40994c-f893-45bb-9c2f-b8662008ea33"; // Replace with your hub ID

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("ls")) {
    // Command to list hub members
    const apiUrl = `https://open.faceit.com/data/v4/hubs/${hubId}/members`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const membersData = response.data.items || [];
      const memberList = membersData.map((member) => {
        return `${member.nickname} - ${member.user_id}`;
      });

      message.channel.send(`Names and GUIDS:\n${memberList.join("\n")}`);
    } catch (error) {
      console.error("Error fetching member data:", error);
      message.reply("An error occurred while fetching member data.");
    }
  } else if (message.content.startsWith("bans")) {
    // Command to check active bans
    const apiUrl = `https://open.faceit.com/data/v4/hubs/${hubId}/members`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const membersData = response.data.items || [];
      const bansList = [];

      for (const member of membersData) {
        const bansUrl = `https://open.faceit.com/data/v4/players/${member.user_id}/bans`;
        const bansResponse = await axios.get(bansUrl, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        const bans = bansResponse.data.items || [];
        for (const ban of bans) {
          if (!ban.expired) {
            bansList.push(
              `${member.nickname} has an active ban: ${ban.reason}`
            );
          }
        }
      }

      let responseMsg = "Active Bans:\n";
      if (bansList.length > 0) {
        // Limit the length of the response message
        const truncatedBansList = bansList.slice(0, 10);
        responseMsg += truncatedBansList.join("\n");
        if (responseMsg.length > 2000) {
          responseMsg = "Active Bans: Too many bans to display.";
        }
      } else {
        responseMsg += "No active bans found.";
      }

      message.channel.send(responseMsg);
    } catch (error) {
      console.error("Error fetching ban data:", error);
      message.reply("An error occurred while fetching ban data.");
    }
  }
});

client.login(token);
