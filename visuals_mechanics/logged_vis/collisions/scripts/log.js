var BRANCH = "mechanics";                       // Subject branch - determines database name
var VISUALISATION = "diatomic";                 // Name of visualisation.
var COMMAND_LIMIT = 25;                         // Number of commands before history is sent to server.
var sessHistory = {branch: BRANCH};             // User actions in this session.
var count = 0;

/**
 * Before navigating away, send all sessHistory to server.
 */
window.onbeforeunload = function() {sendLog(); return confirm("Are you sure you want to leave this page?")};

/**
 * Stores log data in an Array as an SQlite ADD command.
 * @param object: Element clicked on.
 */
function log(object) {
    var action = {};
    var currDate = new Date();
    var targetAttr = [object.tagName, object.id];

    function pad(n) {
        return (n < 10) ? ('0' + n.toString()) : n.toString();
    }

    action.time = pad(currDate.getDate()) + "/"
        + pad(currDate.getMonth() + 1)  + "/"
        + pad(currDate.getFullYear()) + " "
        + pad(currDate.getHours()) + ":"
        + pad(currDate.getMinutes()) + ":"
        + pad(currDate.getSeconds());

    // Event type
    action.event = object.type;

    if (action.event === "submit") action.targetValue = object.innerHTML;                                                   // Button
    else if (action.event === "") {action.event = "spoiler"; action.targetValue = object.innerHTML.slice(0, 4);}            // Spoiler
    else if (action.event ==="checkbox")
    {action.targetValue = $("#" + targetAttr[1].toString())[0].checked ? 'Enabled' : 'Disabled';}                           // Checkbox
    else action.targetValue = object.value;                                                                                 // Slider, input, and others.

    // Target element.
    for (var i = 0; i < targetAttr.length; i++) {
        if (targetAttr[i] === undefined) console.error('Attribute has undefined value!');
        else action.target += targetAttr[i] + " ";
    }
    action.target = action.target.replace("undefined", "");     // Handling errors.
    action.visualisation = VISUALISATION;                       // Name of visualisation.

    // Adding this command to dictionary of sessHistory.
    count++;
    sessHistory[count] = action;

    if (count > COMMAND_LIMIT) sendLog();
    // console.log(action);
}

// TODO: Configure up DB path.
function sendLog() {
    $.post("db.php", sessHistory);                              // jQuery AJAX POST
    count = 0;                                                  // Resetting command count.
    sessHistory = {branch: BRANCH};                             // Resetting session history JSON.
}