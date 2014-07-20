// This script is able to creates and handles context menus

var link = null;

// sends link to page when clicked on our menu item
var share_link = function(info, tab) {
    if(!link)
        return;

    console.log("bg:context_menu_linkit_clicked:'"+link+"'");
    var share_link_port = chrome.tabs.connect(tab.id, {name:"share_link"});
    share_link_port.postMessage(link);
}

chrome.contextMenus.create(
    {"title": "Link It too!", "onclick": share_link, "contexts": ["all"]});

// saves the link to element when it's right-clicked
chrome.runtime.onConnect.addListener(function(port) {
    if(port.name == "elem_link")
    {
        port.onMessage.addListener(function(msg) {
            link = msg;
        });
    }
});