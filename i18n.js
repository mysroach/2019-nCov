// Load a specific language module.
//
// If 'fallback' is true, 
//
function load_lang(locale, callback, fallback) {
  $.ajax(`locales/${locale}/text.json`)
    .done(function(text){
      var data = myJsonParse(text);
      i18n.translator.add(data);
      callback();
    })
    .fail(function() {
      if (fallback == true) {
        alert("Cannot fallback to en-US. Please try again later.");
        callback();
      } else {
        console.warn(`Unsupported language [${locale}], fallback to en-US.`);
        load_lang("en-US", callback, true);
      }
    });
}

// Process the i18n initialization.
//
// If 'hl=' is set in URL, use that value. If not, use a trick to get user agent's preference.
//
// Callback is provided to update the i18n message after we know the language setting of the
// user agent.
//
function load_i18n(callback) {
  let lang = PARAMS.get("hl");

  if (lang) {
    load_lang(lang, callback);
  } else {
    $.ajax({ 
        url: "https://ajaxhttpheaders.appspot.com", 
        dataType: 'jsonp', 
        success: function(headers) {
            let language = headers['Accept-Language'];
            // en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7
            let lang = language.split(",")[0];
            load_lang(lang, callback);
        }
    });
  }
}

// Called after i18n .json file is loaded.
//
// This function iterates all elements starting with "HTML_" prefix. Then replace the
// innerHTML with i18n string (by its ID).
//
// It also does similar things for IMG.
//
function update_i18n_UI() {
  $("[id^=HTML_]").each(function(idx) {
    $(this).html(i18n($(this)[0].id));
  });

  $("[id^=IMG_]").each(function(idx) {
    $(this).attr("src", i18n($(this)[0].id));
  });

  window.document.title = i18n("HTML_APP_NAME");
}
