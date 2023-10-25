(() => {
    let tabSet = new Set();

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === "loading" && changeInfo.url && !tabSet.has(tabId)) {
            tabSet.add(tabId);
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabId },
                    files: ["faceit.js", "backoffice.js"],
                },
                () => tabSet.delete(tabId)
            );
        }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "GetMorePlayer") {
            async function getPlayerData(request) {
                try {
                    const response = await fetch(`https://api.faceit.com/users/v1/nicknames/${request.nickname}`);
                    const playerData = await response.json();
                    Object.assign(request.player, playerData);

                    const matchResponse = await fetch(`https://api.faceit.com/match/v1/matches/groupByState?userId=${request.player.id}`);
                    const matchData = await matchResponse.json();

                    if (matchData.payload && Object.keys(matchData.payload).length > 0) {
                        const matchKeys = Object.keys(matchData.payload)[0];
                        const matches = matchData.payload[matchKeys].map((match) => ({ id: match.id, game: match.game }));
                        request.player.gameLobbies = matches;
                    } else {
                        request.player.gameLobbies = [];
                    }

                    return { action: "GetMorePlayer", data: request.player, success: true };
                } catch (error) {
                    console.error("[Faceit alternative addon] Error fetching player data:", error);
                    return { action: "GetMorePlayer", success: false, error: "Failed to get Faceit data" };
                }
            }

            getPlayerData(request)
                .then((response) => sendResponse(response))
                .catch((error) => {
                    console.error(error);
                    sendResponse({ action: "GetMorePlayer", success: false, error: "Failed to get Faceit data" });
                });

            return true;
        }
    });

    // Add more message listeners here...

})();
