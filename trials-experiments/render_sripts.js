
$(document).ready(function(){
    alert("Test")
    document.getElementById("location").onclick = function() {
        //alert("hahah")
        console.log("change scene")
        window.frames[0].frameElement.contentWindow.switchScene("0-agno-gate-a"); 
        // document.getElementById('frame').contentWindow.switchScene("0-agno-gate-a");
    }
    
})