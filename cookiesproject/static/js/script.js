function openNav() {
    document.getElementById("mySidenav").style.width = "400px";
    document.getElementById("main").style.marginRight = "400px";
    document.getElementById("main-content").style.marginRight = "400px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.getElementById("main-content").style.marginRight = "0";
}

function saveNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.getElementById("main-content").style.marginRight = "0";
    setCookie("theme", getTheme(), 3650);
    setCookie("user-number", getUserNumber(), 3650);
}

jQuery(function($){
    $('#main ul .topli a').on('click', function () {
        $(this).closest('#main ul').find('a.active').removeClass('active');
        $(this).addClass('active');        
    });
});

$(document).on('click', '#cats-link', function () {
    $(".space-content").css("display", "none");
    $(".cats-content").css("display", "inherit");
});

$(document).on('click', '#space-link', function () {
    $(".cats-content").css("display", "none");
    $(".space-content").css("display", "inherit");
    setMaxDate();
});


function getTheme() {
    var themeRadio = document.getElementsByName('theme-btn');
    var themeValue;
    for (var i = 0; i < themeRadio.length; i++) {
        if (themeRadio[i].checked) {
            themeValue = themeRadio[i].value;
        }
    }
    return themeValue;
}

function getUserNumber() {
    var userNumber = document.getElementsByName("user-number")[0].value;
    return userNumber;
}

function switch_style_dark() {
    document.getElementById("dark").disabled = false; //Dark theme enabled
    document.getElementById("color").disabled = true;
    document.getElementById("light").disabled = true;
    document.getElementById("dark-btn").checked = true; //Dark theme button checked
    document.getElementById("light-btn").checked = false;
    document.getElementById("color-btn").checked = false;
}

function switch_style_light() {
    document.getElementById("dark").disabled = true;
    document.getElementById("color").disabled = true;
    document.getElementById("light").disabled = false; //Light theme enabled
    document.getElementById("dark-btn").checked = false;
    document.getElementById("light-btn").checked = true; //Light theme button checked
    document.getElementById("color-btn").checked = false;
}

function switch_style_color() {
    document.getElementById("dark").disabled = true;
    document.getElementById("color").disabled = false; //Cookie theme enabled
    document.getElementById("light").disabled = true;
    document.getElementById("dark-btn").checked = false;
    document.getElementById("light-btn").checked = false;
    document.getElementById("color-btn").checked = true; //Cookie theme button checked
}

function checkCookie() {
    var css_theme = getCookie("theme");
    var user_number = getCookie("user-number");
    var cat_pic_url = getCookie("cat_pic_url");
    if (css_theme != "") {
        if (css_theme == "dark-theme") {
            switch_style_dark();
        } else if (css_theme == "light-theme") {
            switch_style_light();
        } else {
            switch_style_color();
        }
    }
    document.getElementsByName("user-number")[0].value = user_number;
    document.getElementById("cat-pic").src = cat_pic_url;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});


$(document).on('click', '.generate-cat', function () {
    $("#cat-text").text("");
    $("#cat-name").text("");
    $("#saved-to-db").text("");
    $('#save-desc-btn').css("display", "none");
    var breedID = $('#breed-select').val();
    $.ajax({
        type: 'GET',
        url: 'https://api.thecatapi.com/v1/images/search?breed_id=' + breedID,
        dataType: 'json',
        success: function (data) {
            cat_pic_url = data[0].url;
            $("#cat-pic").attr('src', cat_pic_url);
            if(data[0].breeds != "") {
                // console.log(data[0].breeds[0].description);
                $('#save-desc-btn').css("display", "initial");
                $("#cat-name").text(data[0].breeds[0].name);
                $("#cat-text").text(data[0].breeds[0].description);
            }
            setCookie("cat_pic_url", cat_pic_url, 3650);
        }
    });
});

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: 'https://api.thecatapi.com/v1/breeds',
        dataType: 'json',
        success: function (data) {
            var $breed = $('#breed-select');
            for(var i=0; i < data.length; i++) {
                $breed.append('<option id=' + data[i].id + ' value=' + data[i].id + '>' + data[i].name + '</option>');
            }
        }
    });
});

var token = '{{csrf_token}}';

$(document).on('click', '.save-cat-pic', function() {
    var cat_img_url = $('#cat-pic').attr("src");
    $.ajax({
        headers: { "X-CSRFToken": token},
        type: 'POST',
        url: '/cookiesapp/save_img/',
        dataType: 'json',
        data: {
            'img_url': cat_img_url,
        },
        success: function(data) {
            document.getElementById("saved-to-db").innerText = "Cat picture link successfully saved to database!";
        },
        error: function (textStatus, errorThrown) {
            alert("Status: "+ textStatus);
            alert("Error: "+ errorThrown);
        }
    });
});

$(document).on('click', '.save-cat-desc', function() {
    var cat_breed_id = $('#breed-select').val();
    var cat_breed_name = $('#cat-name').text();
    var cat_breed_desc = $('#cat-text').text();
    $.ajax({
        headers: { "X-CSRFToken": token},
        type: 'POST',
        url: '/cookiesapp/save_desc/',
        dataType: 'json',
        data: {
            'breed_id': cat_breed_id,
            'name': cat_breed_name,
            'description': cat_breed_desc,
        },
        success: function(data) {
            document.getElementById("saved-to-db").innerText = "Cat description successfully saved to database!";
        },
        error: function (textStatus, errorThrown) {
            alert("Status: "+ textStatus);
            alert("Error: "+ errorThrown);
        }
    });
});

$(document).on('click', '.get-apod', function () {
    $("#space-text").text("");
    $("#space-title").text("");
    $("#space-copyright").text("");
    $("#hd-url").text("");
    $("#hd-url").attr('href', 'javascript:void(0)');
    var space = "http://" + location.host + "/cookiesapp/space/";
    var spaceDate = $('#space-date').val();
    if(spaceDate<"1995-06-20" || spaceDate>setMaxDate()){
        spaceDate=setMaxDate();
    };
    $.ajax({
        type: 'GET',
        url: space,
        data: {'date': spaceDate},
        dataType: 'json',
        success: function (data) {
            if(data.url.includes("youtube")){
                $("#space-video").css("display", "initial");
                $("#space-pic").css("display", "none");
                $("#space-video").attr('src', data.url);
            }else{
                $("#space-video").css("display", "none");
                $("#space-pic").css("display", "initial");
                $("#space-pic").attr('src', data.url);
            }
            $("#space-title").text(data.title);
            $("#space-text").text(data.description);
            if(data.copyright != ""){
                $("#space-copyright").text("Copyright: " + data.copyright);
            };
            if(data.hdurl != ""){
                $("#hd-url").text("Click here for HD picture");
                $("#hd-url").attr('href', data.hdurl);
            }
        },
        error: function (textStatus, errorThrown) {
            alert("Status: "+ textStatus);
            alert("Error: "+ errorThrown);
        } 
    });
});

function setMaxDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("space-date").setAttribute("max", today);
    document.getElementById("space-date").setAttribute("value", today);
    return today;
}