var BRANCH = "mechanics";                       // Subject branch - determines database name
var VISUALISATION = "diatomic";                 // Name of visualisation.
var sessHistory = {branch: BRANCH};                           // User actions in this session.
var count = 0;

// /**
//  * Before navigating away, send all sessHistory to server.
//  */
// window.onbeforeunload = function() {
//     $.post("/scripts/db.php", sessHistory);
//     sessHistory = {}; count = 0;
//     return confirm("You're about to leave this page, are you sure?");
// };

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

    if (action.event === "submit") action.targetValue = object.innerHTML;
    else if (action.event === "") {action.event = "spoiler"; action.targetValue = object.innerHTML.slice(0, 4);}
    else action.targetValue = object.value;

    // Target element.
    for (var i = 0; i < targetAttr.length; i++) {
        if (targetAttr[i] === undefined) console.error('Attribute has undefined value!');
        else action.target += targetAttr[i] + " ";
    }
    action.target = action.target.replace("undefined", "");

    // Name of visualisation.
    action.visualisation = VISUALISATION;

    // Adding this command to dictionary of sessHistory.
    count++;
    sessHistory[count] = action;
    console.log(action);
}
