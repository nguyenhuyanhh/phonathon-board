"use strict";

var publicSpreadsheetUrl = "1btD0w0p58ZNJzSfDRGtCiZCCjvK80OkLKOA0j9YXbic";
var board = new Board();

function loadBoard() {
    // load the spreadsheet using Tabletop
    console.log("Refreshing data from spreadsheet.");
    board.clear();
    Tabletop.init({
        key: publicSpreadsheetUrl,
        callback: process,
    });
}

function pledgesFromStr(caller, str, type, special) {
    // get the pledges from a str, add to a Caller
    var order = 0;
    var pledges = str.split(",");
    pledges.forEach(element => {
        if (special == "1") {
            caller.addPledge(new Pledge(element, type, order));
        }
        else {
            if (!isNaN(element)) {
                caller.addPledge(new Pledge(parseInt(element), type, order));
            }
        }
        order++;
    });
}

function process(data, tabletop) {
    // get the spreadsheet
    data = tabletop.sheets("Pledges").all();
    var settings = tabletop.sheets("Settings").all()[0];

    // log the settings
    if (settings.special_mode == "1") {
        console.log("Special mode is on.");
    }
    if (settings.maintenance == "1") {
        console.log("Maintenance mode is on.");
    }
    if (settings.manual_refresh == "1") {
        console.log("Auto-refresh is off.");
    }

    // process the spreadsheet
    for (var i = 0; i < data.length; i++) {
        // get caller
        var caller = new Caller(data[i].Caller);

        // get pledges
        if (data[i].Pledge) {
            pledgesFromStr(caller, data[i].Pledge, TYPE_PL, settings.special_mode);
        }
        if (data[i].CC) {
            pledgesFromStr(caller, data[i].CC, TYPE_CC, settings.special_mode);
        }
        if (data[i].GIRO) {
            pledgesFromStr(caller, data[i].GIRO, TYPE_GR, settings.special_mode);
        }
        board.callers.push(caller);
    }

    // output
    var mainDiv = document.getElementById("main-div");
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
    } // clear the main div first
    output(settings);
}

// Style constant for one-column layout for name only
const CLS_NAME_ONLY = "col-caller col-3 col-lg-2 col-offset-right-9 col-lg-offset-right-10";
// Style constants for two-column layout for name-pledges
const CLS_NAME_WITH_PL = "col-caller col-3 col-lg-2";
const CLS_PLEDGES_WITH_PL = "col-9 col-lg-10 row";
// 6-12-18 pledges on a line depending on screen size
const CLS_PLEDGES = "col-12 col-md-6 col-lg-4 col-xl-3";
// Style constant for a single pledge
const CLS_PLDG = "col-pledge col-2";

function output(config) {

    function toHtml(pledge) {
        // return HTML div of a pledge
        var div = document.createElement("div");
        div.className = CLS_PLDG;
        var subdiv = document.createElement("div");
        subdiv.innerHTML = pledge.amount;
        if (pledge.type == TYPE_PL) {
            subdiv.className = "col-pldg col-pl";
        }
        if (pledge.type == TYPE_CC) {
            subdiv.className = "col-pldg col-cc";
        }
        if (pledge.type == TYPE_GR) {
            subdiv.className = "col-pldg col-gr";
        }
        div.appendChild(subdiv);
        return div;
    }

    if (config.maintenance == "1") {
        // Render maintenance site
        var maintDiv = document.createElement("div");
        maintDiv.innerHTML = "The site is under maintenance, please come back later!";
        maintDiv.className = "maint";
        document.getElementById("main-div").appendChild(maintDiv);
    }
    else {
        // HTML representation of the data
        var totalAmount = { 1: 0, 2: 0, 3: 0 };
        board.sort();
        board.callers.forEach(caller => {
            // Log output to compare with visual output later
            console.log(caller.toStr());

            // Calculate the total pledge amount of the whole board
            for (var i = 1; i <= 3; i++) {
                totalAmount[i] += caller.pledgeAmounts[i];
            }

            // Caller's outer row
            var row = document.createElement("div");
            row.className = "row-caller row";

            // Caller's name
            var colName = document.createElement("div");
            colName.innerHTML = caller.name;

            // Pledges' outer row
            var colPledges = document.createElement("div");

            // Pledges
            if (caller.pledges.length === 0) {
                // no pledges, just output caller name
                colName.className = CLS_NAME_ONLY;
                row.appendChild(colName);
            }
            else {
                colName.className = CLS_NAME_WITH_PL;
                colPledges.className = CLS_PLEDGES_WITH_PL;

                // split pledges in groups of 6
                // each put into a row
                if (config.special_mode == "1") {
                    var sortedPledges = caller.pledges.sort(comparePledgeOrder);
                }
                else {
                    sortedPledges = caller.pledges.sort(comparePledgeAmount);
                }
                var countRows = Math.floor(sortedPledges.length / 6);
                for (i = 0; i <= countRows; i++) {
                    // wrapping elements
                    var colPlgs = document.createElement("div");
                    colPlgs.className = CLS_PLEDGES;
                    var rowPlgs = document.createElement("div");
                    rowPlgs.className = "row";

                    // pledges
                    var plgs = sortedPledges.slice(i * 6, (i + 1) * 6);
                    plgs.forEach(element => {
                        rowPlgs.appendChild(toHtml(element));
                    });
                    colPlgs.appendChild(rowPlgs);
                    colPledges.appendChild(colPlgs);
                }

                row.appendChild(colName);
                row.appendChild(colPledges);
            }

            document.getElementById("main-div").appendChild(row);
        });

        // Display the total
        document.getElementById("summary").textContent = "Total Pledges: $" + totalAmount[1] + " | Total Credit Cards: $" + totalAmount[2] + " | Total GIROs: $" + totalAmount[3];
    }
}

const REFRESH_INTERVAL = 15000; // 15 seconds
const CLOCK_SIGNAL = REFRESH_INTERVAL / 1000; // 15
var clk = CLOCK_SIGNAL;

// Auto-refresh
window.addEventListener("DOMContentLoaded", loadBoard);
var id = setInterval(loadBoard, REFRESH_INTERVAL);

function clock() {
    // Auto-refresh timer
    document.getElementById("clock").textContent = "Refreshing in " + clk + "...";
    if (clk == 1) {
        clk = CLOCK_SIGNAL; // reset clock
    } else {
        clk--;
    }
}
setInterval(clock, 1000);

function manualRefresh() {
    // Manual refresh
    clearInterval(id);
    clk = CLOCK_SIGNAL;
    loadBoard();
    id = setInterval(loadBoard, REFRESH_INTERVAL);
}

document.getElementById("button-refresh").onclick = manualRefresh;