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

function processTimesheets(data, tabletop) {
    // Parse the spreadsheet
    var callerSheet = tabletop.sheets("Callers");

    parseCallers(callerSheet.all());
}

window.addEventListener("DOMContentLoaded", loadTimesheets);