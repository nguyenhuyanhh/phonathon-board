// Object definitions

const PLEDGE_TYPES = { 1: "Pledge", 2: "Credit Card", 3: "GIRO" };
const PLEDGE_TYPES_SHORT = { 1: "P", 2: "C", 3: "G" };

function Caller(name) {
    // define a Caller
    this.name = name;
    this.pledges = [];
}

Caller.prototype = {
    constructor: Caller,
    addPledge: function (pledge) {
        this.pledges.push(pledge);
    },
    pledgeToStr: function () {
        var plgs = [];
        this.pledges.sort(comparePledge).forEach(element => {
            plgs.push(element.toShortStr());
        });
        return plgs.join(",")
    },
    toStr: function () {
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
        return ("$" + this.amount + " " + PLEDGE_TYPES[this.type]);
    },
    toShortStr: function () {
        return ("(" + PLEDGE_TYPES_SHORT[this.type] + ")" + this.amount)
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
var callers = []

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
                caller.addPledge(new Pledge(parseInt(element), 1));
            });
        };

        if (data[i].CC) {
            var ccs = data[i].CC.split(',');
            ccs.forEach(element => {
                caller.addPledge(new Pledge(parseInt(element), 2));
            });
        };

        if (data[i].GIRO) {
            var giros = data[i].GIRO.split(',');
            giros.forEach(element => {
                caller.addPledge(new Pledge(parseInt(element), 3));
            });
        };

        console.log(caller.toStr());
        callers.push(caller);
    }
}

window.addEventListener('DOMContentLoaded', init)