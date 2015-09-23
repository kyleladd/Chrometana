function save_options(element,value) {
  chrome.storage.sync.set({
    search_engine: value
  }, function() {
    for (i = 0; i <  selectorList.length; i++) {
      removeClass(selectorList[i], 'selected');
    }
    addClass(element, 'selected');
    var status = document.getElementById('status');
    status.textContent = 'New search engine preferences saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.runtime.sendMessage({"action": "defaultEngine"},
    function (defaultEngine) {
      chrome.storage.sync.get({
        search_engine: defaultEngine
      }, function(items) {
        for (i = 0; i <  selectorList.length; i++) {
          if (selectorList[i].getAttribute('value') == items.search_engine) {
            addClass(selectorList[i], 'selected');
          }
          else {
            removeClass(selectorList[i], 'selected');
          }
        }
        document.getElementById("custom_engine").value = items.search_engine;
      });
    });
}

//Parses arguments from URL
function getURLVariable(variable){
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

var selectorList = document.getElementsByClassName('selector');

document.addEventListener('DOMContentLoaded', restore_options);

if (getURLVariable("newinstall") == "yes"){
  var installadvice = document.getElementById('installadvice');
  installadvice.textContent = 'To come back to this page at any time, go to Chrome Settings, open Extensions, and click Options underneath Chrometana';
}

for (i = 0; i <  selectorList.length; i++) {
  selectorList[i].addEventListener('click', function() {
    save_options(this,this.getAttribute("value"));
  });
}

document.getElementById('custom_engine_update').addEventListener('click', function() {
  var element = document.getElementById('custom_engine');
  save_options(element,element.value);
});

function addClass(element, classNameToAdd) {
  if (!element.className.includes(classNameToAdd)) {
    element.className = element.className + ' ' + classNameToAdd;
  }
}

function removeClass(element, classNameToAdd) {
  element.className = element.className.replace(classNameToAdd, '');
}