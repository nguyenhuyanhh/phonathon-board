const REFRESH_INTERVAL = 30000; // 30 seconds

// Clock for cosmetic reasons

function time() {
    document.getElementById("clock").textContent = new Date().toString();
}
setInterval(time, 1000);

// Object definitions

const TYPE_PL = 1; // pledge
const TYPE_CC = 2; // credit card
const TYPE_GR = 3; // GIRO
const TYPES = { 1: "Pledge", 2: "Credit Card", 3: "GIRO" };
const TYPES_SHORT = { 1: "P", 2: "C", 3: "G" };

function Caller(name) {
    // define a Caller
    this.name = name;
    this.pledges = [];
    this.pledgeCount = 0;
    this.pledgeCounts = { 1: 0, 2: 0, 3: 0 };
}

Caller.prototype = {
    constructor: Caller,
    addPledge: function (pledge) {
        // Add a pledge to the caller's pledges
        this.pledges.push(pledge);
        this.pledgeCount++;
        this.pledgeCounts[pledge.type]++; // update the count
    },
    pledgeToStr: function () {
        // String representation of pledge list
        // uses Pledge.toShortStr()
        var plgs = [];
        this.pledges.sort(comparePledge).forEach(element => {
            plgs.push(element.toShortStr());
        });
        return plgs.join(",")
    },
    pledgeCountToStr: function () {
        // String representation of pledge counts
        countPl = this.pledgeCounts[TYPE_PL];
        countCc = this.pledgeCounts[TYPE_CC];
        countGr = this.pledgeCounts[TYPE_GR];
        return (countPl + " pledges, " + countCc + " credits, " + countGr + " GIROs: ");
    },
    toStr: function () {
        // String representation of the Caller object
        // e.g. Caller X getting (P)100,(C)50,(G)10
        return ("Caller " + this.name + " getting " + this.pledgeCountToStr() + this.pledgeToStr());
    }
}

function compareCaller(caller1, caller2) {
    // compare callers based on number of pledges, then name
    if (caller1.pledgeCount != caller2.pledgeCount) {
        return caller1.pledgeCount - caller2.pledgeCount;
    }
    if (caller1.pledgeCounts[TYPE_GR] != caller2.pledgeCounts[TYPE_GR]) {
        return caller1.pledgeCounts[TYPE_GR] - caller2.pledgeCounts[TYPE_GR];
    }
    if (caller1.pledgeCounts[TYPE_CC] != caller2.pledgeCounts[TYPE_CC]) {
        return caller1.pledgeCounts[TYPE_CC] - caller2.pledgeCounts[TYPE_CC];
    }
    if (caller1.pledgeCounts[TYPE_PL] != caller2.pledgeCounts[TYPE_PL]) {
        return caller1.pledgeCounts[TYPE_PL] - caller2.pledgeCounts[TYPE_PL];
    }
    if (caller1.name < caller2.name) {
        return 1;
    }
    if (caller1.name > caller2.name) {
        return -1;
    }
    return 0;
}

function Pledge(amount, type) {
    // define a Pledge
    this.amount = amount;
    this.type = type;
}

Pledge.prototype = {
    constructor: Pledge,
    toStr: function () {
        // Full string representation of a Pledge object
        // e.g. $50 Pledge
        return ("$" + this.amount + " " + TYPES[this.type]);
    },
    toShortStr: function () {
        // Short string representation of a Pledge object
        // e.g. (P)50
        return ("(" + TYPES_SHORT[this.type] + ")" + this.amount)
    }
}

function comparePledge(pledge1, pledge2) {
    // compare pledges based on type, then amount
    if (pledge1.type < pledge2.type) {
        return -1;
    }
    if (pledge1.type > pledge2.type) {
        return 1;
    }
    if (pledge1.amount < pledge2.amount) {
        return -1;
    }
    if (pledge1.amount > pledge2.amount) {
        return 1;
    }
    return 0;
}

// Spreadsheet processing

var publicSpreadsheetUrl = "1btD0w0p58ZNJzSfDRGtCiZCCjvK80OkLKOA0j9YXbic";
var callers = [];

function loadBoard() {
    callers = [];
    var mainDiv = document.getElementById("main-div");
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
    } // clear the main div first
    Tabletop.init({
        key: publicSpreadsheetUrl,
        callback: process,
        simpleSheet: true
    })
}

function process(data, tabletop) {
    // process the spreadsheet
    for (var i = 0; i < data.length; i++) {
        // get caller
        var caller = new Caller(data[i].Caller);

        // get pledges
        if (data[i].Pledge) {
            var pledges = data[i].Pledge.split(',');
            pledges.forEach(element => {
                caller.addPledge(new Pledge(parseInt(element), TYPE_PL));
            });
        };

        if (data[i].CC) {
            var ccs = data[i].CC.split(',');
            ccs.forEach(element => {
                caller.addPledge(new Pledge(parseInt(element), TYPE_CC));
            });
        };

        if (data[i].GIRO) {
            var giros = data[i].GIRO.split(',');
            giros.forEach(element => {
                caller.addPledge(new Pledge(parseInt(element), TYPE_GR));
            });
        };

        // log output to compare with visual output later
        console.log(caller.toStr());
        callers.push(caller);
    }
    output();
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

function output() {
    // HTML representation of the data

    callers = callers.sort(compareCaller).reverse(); // sort callers
    callers.forEach(caller => {
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
            var sortedPledges = caller.pledges.sort(comparePledge);
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

function toHtml(pledge) {
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
setInterval(loadBoard, REFRESH_INTERVAL);