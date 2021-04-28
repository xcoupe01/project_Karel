
function openNav() {
    document.getElementById("sideNav").style.width = "200px";
    document.getElementById("main").style.marginLeft = "200px";
    var elements = document.getElementsByClassName("padded");
    for(var i = 0; i < elements.length; i++){
        elements[i].style.marginLeft = "25px";
        elements[i].style.marginRight = "25px";
    }
}
  
function closeNav() {
    document.getElementById("sideNav").style.width = "0px";
    document.getElementById("main").style.marginLeft = "0px";
    var elements = document.getElementsByClassName("padded");
    for(var i = 0; i < elements.length; i++){
        elements[i].style.marginLeft = "125px";
        elements[i].style.marginRight = "125px";
    }
}

function toggleNav(){
    if(document.getElementById("sideNav").style.width == "0px"){
        openNav();
    } else {
        closeNav();
    }   
}

function moveSlideshow(){
    var i = 0;
    const numOfSlides = 4;
    const bgImageStringStart = "url('./is/img/introduction";
    const bgImageStringEnd = ".png')"

    setInterval(function(){
        document.getElementById('introduction').style.backgroundImage = bgImageStringStart + i + bgImageStringEnd;
        i += 1;
        if(i >= numOfSlides){
            i = 0;
        }
    }, 3000);
}

function runKarel(slabel){
    $.ajax({
        type: 'GET',
        url: 'index.php?f=json&slabel='+slabel,
        timeout: 2000,
        success: function(data) {
            if (typeof data['Err'] !== typeof undefined){
                alert(data['Err']);
            } else {
                localStorage.setItem("onUnload", JSON.stringify(data));
                window.location.href = "karel.html";
            }  
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert('Timeout contacting server..');
        }
    });
}

if(document.getElementById('introduction') != null){
    moveSlideshow();
}

$(document).ready(function(){
    $('sideNav, a').on('click', function(event){
        if(this.hash !== ""){
            if(window.location.href.indexOf('?') > 0){
                window.location.href = 'index.php' + this.hash;
            }
            event.preventDefault();
            var hash = this.hash;
            $('html, body, main').animate({
                scrollTop: $(hash).offset().top - $('#introduction').offset().top - 48
            }, 500, function(){
                window.location.hash = hash;
            })
        }
    });
});

if(document.getElementById("dialogClose") != null){
    document.getElementById("dialogClose").onclick = function(){
        document.getElementById("dialog").style.display = "none";
    }
}

if(document.getElementById("ssrc") != null){
    window.editor=ace.edit("ssrc");
    window.editor.setTheme('ace/theme/chrome');
    window.editor.setOptions({
        mode: 'ace/mode/json',
        fixedWidthGutter: true,
    }); 
}