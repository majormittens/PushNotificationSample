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
    },
    {
        "file": "plugins/nl.x-services.plugins.toast/www/Toast.js",
        "id": "nl.x-services.plugins.toast.Toast",
        "clobbers": [
            "window.plugins.toast"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.toast/test/tests.js",
        "id": "nl.x-services.plugins.toast.tests"
    },
    {
        "file": "plugins/com.example.hello/www/hello.js",
        "id": "com.example.hello.hello",
        "clobbers": [
            "hello"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "id": "cordova-plugin-network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "id": "cordova-plugin-network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/cordova-plugin-network-information/www/browser/network.js",
        "id": "cordova-plugin-network-information.browserNetwork",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/org.awokenwell.proximity/www/proximity.js",
        "id": "org.awokenwell.proximity.proximity",
        "clobbers": [
            "navigator.proximity"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-orientation/www/CompassError.js",
        "id": "cordova-plugin-device-orientation.CompassError",
        "clobbers": [
            "CompassError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-orientation/www/CompassHeading.js",
        "id": "cordova-plugin-device-orientation.CompassHeading",
        "clobbers": [
            "CompassHeading"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-orientation/www/compass.js",
        "id": "cordova-plugin-device-orientation.compass",
        "clobbers": [
            "navigator.compass"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device-orientation/src/browser/CompassProxy.js",
        "id": "cordova-plugin-device-orientation.CompassProxy",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-device-orientation/src/browser/compass.js",
        "id": "cordova-plugin-device-orientation.compass",
        "merges": [
            "navigator.compass"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.phonegap.plugins.PushPlugin": "2.4.0",
    "cordova-plugin-device-motion": "1.1.2-dev",
    "cordova-plugin-whitelist": "1.0.0",
    "nl.x-services.plugins.toast": "2.0.4",
    "com.example.hello": "0.7.0",
    "cordova-plugin-network-information": "1.0.2-dev",
    "org.awokenwell.proximity": "0.2.1",
    "cordova-plugin-device-orientation": "1.0.1"
}
// BOTTOM OF METADATA
});