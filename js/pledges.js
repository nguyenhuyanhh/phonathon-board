"use strict";

var board = new Board();

function loadBoard() {
    // load the spreadsheet using Tabletop
    console.debug("Refreshing data from spreadsheet.");
    board.clear();
    Tabletop.init({
        key: URL,
        wanted: ["Settings", "Pledges"],
        callback: processBoard,
    });
}

function pledgesFromStr(caller, str, type, special) {
    // get the pledges from a str, add to a Caller
    var order = 0;
    var pledges = str.split(",");
    pledges.forEach(element => {
        if (special) {
            // special mode: pledge "amount" could be anything
            caller.addPledge(new BoardPledge(element, type, order));
        }
        else {
            // normal mode: pledges must be valid
            if (!isNaN(element)) {
                caller.addPledge(new BoardPledge(parseInt(element), type, order));
            }
        }
        order++;
    });
}

function parseSettings(data) {
    // Parse setting from sheet "Settings"
    var settings = {};
    settings.special_mode = (data.special_mode == "0") ? false : true;
    settings.maintenance = (data.maintenance == "0") ? false : true;
    settings.manual_refresh = (data.manual_refresh == "0") ? false : true;
    settings.two_col = (data.two_col == "0") ? false : true;
    return settings;
}

function parseBoard(data, settings) {
    // Parse board from sheet "Pledges"
    for (var i = 0; i < data.length; i++) {
        // get caller
        var caller = new BoardCaller(data[i].Caller);

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
}

function processBoard(data, tabletop) {
    // Parse the spreadsheet
    var boardSheet = tabletop.sheets("Pledges");
    var settingSheet = tabletop.sheets("Settings");

    var settings = parseSettings(settingSheet.all()[0]);
    parseBoard(boardSheet.all(), settings);

    // output
    clearBoard();
    outputBoard(settings);
}

// Style constants for one-column layout
const CLS_NAME_ONLY = "col-caller col-3 col-lg-2 col-offset-right-9 col-lg-offset-right-10";
const CLS_NAME_WITH_PL = "col-caller col-3 col-lg-2";
const CLS_PLEDGES_WITH_PL = "col-9 col-lg-10 row";
const CLS_PLEDGES = "col-12 col-md-6 col-lg-4 col-xl-3";
const CLS_PLDG = "col-pledge col-2";

// Style constants for two-column layout
const CLS_NAME_ONLY_2 = "col-caller col-6 col-lg-4 col-offset-right-6 col-lg-offset-right-8";
const CLS_NAME_WITH_PL_2 = "col-caller col-6 col-lg-4";
const CLS_PLEDGES_WITH_PL_2 = "col-6 col-lg-8 row";
const CLS_PLEDGES_2 = "col-12 col-lg-6 col-xl-4";
const CLS_PLDG_2 = "col-pledge col-4";

function clearBoard() {
    // Clear board content before reloading
    var divs = [
        document.getElementById("main-div-one-col"),
        document.getElementById("col-left"),
        document.getElementById("col-right")
    ];
    divs.forEach(div => {
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
    });
}

function outputBoard(settings) {

    function toHtml(pledge, settings) {
        // return HTML div of a pledge
        var div = document.createElement("div");
        div.className = (settings.two_col) ? CLS_PLDG_2 : CLS_PLDG;
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

    function getRow(caller, settings) {
        // return HTML div of a row

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
            colName.className = (settings.two_col) ? CLS_NAME_ONLY_2 : CLS_NAME_ONLY;
            row.appendChild(colName);
        }
        else {
            colName.className = (settings.two_col) ? CLS_NAME_WITH_PL_2 : CLS_NAME_WITH_PL;
            colPledges.className = (settings.two_col) ? CLS_PLEDGES_WITH_PL_2 : CLS_PLEDGES_WITH_PL;

            // split pledges in groups of 6
            // each put into a row
            if (settings.special_mode) {
                var sortedPledges = caller.pledges.sort(comparePledgeOrder);
            }
            else {
                sortedPledges = caller.pledges.sort(comparePledgeAmount);
            }
            var countRows = Math.floor(sortedPledges.length / 6);
            for (var i = 0; i <= countRows; i++) {
                // wrapping elements
                var colPlgs = document.createElement("div");
                colPlgs.className = (settings.two_col) ? CLS_PLEDGES_2 : CLS_PLEDGES;
                var rowPlgs = document.createElement("div");
                rowPlgs.className = "row";

                // pledges
                var plgs = sortedPledges.slice(i * 6, (i + 1) * 6);
                plgs.forEach(plg => {
                    rowPlgs.appendChild(toHtml(plg, settings));
                });
                colPlgs.appendChild(rowPlgs);
                colPledges.appendChild(colPlgs);
            }

            row.appendChild(colName);
            row.appendChild(colPledges);
        }
        return row;
    }

    if (settings.maintenance) {
        // Render maintenance site
        var maintDiv = document.createElement("div");
        maintDiv.innerHTML = "The site is under maintenance, please come back later!";
        maintDiv.className = "maint";
        document.getElementById("main-div").appendChild(maintDiv);
    }
    else {
        // HTML representation of the data
        board.sort();
        var i = 0;
        board.callers.forEach(caller => {
            console.debug(caller.toStr());
            var row = getRow(caller, settings);
            if (settings.two_col) {
                var div = (i % 2 == 0) ? document.getElementById("col-left") : document.getElementById("col-right");
            }
            else {
                div = document.getElementById("main-div-one-col");
            }
            div.appendChild(row);
            i++;
        });

        // Display the total
        var totalAmount = board.getTotalAmount();
        document.getElementById("summary").textContent = "Total Pledges: $" + totalAmount[1] + " | Total Credit Cards: $" + totalAmount[2] + " | Total GIROs: $" + totalAmount[3];
    }
}

const REFRESH_INTERVAL = 15000; // 15 seconds
const CLOCK_SIGNAL = REFRESH_INTERVAL / 1000; // 15
var clk = CLOCK_SIGNAL;

// Auto-refresh
window.addEventListener("DOMContentLoaded", loadBoard);
var id = setInterval(loadBoard, REFRESH_INTERVAL);
setInterval(clock, 1000);

function clock() {
    // Auto-refresh timer
    document.getElementById("clock").textContent = "Refreshing in " + clk + "...";
    if (clk == 1) {
        clk = CLOCK_SIGNAL; // reset clock
    } else {
        clk--;
    }
}

function manualRefresh() {
    // Manual refresh
    clearInterval(id);
    clk = CLOCK_SIGNAL;
    loadBoard();
    id = setInterval(loadBoard, REFRESH_INTERVAL);
}

document.getElementById("button-refresh").onclick = manualRefresh;