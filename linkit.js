rightclicked_item = null
function genericOnClick(info, tab) {
//   console.log("item " + info.menuItemId + " was clicked");
//   console.log("info: " + JSON.stringify(info));
   console.log(JSON.stringify(rightclicked_item));
//   console.log("tab: " + JSON.stringify(tab));
}


chrome.contextMenus.create(
  {"title": "Link It too!", "onclick": genericOnClick, "contexts": ["all"]});

chrome.runtime.onConnect.addListener(function(port) {
  if(port.name == "right_clicked")
  {
    port.onMessage.addListener(function(msg) {
      rightclicked_item = msg;
      genericOnClick(); 
      port.postMessage({ack: "Get it."});
    });
  }
  else if(port.name == "get_url")
  {
    port.onMessage.addListener(function(msg) {
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        port.postMessage({URL: tabs[0].url});
      });
    });
  }
});
