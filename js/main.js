/*
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


more_btn.click(function () {
  overlay_screen.fadeIn();
  is_loading = true;
  var page_url = $(this).attr('data');
  load_grams(page_url);
});

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

get_grams();
*/


var tags = "",
  users = null,
  url_begins = "https://api.instagram.com/v1/tags/",
  medias = "/media/recent/?",
 // token = "&access_token=1478649889.8cc9a6f.f3bee637abf54ca9a35ff74c87017e4a",
 token = "&access_token=" + get_url_vars()["access_token"],
  next_url = "",
  count = "&count=16",
  get_tag = $('#image_container').attr('rel'),
  instructions_open = false,
  admin_username = "closerlookgrams";
admin_tag = "#hide";

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

function get_grams(tag) {
    tags = tag;
    var process_url = url_begins + tags + medias + count + token;
    load_grams(process_url);
}

function load_grams(url) {
    load_url = url;
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        async: false,
        url: load_url,
        success: function (results) {

            console.log(results);
            next_url = results.pagination.next_url;
            current_url = $('#more_pics').attr("data");
            console.log(next_url);
            console.log(current_url);
            if (next_url == undefined) {
                $('#more_pics').fadeOut();
                console.log("hide that button");
            } else {
                console.log("add a more pics");
                $('#more_pics').attr("data", next_url);
            }
            process_grams(results);
        }
    });
}

function fade_in_loader() {
    $('#load_overlay').fadeIn();
}

function fade_out_loader() {
    $('#load_overlay').fadeOut();
}

function scan_comments(comment_obj, insta_obj) {
    comments = {};
    console.log("checking comments");
    data_comments = comment_obj;
    for (var m in data_comments) {
        user_comment = String(data_comments[m].text).toLowerCase();
        user_name = String(data_comments[m].from.username).toLowerCase();
        comments[user_name] = user_comment;

    }
    if (comments[admin_username] && comments[admin_username].indexOf(admin_tag) > -1) {
        console.log("we need this hidden");
    } else {
        console.log("third catch if things slip by");
        append_grams(insta_obj);
    }
}

function append_grams(gram_data) {
    grams_info = gram_data;
    image_insta = grams_info.images.standard_resolution.url;
    if (grams_info.caption !== null) {
        caption_insta = grams_info.caption.text.substring(0, 175) + " .....";
    } else {
        caption_insta = "";
    }
    link_insta = grams_info.link;
    profile_name_insta = grams_info.user.username;
    profile_pic_insta = grams_info.user.profile_picture;
    $('<li class="insta_container" rel="' + link_insta + '"><img src="' + image_insta + '" ><div class="overlay" target="_blank" target="_blank"><h2>' + caption_insta + '</h2><div class="user_info"><p>' + profile_name_insta + '</p><img class="user_image" src="' + profile_pic_insta + '"/></div></li>').bind("click", show_hide).addClass('hidden_image').appendTo('#image_container').delay(500);
}

function process_grams(return_data) {
    results = return_data;
    fade_out_loader();
    for (var i in results.data) {
        insta_comment_count = results.data[i].comments.count;
        insta_comment_data = results.data[i].comments.data;
        if (insta_comment_count >= 1) {
            scan_comments(insta_comment_data, results.data[i]);
        } else {
            append_grams(results.data[i]);
        }
    }
}

function show_hide(event) {
    console.log("clicked");
    evt_obj = $(this);
    is_active = evt_obj.hasClass("active");
    if (is_active) {
        link = evt_obj.attr("rel");
        w = window.open(link, "_blank");
    } else {
        old_target = $('li.insta_container.hidden_image.active');
        evt_obj.addClass("active").find(".overlay").stop().animate({ left: "100%" }, function () {
            old_target.removeClass("active").find('.overlay').stop().animate({ left: "0" });
        });
    }
}

function display_menu(event) {
    event.preventDefault();
    if (instructions_open) {
        $('#load_overlay #menu .slide_container').animate({
            scrollTop: "0"
        }, 580, function () {
            $('#load_overlay #menu .controls #back.btn').fadeOut(function () {
                instructions_open = false;
                $('#load_overlay').fadeToggle(function () {
                    $('#menu').fadeToggle();
                });
            });
        });
    } else {
        $('#load_overlay').fadeToggle(function () {

            $('#menu').fadeToggle();
        });
    }
}

function reset_menu() {
    $('#load_overlay #menu .slide_container').animate({
        scrollTop: "0"
    }, 580, function () {
        $('#load_overlay #menu .controls #back.btn').fadeOut(function () {
            instructions_open = false;
        });
    });
}

function show_instructions_menu() {
    instructions_open = true;
    $('#load_overlay #menu .slide_container').animate({
        scrollTop: $('#load_overlay #menu ul').height()
    }, 580, function () {
        $('#load_overlay #menu .controls #back.btn').fadeIn();
    });
}

function position_sub_menu() {
    console.log("called resize");
    if (window.innerWidth < 500 && instructions_open === true) {
        $('#load_overlay #menu .slide_container').animate({
            scrollTop: $('#load_overlay #menu ul').height()
        }, 580);
    }
}

$('#controls #logo').on("click", display_menu);
$('#menu .controls #close.btn').on("click", display_menu);
$('#menu .controls #back.btn').on("click", reset_menu);
$('#menu ul li#inst_btn').on("click", show_instructions_menu);
$(window).on("resize", position_sub_menu);
$('#controls #more_pics').on("click", function () {
    var page_url = $(this).attr('data');
    fade_in_loader();
    load_grams(page_url);
});


get_grams(get_tag);
