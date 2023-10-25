(() => {
    const e = document.querySelector(".responsive_page_template_content").innerHTML.split("script")[2].split('"')[8] ?? "";
  
    function formatDate(e, timeZone, format) {
      const options = {
        timeZone: timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      const parts = new Intl.DateTimeFormat("en-GB", options).formatToParts(e);
      const partMap = new Map(parts.map(({ type, value }) => [type, value]));
      const year = partMap.get("year");
      const month = partMap.get("month");
      const day = partMap.get("day");
      const hour = partMap.get("hour");
      const minute = partMap.get("minute");
  
      switch (format) {
        case "eu":
          return `${day}/${month}/${year} ${hour}:${minute}`;
        case "us":
          return `${month}/${day}/${year} ${hour}:${minute}`;
        default:
          throw new Error(`Invalid format: ${format}`);
      }
    }
  
    function createFaceitDataContainer(data) {
      if (data.length) {
        const container = document.createElement("div");
        container.id = "faceit-data-container";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.position = "absolute";
        container.style.right = "1px";
        container.style.left = "1px";
        container.style.width = "325px";
        container.style.top = "105px";
        container.style.zIndex = "999";
        container.style.overflow = "hidden";
  
        for (let i = 0; i < data.length; i++) {
          const div = document.createElement("div");
          div.className = "faceit-data";
          div.style.width = "300px";
          div.style.height = "auto";
          div.style.borderRadius = "2px";
          div.style.background = "#212121";
          div.style.color = "#fff";
          div.style.boxShadow = "0px 0px 20px rgba(0, 0, 0, 0.5)";
          div.style.padding = "10px";
          div.style.fontSize = "12px";
          div.style.border = "2px solid black";
          div.style.marginBottom = "4px";
          container.appendChild(div);
  
          const header = document.getElementById("global_header");
  
          if (header) {
            header.parentNode.insertBefore(container, header.nextSibling);
          }
  
          let gameInfo = "";
          const games = data[i].player.games ?? {};
  
          if (Object.keys(games).length === 0) {
            gameInfo = "No games";
          } else {
            for (const [game, info] of Object.entries(games)) {
              if (data[i].player.status === "deactivated") {
                const { skill_level } = info;
                gameInfo += `<strong>${game.toUpperCase()}</strong> - <strong>LEVEL:</strong> ${skill_level}<br>`;
              } else {
                const { skill_level, faceit_elo, region, game_id } = info;
                const startTime = formatDate(new Date(info.starts_at), data[i].sheriff.timeZone, "eu");
                const endTime = info.ends_at === null ? "Permanent" : formatDate(new Date(info.ends_at), data[i].sheriff.timeZone, "eu");
                let timeLeft = "";
                if (endTime !== "Permanent") {
                  const timeDiff = new Date(info.ends_at) - new Date();
                  if (timeDiff > 0) {
                    const seconds = Math.floor(timeDiff / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    if (hours > 0) timeLeft += `${hours}h `;
                    if (minutes % 60 > 0) timeLeft += `${minutes % 60}m `;
                    if (seconds % 60 > 0) timeLeft += `${seconds % 60}s`;
                  }
                }
                gameInfo += `<strong>${game.toUpperCase()}</strong> - <strong>LEVEL:</strong> ${skill_level} - <strong>ELO:</strong> ${faceit_elo} - <strong>REGION:</strong> ${region}<br>ID: ${game_id}<br><br>`;
                gameInfo += `<strong>Started at:</strong> ${startTime} <br><strong>Ends:</strong> ${endTime}`;
                if (timeLeft) {
                  gameInfo += ` <br><strong>Time left:</strong> ${timeLeft}`;
                }
              }
            }
          }
  
          let sheriffInfo = "";
          if (data[i].sheriff.payload && data[i].sheriff.payload.length > 0) {
            for (const item of data[i].sheriff.payload) {
              const startTime = formatDate(new Date(item.starts_at), data[i].sheriff.timeZone, "eu");
              const endTime = item.ends_at === null ? "Permanent" : formatDate(new Date(item.ends_at), data[i].sheriff.timeZone, "eu");
              let timeLeft = "";
              if (endTime !== "Permanent") {
                const timeDiff = new Date(item.ends_at) - new Date();
                if (timeDiff > 0) {
                  const seconds = Math.floor(timeDiff / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  if (hours > 0) timeLeft += `${hours}h `;
                  if (minutes % 60 > 0) timeLeft += `${minutes % 60}m `;
                  if (seconds % 60 > 0) timeLeft += `${seconds % 60}s`;
                }
              }
              sheriffInfo += `<strong>${item.type.toUpperCase()}</strong> <strong>banned</strong> <br><strong>Reason:</strong> ${item.reason} <br><strong>Started at:</strong> ${startTime} <br><strong>Ends:</strong> ${endTime}`;
              if (timeLeft) {
                sheriffInfo += ` <br><strong>Time left:</strong> ${timeLeft}`;
              }
            }
          }
  
          let banInfo = "";
          if (data[i].bans && data[i].bans.payload.length > 0) {
            for (const item of data[i].bans.payload) {
              if (!item.expired) {
                const banStart = formatDate(new Date(item.banStart), data[i].sheriff.timeZone, "eu");
                const banEnd = formatDate(new Date(item.banEnd), data[i].sheriff.timeZone, "eu");
                const timeDiff = new Date(item.banEnd) - new Date();
                const daysLeft = Math.ceil(timeDiff / 86400000);
                let timeLeft = "";
                if (timeDiff > 0) {
                  const seconds = Math.floor(timeDiff / 1000);
                  const minutes = Math.floor(seconds / 60);
                  const hours = Math.floor(minutes / 60);
                  if (hours > 0) timeLeft += `${hours}h `;
                  if (minutes % 60 > 0) timeLeft += `${minutes % 60}m `;
                  if
  