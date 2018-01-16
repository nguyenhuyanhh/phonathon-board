const REFRESH_INTERVAL = 30000; // 30 seconds
const CLOCK_SIGNAL = REFRESH_INTERVAL / 1000; // 30
var clk = CLOCK_SIGNAL;

// Clock for cosmetic reasons

function resetClk() {
    clk = CLOCK_SIGNAL;
}

function clock() {
    document.getElementById("clock").textContent = "Refreshing in " + clk + "...";
    if (clk == 1) {
        resetClk();
    } else {
        clk--;
    }
}
setInterval(clock, 1000);

// Spreadsheet processing

var publicSpreadsheetUrl = "1btD0w0p58ZNJzSfDRGtCiZCCjvK80OkLKOA0j9YXbic";
var callers = [];

function loadBoard() {
    console.log("Refreshing data from spreadsheet.")
    callers = [];
    Tabletop.init({
        key: publicSpreadsheetUrl,
        callback: process,
    })
}

function pledgesFromStr(caller, str, type, special) {
    // get the pledges from a str, add to a Caller
    var order = 0;
    var pledges = str.split(',');
    pledges.forEach(element => {
        if (special == '1') {
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
    if (settings.special_mode == '1') {
        console.log("Special mode is on.");
    }
    if (settings.maintenance == '1') {
        console.log("Maintenance mode is on.");
    }
    if (settings.manual_refresh == '1') {
        console.log("Auto-refresh is off.");
    }

    // process the spreadsheet
    for (var i = 0; i < data.length; i++) {
        // get caller
        var caller = new Caller(data[i].Caller);

        // get pledges
        if (data[i].Pledge) {
            pledgesFromStr(caller, data[i].Pledge, TYPE_PL, settings.special_mode);
        };
        if (data[i].CC) {
            pledgesFromStr(caller, data[i].CC, TYPE_CC, settings.special_mode);
        };
        if (data[i].GIRO) {
            pledgesFromStr(caller, data[i].GIRO, TYPE_GR, settings.special_mode);
        };
        callers.push(caller);
    }

    // output
    var mainDiv = document.getElementById("main-div");
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
    } // clear the main div first
    output(settings);
}

// Style constant for one-column layout for name only
const CLS_NAME_ONLY = "col-caller col-xs-3 col-sm-3 col-md-2 col-lg-1 col-xs-offset-right-9 col-sm-offset-right-9 col-md-offset-right-10 col-lg-offset-right-11";
// Style constants for two-column layout for name-pledges
const CLS_NAME_WITH_PL = "col-caller col-xs-3 col-sm-3 col-md-2 col-lg-1";
const CLS_PLEDGES_WITH_PL = "col-xs-9 col-sm-9 col-md-10 col-lg-11";
// 6-12-18-24 pledges on a line depending on screen size
const CLS_PLEDGES = "container-fluid col-xs-12 col-sm-6 col-md-4 col-lg-3";
// Style constant for a single pledge
const CLS_PLDG = "col-pledge col-xs-2 col-sm-2 col-md-2 col-lg-2";

function output(config) {
    if (config.maintenance == '1') {
        // Render maintenance site
        var maintDiv = document.createElement("div");
        maintDiv.innerHTML = "The site is under maintenance, please come back later!";
        maintDiv.className = "maint";
        document.getElementById("main-div").appendChild(maintDiv);
    }
    else {
        // HTML representation of the data
        callers = callers.sort(compareCaller).reverse(); // sort callers
        callers.forEach(caller => {
            // Log output to compare with visual output later
            console.log(caller.toStr());

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
                if (config.special_mode == '1') {
                    var sortedPledges = caller.pledges.sort(comparePledgeOrder);
                }
                else {
                    var sortedPledges = caller.pledges.sort(comparePledgeAmount);
                }
                var countRows = Math.floor(sortedPledges.length / 6);
                for (var i = 0; i <= countRows; i++) {
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
    }
}

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
    return div
}

// Auto-refresh
window.addEventListener('DOMContentLoaded', loadBoard);
var id = setInterval(loadBoard, REFRESH_INTERVAL);

// Manual refresh
function manualRefresh() {
    clearInterval(id);
    resetClk();
    loadBoard();
    id = setInterval(loadBoard, REFRESH_INTERVAL);
}