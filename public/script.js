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
                $("#frame")[0].contentWindow.switchScene({data, scene, view});
            });

            $("#buildings li ul").append(link);
        }
    });
}

function changeFloor(name, id) {
    $("#location").text(name);
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