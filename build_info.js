function getBuildInfo() {
    // Get build information from GitHub

    // Request info via GitHub REST API v3
    var request = new XMLHttpRequest();
    request.open("GET", "https://api.github.com/repos/nguyenhuyanhh/phonathon-board/contributors", true);
    request.send();

    // Parse response
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(request.responseText);
            var buildNo = response[0]["contributions"];
            console.log("Current build: " + buildNo);
            document.getElementById("build").innerHTML = "v" + buildNo;
        }
    }
}

window.addEventListener("DOMContentLoaded", getBuildInfo);