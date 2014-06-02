// jQuery extension function
(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'fast');
        return this;
    }
})(jQuery);


$('body').goTo();
var rightclicked_item = null;

var rightPort = chrome.runtime.connect({name: "right_clicked"});
rightPort.onMessage.addListener(function(msg) {
  console.log(msg);
});

url = null;
var urlPort = chrome.runtime.connect({name: "get_url"});
urlPort.onMessage.addListener(function(msg) {
  console.log(msg);
  url = msg.URL;
});
urlPort.postMessage();



var process_item = function(x)
{
  if(x.href)
    return x.href;
  if($(x).attr("id"))
    return URI(url).hash($(x).attr("id")).toString();
//   console.log(x.nodeName);
//   console.log(x.nodeValue);
//   console.log(x.parentNode);
//   console.log(x.childNodes);
//   console.log(x.attributes);
  return $(x).nodeName;
};

if (document.body) {
  document.body.addEventListener("contextmenu", rightclick.bind(null,process_item));
  document.body.addEventListener("click", function() {
    rightclicked_item = null;
  });
}

function rightclick(process_item, e) {
    rightclicked_item = e.srcElement;
    var handled = process_item(rightclicked_item)
    if(handled)
      console.log("INFO: " + handled)
      rightPort.postMessage(handled);
    // console.log(rightclicked_item);
  }