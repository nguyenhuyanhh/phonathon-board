"use strict";

function getBuildInfo() {
    // Counting GitHub commits - get the diff between
    // latest and initial commits, then plus 1
    var initSHA = "dabfd3352d2779b94fd01048d334b0c4d8c91c96";
    var latestRequest = new XMLHttpRequest();
    var buildRequest = new XMLHttpRequest();

    // Request latest commit via GitHub REST API v3
    latestRequest.open("GET", "https://api.github.com/repos/nguyenhuyanhh/phonathon-board/git/refs/heads/master", true);
    latestRequest.send();

    // Parse latest commit
    latestRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(latestRequest.responseText);
            var latestSHA = response["object"]["sha"];
            console.debug("Latest commit: " + latestSHA);

            // Request build number
            buildRequest.open("GET", "https://api.github.com/repos/nguyenhuyanhh/phonathon-board/compare/" + initSHA + "..." + latestSHA, true);
            buildRequest.send();
        }
    };

    // Parse build number
    buildRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(buildRequest.responseText);
            var buildNo = response["total_commits"] + 1;
            console.debug("Current build: " + buildNo);
            document.getElementById("build").innerHTML = buildNo;
        }
    };
}

window.addEventListener("DOMContentLoaded", getBuildInfo);