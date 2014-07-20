// ======================== LOGIC ==========================
var url = URI(window.location.href);

// main function:
// constructs link by given DOM node
var makeLink = function(node) {
    if(node.href) // if node is an <a> tag
        return node.href;
    
    node = $(node);
    if(node.attr("id")) // if node has an id
        return url.hash(node.attr("id")).toString();
    
    if (node.prop("nodeName").toLowerCase() == "body") // pure URL
        return url.fragment("").toString();
    
    // construct child index chain while
    // parent has no id or it's not a body
    var hash = "$";
    do {
        hash += (node.index()+'-');
        node = node.parent();
        if(node.prop("nodeName").toLowerCase() == "body")
            return url.hash(hash+"body").toString();
        if(node.attr("id"))
            return url.hash(hash + "id=" + node.attr("id")).toString();
    } while (true);
};

/*
// jQuery extension function
// that scrolls page to specified element
// e.g. $('body').goTo();
(function($) {
    $.fn.goTo = function() {
        $('html, body')
        return this;
    }
})(jQuery);
*/

var goToLink = function(url) {
    console.log("go_to: whole_url: "+url);
    var fragment = url.fragment();
    if(!fragment)
        return;
    console.log("go_to: fragment: "+fragment);
    
    fragment = fragment.toLowerCase();
    if (fragment.charAt(0) != '$') {
        console.log("go_to: head_fragment: "+fragment.charAt(0));
        return; // not our case
    }
    fragment = fragment.slice(1); // cut the $ flag
    
    console.log("go_to: haired_fragment: "+fragment);
    
    var start;
    var idIndex = fragment.indexOf("-id=");
    
    if(idIndex < 0) {
        idIndex = fragment.indexOf("-body");
        console.log("go_to: idIndex: "+idIndex);
        if((idIndex < 0) || (idIndex != fragment.length - 5))
            return;
        start = $("body");
    }
    else {
        console.log("go_to: idIndex: "+idIndex);
        start = $("#"+fragment.slice(idIndex+4));
    }
    console.log("go_to: start: "+start.prop('nodeName'));
    fragment = fragment.slice(0, idIndex);
    var indexes = fragment.split('-');
    console.log("go_to: path: "+indexes);
    
    for (var i = indexes.length - 1; i >= 0; --i) {
        var index = indexes[i];
        ch = start.children();
        console.log("go_to: next: length: "+ch.length+ " index: " + index);
        //if(index >= ch.length) break;
        start = $(ch[index]);
        console.log("go_to: next: "+start.prop('nodeName'));
    }
    console.log("go_to: final: "+start.prop('outerHTML'));
    //start.goTo();
    
    $("html, body").animate({ scrollTop: start.offset().top }, "fast");
    start.fadeOut(500).fadeIn(300);
};

goToLink(url);

var copyToClipboard = function(text) {
  window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
};

var createPopup = function(text) {
    var widgetHtml = '<div id="main"><p>'+text+'</p></div>';
    var iframe = document.createElement('iframe');
    document.documentElement.appendChild(iframe);
    iframe.contentDocument.body.innerHTML = widgetHtml;
};

// show the link to user
var share = function(link) {
    console.log("linkit:share_url:'"+link+"'");
    copyToClipboard(link);
    //createPopup(link);
    // alert(link);
};


// ====================== COMMUNICATIONS ===================

// port to send constructed link to selected element
var elemLinkPort = chrome.runtime.connect({name: "elem_link"});

// sends link to background page
var sendElemLink = function(linking, e) {
    var link = linking(e.srcElement)
    if(link) {
        elemLinkPort.postMessage(link);
    }
};

// for each right-clicked element try to create link
if (document.body) {
    document.body.addEventListener("contextmenu", sendElemLink.bind(null, makeLink));
};

// if backround page send a link
chrome.runtime.onConnect.addListener(function(port) {
    if(port.name == "share_link") {
        port.onMessage.addListener(function(msg) {
            share(msg);
        });
    }
});