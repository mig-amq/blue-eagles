$(document).ready(function(){
    $("#buildings a").each((i, o) => {
        
        $(o).click((e) => {
            e.preventDefault();
            var scene = $("#frame")[0].contentWindow.findSceneById($(o).attr("data-scene"));
            $("span#location").text($(o).text());
            $("#frame")[0].contentWindow.switchScene(scene);
        });
    });
});