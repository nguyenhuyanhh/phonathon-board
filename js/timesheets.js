"use strict";

var sheet = new Sheet();

function loadTimesheets() {
    // load the spreadsheet using Tabletop
    console.debug("Refreshing data from spreadsheet.");
    sheet.clear();
    Tabletop.init({
        key: URL,
        wanted: ["Settings", "Callers", "Timesheets"],
        callback: processTimesheets,
    });
}

function parseCallers(data) {
    // Parse callers from sheet "Callers"
    for (var i = 0; i < data.length; i++) {
        // get caller
        var row = data[i];
        var caller = new SheetCaller(row["Name"], row["Full Name"], row["Role"], row["IC"], row["Matric"], row["Email"]);
        sheet.callers[row["Name"]] = caller;
    }
}

function parseTimesheets(data, shifts) {
    // Parse timesheets from sheet "Timesheets"
    var lookup = {};
    // Initialize lookup with shifts
    shifts.forEach(shift => {
        lookup[shift] = { "callers": [] };
    });
    // First row: supervisors
    var sups = data[0];
    for (var s in sups) {
        try {
            if (sups[s] == "Supervisor") {
                continue;
            }
            if (sheet.callers.hasOwnProperty(sups[s])) {
                lookup[s]["supervisor"] = sheet.callers[sups[s]];
            } else {
                throw "Caller " + sups[s] + " not available";
            }
        } catch (error) {
            console.error(error);
        }
    }
    // Remaining rows
    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        for (var c in row) {
            try {
                if (!row[c]) {
                    continue;
                }
                if (sheet.callers.hasOwnProperty(row[c])) {
                    lookup[c]["callers"].push(sheet.callers[row[c]]);
                } else {
                    throw "Caller " + row[c] + " not available";
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
    // Create SheetShift objects
    for (var l in lookup) {
        if (lookup[l].hasOwnProperty("supervisor")) {
            var supervisor = lookup[l]["supervisor"];
        } else {
            supervisor = false;
        }
        var shift = new SheetShift(l, supervisor, lookup[l]["callers"]);
        sheet.shifts[l] = shift;
    }
}

function processTimesheets(data, tabletop) {
    // Parse the spreadsheet
    parseCallers(tabletop.sheets("Callers").all());

    var t = tabletop.sheets("Timesheets");
    var shifts = [];
    t.columnNames.forEach(element => {
        if (element != "Shift") {
            shifts.push(element);
        }
    });
    parseTimesheets(t.all(), shifts);
}

window.addEventListener("DOMContentLoaded", loadTimesheets);