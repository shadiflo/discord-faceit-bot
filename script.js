(() => {
    let currentMatchId = location.href;
  
    function removeElementById(id) {
      const element = document.getElementById(id);
      if (element) element.remove();
    }
  
    function formatDateTime(date, timeZone, format) {
      const options = {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      const dateParts = new Intl.DateTimeFormat("en-GB", options).formatToParts(date);
      const dateMap = new Map(dateParts.map(({ type, value }) => [type, value]));
  
      const year = dateMap.get("year");
      const month = dateMap.get("month");
      const day = dateMap.get("day");
      const hour = dateMap.get("hour");
      const minute = dateMap.get("minute");
  
      switch (format) {
        case "eu":
          return `${day}/${month}/${year} ${hour}:${minute}`;
        case "us":
          return `${month}/${day}/${year} ${hour}:${minute}`;
        default:
          throw new Error(`Invalid format: ${format}`);
      }
    }
  
    function createPlayerInfoDiv(player, rosterNumber, matchData) {
      const playerInfoDiv = document.createElement("div");
      playerInfoDiv.style.display = "flex";
      playerInfoDiv.style.alignItems = "center";
      playerInfoDiv.style.marginBottom = "5px";
  
      const playerButton = document.createElement("button");
      playerButton.textContent = player.nickname;
      playerButton.style.display = "inline-block";
      playerButton.style.marginRight = "7px";
      playerButton.style.textDecoration = "none";
      playerButton.style.color = "#fff";
      playerButton.style.width = "124px";
      playerButton.style.backgroundColor = "#ff5500";
      playerButton.style.border = "1px solid #000";
      playerButton.style.padding = "5px";
      playerButton.style.borderRadius = "5px";
  
      if (player.sheriff && player.sheriff.payload && player.sheriff.payload.length > 0) {
        playerButton.style.backgroundColor = "red";
        playerButton.style.border = "1px solid #ff0000";
      } else if (
        player.bans &&
        player.bans.payload &&
        player.bans.payload.length > 0
      ) {
        const hasActiveBan = player.bans.payload.some((ban) => !ban.expired);
        if (hasActiveBan) {
          playerButton.style.backgroundColor = "yellow";
          playerButton.style.border = "1px solid #ffff00";
        }
      }
  
      let isExpanded = false;
      let playerData = null;
  
      playerButton.addEventListener("click", async () => {
        if (!isExpanded) {
          try {
            const response = await new Promise((resolve, reject) => {
              chrome.runtime.sendMessage(
                {
                  action: "GetMorePlayer",
                  nickname: player.nickname,
                  player: player,
                },
                (response) => {
                  if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                  } else {
                    resolve(response);
                  }
                }
              );
            });
  
            if (response.success) {
              isExpanded = true;
              playerData = response.data;
            } else {
              console.error("Error:", response.error);
            }
          } catch (error) {
            console.error("Error in fetchPlayerData:", error);
          }
        }
  
        displayPlayerInfo(player, rosterNumber, matchData, isExpanded, playerData);
      });
  
      playerInfoDiv.appendChild(playerButton);
      return playerInfoDiv;
    }
  
    function displayPlayerInfo(player, rosterNumber, matchData, isExpanded, playerData) {
      const morePlayerInfo = document.getElementById("moreplayerinfo");
      if (morePlayerInfo && morePlayerInfo.getAttribute("data-player-id") === player.id) {
        morePlayerInfo.remove();
        return;
      }
  
      if (morePlayerInfo && morePlayerInfo.getAttribute("data-player-id") !== player.id) {
        morePlayerInfo.remove();
      }
  
      const playerInfoDiv = document.createElement("div");
      playerInfoDiv.setAttribute("id", "moreplayerinfo");
      playerInfoDiv.setAttribute("data-player-id", player.id);
      playerInfoDiv.style.position = "absolute";
      playerInfoDiv.style.bottom = "2px";
  
      const targetButton = rosterNumber === 1 ? document.getElementsByName("altroster1")[0] : document.getElementsByName("altroster2")[0];
      const rect = targetButton.getBoundingClientRect();
      const leftPosition = rosterNumber === 1 ? rect.left - 333 + "px" : rosterNumber === 2 ? `${rect.right + 2}px` : "auto";
  
      playerInfoDiv.style.left = leftPosition;
      playerInfoDiv.style.padding = "10px";
      playerInfoDiv.style.backgroundColor = "#212121";
      playerInfoDiv.style.border = "2px solid black";
      playerInfo
  