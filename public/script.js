var mappings = {}

function generateLinks (scenes) {
    $("#location").click((e) => {
        e.preventDefault();
        $("#frame")[0].contentWindow.resetScene();
    });

    scenes.forEach(({data, scene, view}, i, a) => {
        if (data.initial) {
            let link = $(`<li><a data-scene="${data.id}">${data.name}</a></li>`);

            link.click((e) => {
                e.preventDefault();
                $("#frame")[0].contentWindow.switchScene({data, scene, view}, 0.0);

                adjustCoords();
            });

            $("#buildings li ul").append(link);
        }
    });
}

function changeFloor(name, floor) {
    $("#location").text(name);

    changeMinimap(floor);
}

function adjustCoords(){
    
    console.log("adjust");
    // adjust coordinates
    var image=$('img[usemap]');
    var originalWidth=image[0].naturalWidth;
    var currentWidth=image.width();
    var ratio=currentWidth/originalWidth;

    $("map area").each(function(){
        //change that to your area selector
        var coords=$(this).attr('data-original-coords').split(',');
        coords = coords.map(function (x) {
            return Math.round(x*ratio);
            //i don't know if all browsers can accept floating point so i round the result
        });
        $(this).attr('coords',coords.join());
    });
}

function changeMinimap(floor) {
    $("img[usemap]").attr("data-target", floor);
    
    $("map").empty()
    $("map").append(mappings[floor])

    if (floor.length > 2 && floor[2].toLowerCase() == 'm') {
        $("img[usemap]").attr("src", "/maintour/img/minimaps/HSSH" + floor[0] + "M.png");
    } else if (floor.length > 2) {
        $("img[usemap]").attr("src", "/maintour/img/minimaps/HSSH" + floor[0] + floor[1] + ".png");
    } else {
        $("img[usemap]").attr("src", "/maintour/img/minimaps/HSSH" + floor[0] + ".png");
    }

    adjustCoords();
}

// When the user clicks on the button, open the modal 
function displayModal() {
    var modal = document.getElementById('popup');
    var content = document.getElementById('content')
    var image = document.getElementById('popupImg');
    image.src="maintour/img/link.png"
    modal.style.display = "block";
}

$(document).ready(() => {

    $("map area").each((i, o) => {
        let elem = $(o);

        if (mappings[elem.attr("data-group-id")])
            mappings[elem.attr("data-group-id")].push(elem)
        else
            mappings[elem.attr("data-group-id")] = [elem]
    })
    
    
    $(window).resize(function(){
        adjustCoords();
    });


    adjustCoords();

    // Get the modal
    var modal = document.getElementById('popup');
    console.log(modal)
    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close");

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }

    $(document).click("map area", (e) => {
        let elem = $(e.target);
        
        if (elem.attr("data-scene"))
            $("#frame")[0].contentWindow.minimapClick(elem.attr("data-scene"), parseFloat(elem.attr("data-yaw")));
    })
});


// $(document).ready(function(){

//     $("#buildings a").each((i, o) => {
        
//         $(o).click((e) => {
//             e.preventDefault();
//             var scene = $("#frame")[0].contentWindow.findSceneById($(o).attr("data-scene"));
//             $("#location").text($(o).text());
//             $("#frame")[0].contentWindow.switchScene(scene);
//         });
//     });
// });