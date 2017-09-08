// const sql = require('sqlite3').verbose();
// var db = new sql.Database('../{BRANCH}', [BRANCH]);
//
// /**
//  * Runs sanity check to make sure table and database exists.
//  */
// function check() {
//     checks.push("CREATE TABLE [IF NOT EXISTS] {db_name}.log (" +
//         "'time' DATETIME PRIMARY KEY NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
//         "'visualisation' NOT NULL, " +
//         "'event' TEXT NOT NULL, " +
//         "'target' TEXT NOT NULL, " +
//         "'value' TEXT NOT NULL" +
//         ")", [BRANCH]);
// }