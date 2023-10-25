document.getElementById("saveToken").addEventListener("click", () => {
    const token = document.getElementById("token").value;
    chrome.storage.local.set({ token }, () => {});
  });
  
  document.getElementById("clearToken").addEventListener("click", () => {
    chrome.storage.local.remove("token", () => {
      document.getElementById("token").value = "";
    });
  });
  
  document.getElementById("showToolCheckbox").addEventListener("change", () => {
    const showTool = document.getElementById("showToolCheckbox").checked;
    chrome.storage.local.set({ showTool }, () => {});
  });
  
  chrome.storage.local.get("token", (result) => {
    if (result.token) {
      document.getElementById("token").value = result.token;
    }
    if (typeof result.showTool === "boolean") {
      document.getElementById("showToolCheckbox").checked = result.showTool;
    }
  });
  