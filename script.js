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
}

Caller.prototype = {
    constructor: Caller,
    addPledge: function (pledge) {
        // Add a pledge to the caller's pledges
        this.pledges.push(pledge);
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
    toStr: function () {
        // String representation of the Caller object
        // e.g. Caller X getting (P)100,(C)50,(G)10
        return ("Caller " + this.name + " getting " + this.pledgeToStr());
    }
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

var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1btD0w0p58ZNJzSfDRGtCiZCCjvK80OkLKOA0j9YXbic/pubhtml';
var body = document.getElementById("main-div");

function init() {
    Tabletop.init({
        key: publicSpreadsheetUrl,
        callback: process,
        simpleSheet: true
    })
}

function process(data, tabletop) {
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

        // visual output, using Bootstrap elements
        var row = document.createElement("div");
        row.className = "row-caller row";

        var colName = document.createElement("div");
        colName.className = "col-caller col-xs-3 col-sm-3 col-md-2";
        colName.innerHTML = caller.name;
        row.appendChild(colName);

        caller.pledges.sort(comparePledge).forEach(element => {
            row.appendChild(toHtml(element));
        });

        document.getElementById("main-div").appendChild(row);
    }
}

function toHtml(pledge) {
    var div = document.createElement("div");
    div.className = "col-pledge col-xs-2 col-sm-1 col-md-1";
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

window.addEventListener('DOMContentLoaded', init)