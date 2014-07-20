// ======================== LOGIC ==========================

// main function:
// constructs link by given DOM node
var make_link = function(node)
{
  // if node is a <a> tag
  if(node.href)
    return node.href;
  // if node has id
  if($(node).attr("id"))
    return url.hash($(node).attr("id")).toString();
  // console.log(node.nodeName); console.log(node.nodeValue); 
  // console.log(node.parentNode); console.log(node.childNodes); console.log(node.attributes);
  return node.nodeName;
};

// show the link to user
var share = function(link) {
    console.log("linkit:share_url:'"+link+"'");
    alert(link);
}

// ====================== COMMUNICATIONS ===================

// port to send constructed link to selected element
var elem_link_port = chrome.runtime.connect({name: "elem_link"});
var url = URI(window.location.href);

// sends link to background page
var send_elem_link = function(linking, e) {
    var link = linking(e.srcElement)
    if(link)
    {
        elem_link_port.postMessage(link);
    }
  }

// for each right-clicked element try to create link
if (document.body) {
  document.body.addEventListener("contextmenu", send_elem_link.bind(null, make_link));
}

// if backround page send a link
chrome.runtime.onConnect.addListener(function(port) {
  if(port.name == "share_link")
  {
      port.onMessage.addListener(function(msg) {
          share(msg);
    });
  }
});