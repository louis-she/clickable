document.getElementById('start').onclick = function() {
  chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {clickable: true, command: 'start', containerSelector: '.slide'});
    window.close();
  });
};

document.getElementById('stop').onclick = function() {
  chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {clickable: true, command: 'stop'});
    window.close();
  });
};

document.getElementById('export').onclick = function() {
  chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {clickable: true, command: 'export'});
    window.close();
  });
};
