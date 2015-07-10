var gcm = require('node-gcm');
var message = new gcm.Message();

//API Server Key
var sender = new gcm.Sender('AIzaSyCoJ4J2b5AI7sf9JStIdKU9qxbzp4HgIP4');
var registrationIds = [];

// Value the payload data to send...
message.addData('message',"A successful notification.");
message.addData('title','Push Notification Sample' );
message.addData('msgcnt','3'); // Shows up in the notification in the status bar
message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
//message.collapseKey = 'demo';
//message.delayWhileIdle = true; //Default is false
message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.

// At least one reg id required
registrationIds.push('APA91bES0o16IzhsdOAsWIcK42wzdefe-Xr89Drs7vHHFEcaHHG3VyWgqHaTCHD4VaPtFg3TPIumTAjopFKWIXvPNB9I8pY7zS_G7W2ASxyvb0SHVjHsNKk');

/**
 * Parameters: message-literal, registrationIds-array, No. of retries, callback-function
 */
sender.send(message, registrationIds, 4, function (err,result) {
    console.log(result);
});
