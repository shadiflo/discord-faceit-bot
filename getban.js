const axios = require('axios');


const apiKey = process.env.API_KEY; // Replace with your actual FACEIT API key
const hubId = 'Yaa40994c-f893-45bb-9c2f-b8662008ea33';

async function getAllMembers() {
  const apiUrl = `https://open.faceit.com/data/v4/hubs/${hubId}/members?offset=0&limit=20&fields=nickname`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const membersData = response.data.items;

    for (const member of membersData) {
      await checkMemberBans(member.player_id, member.nickname);
    }
  } catch (error) {
    console.error('Error fetching members:', error);
  }
}

async function checkMemberBans(playerId, nickname) {
  const apiUrl = `https://open.faceit.com/data/v4/players/${playerId}/bans`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const banData = response.data;

    if (banData.bans && banData.bans.length > 0) {
      console.log(`User with ID ${playerId} (${nickname}) is banned.`);
      console.log('Bans:', banData.bans);
      // Send a Discord message or perform any other action here.
    }
  } catch (error) {
    console.error(`Error checking bans for user ${playerId} (${nickname}):`, error);
  }
}

// Call the function to load all members and check for bans
getAllMembers();
