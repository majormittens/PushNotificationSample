cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.phonegap.plugins.PushPlugin/www/PushNotification.js",
        "id": "com.phonegap.plugins.PushPlugin.PushNotification",
        "clobbers": [
            "PushNotification"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-motion/www/Acceleration.js",
        "id": "cordova-plugin-device-motion.Acceleration",
        "clobbers": [
            "Acceleration"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-motion/www/accelerometer.js",
        "id": "cordova-plugin-device-motion.accelerometer",
        "clobbers": [
            "navigator.accelerometer"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-motion/www/AmbientLight.js",
        "id": "cordova-plugin-device-motion.AmbientLight",
        "clobbers": [
            "AmbientLight"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-motion/www/photodiode.js",
        "id": "cordova-plugin-device-motion.photodiode",
        "clobbers": [
            "navigator.photodiode"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-motion/src/browser/AccelerometerProxy.js",
        "id": "cordova-plugin-device-motion.AccelerometerProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-device-motion/src/browser/accelerometer.js",
        "id": "cordova-plugin-device-motion.accelerometer",
        "merges": [
            "navigator.accelerometer"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-motion/src/browser/PhotodiodeProxy.js",
        "id": "cordova-plugin-device-motion.PhotodiodeProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-device-motion/src/browser/photodiode.js",
        "id": "cordova-plugin-device-motion.photodiode",
        "merges": [
            "navigator.photodiode"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.phonegap.plugins.PushPlugin": "2.4.0",
    "cordova-plugin-device-motion": "1.1.2-dev",
    "cordova-plugin-whitelist": "1.0.0"
}
// BOTTOM OF METADATA
});