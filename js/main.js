var tag = $('#container').attr('data'),
    medias = "/media/recent/?",
	url_begins = "https://api.instagram.com/v1/tags/",
    token = "access_token=" + get_url_vars()["access_token"],
    next_url = "",
    faded = false,
	overlay_screen =  $('#loadOverlay'),
	more_btn = $('#morePics');

function get_url_vars() {
  var vars = []
  var hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&');

  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1]
  }
  return vars
}

function get_grams() {
  var processUrl = url_begins + tag + medias + token;
  load_grams(processUrl);
}

function load_grams(url) {
  load_url = url;

  $.ajax({
    type: "GET",
    dataType: "jsonp",
    cache: false,
    url: load_url,
    success: function (results) {
      j_data = results;
      create_layout(j_data);
    },
    complete: function(){
	  overlay_screen.fadeOut();
      $('#morePics').attr("data", next_url);
	  is_loading = false;
    }
  });
}

function create_layout(json_data) {
  var feed = json_data
  next_url = feed.pagination.next_url;

  for (var i in feed.data) {
    if (feed.data[i].caption !== null){
		 
        var caption_insta = feed.data[i].caption.text;
	    var image_insta = feed.data[i].images.standard_resolution.url;
	  		
	    $('<li class="instaContainer">' +
	      '<div class="overLay" >' +
	      '<h2>' + caption_insta + '</h2>' +
	      '</div>' +
	      '<img src="' + image_insta + '"/>' +
          '</li>')
	      .addClass('hiddenImage')
	      .appendTo('#imageContainer')
	      .delay(500 * i)
	      .fadeIn()
	      .bind("click", showHide);
      }
   }
}

//** CONTROLS **//
more_btn.click(function () {
  overlay_screen.fadeIn();
  is_loading = true;
  var page_url = $(this).attr('data');
  load_grams(page_url);
});

//** USED IN PLACE OF HOVER FOR DEVICES WITH NO HOVER **//
function showHide() {
  if (faded) {
    $('#imageContainer').find('.faded').animate({
      opacity: ".9"
     }).removeClass('faded');
     $(this).find('.overLay').animate({
      opacity: ".2"
     }).addClass('faded');
  }else{
	 faded = true;
     $(this).find('.overLay').animate({
       opacity: ".2"
     }).addClass('faded');
  }
}
//** START THIS JAMMIE **//
get_grams();
