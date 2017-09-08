var checks= [];
var commands = [];
var BRANCH = "mechanics";
var VISUALISATION = "diatomic";

/**
 * Runs sanity check to make sure table and database exists.
 * @param db_name: Name of database to add to.
 */
function check() {
    checks.push("CREATE TABLE [IF NOT EXISTS] {db_name}.log (" +
        "'time' DATETIME PRIMARY KEY NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
        "'visualisation' NOT NULL, " +
        "'event' TEXT NOT NULL, " +
        "'target' TEXT NOT NULL, " +
        "'value' TEXT NOT NULL" +
        ")", [BRANCH]);
}

/**
 * Stores log data in an Array as an SQlite ADD command.
 * @param object: Element clicked on.
 */
function log(object) {
    var time, event, target, targetValue;
    var currDate = new Date();

    time = currDate.getDate() + "/"
        + (currDate.getMonth()+1)  + "/"
        + currDate.getFullYear() + " "
        + currDate.getHours() + ":"
        + currDate.getMinutes() + ":"
        + currDate.getSeconds();

    event = object.type;
    target = object.target.tagName + this.target.class + this.target.id + this.target.display;
    targetValue = object.target.value;

    commands.push("INSERT INTO {branch}(log) (time, visualisation, event, target, value) " +
        "VALUES ({time}, {name}, {event}, {target}, {value}", [BRANCH, time, VISUALISATION, event, target, targetValue])
}

/**
 * Before navigating away, send all commands to server.
 */
window.onbeforeunload = function() {
    check();
    $.post("/", {checks: checks, commands: commands});
    return confirm("You're about to leave this page, are you sure?");
};