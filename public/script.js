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