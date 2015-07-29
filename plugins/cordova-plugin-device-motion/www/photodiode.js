/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/**
 * This class provides access to device photodiode data.
 * @constructor
 */
var argscheck = require('cordova/argscheck'),
    utils = require("cordova/utils"),
    exec = require("cordova/exec"),
    AmbientLight = require('./AmbientLight');

// Is the accel sensor running?
var running = false;

// Keeps reference to watchLight calls.
var timers = {};

// Array of listeners; used to keep track of when we should call start and stop.
var listeners = [];

// Last returned acceleration object from native
var accel = null;

//Returned sensor list object from native; Extension
var SensorList = null;

// Tells native to start.
function start() {
    exec(function (a) {
        var tempListeners = listeners.slice(0);
        accel = new AmbientLight(a.x, a.timestamp);
        for (var i = 0, l = tempListeners.length; i < l; i++) {
            tempListeners[i].win(accel);
        }
    }, function (e) {
        var tempListeners = listeners.slice(0);
        for (var i = 0, l = tempListeners.length; i < l; i++) {
            tempListeners[i].fail(e);
        }
    }, "Photodiode", "start", []);
    running = true;
}

// Tells native to stop.
function stop() {
    exec(null, null, "Photodiode", "stop", []);
    accel = null;
    running = false;
}

// Adds a callback pair to the listeners array
function createCallbackPair(win, fail) {
    return { win: win, fail: fail };
}

// Removes a win/fail listener pair from the listeners array
function removeListeners(l) {
    var idx = listeners.indexOf(l);
    if (idx > -1) {
        listeners.splice(idx, 1);
        if (listeners.length === 0) {
            stop();
        }
    }
}

//tells native to get sensor list; Extension
// function getall(successCallback,errorCallback) {
//       exec(function (a) {
//           sensorList = new JSONArray();
//           sensorList = a;
//           successCallback(a);
//       }, function (e) {
//         errorCallback(e);
//       }, "Photodiode", "getall", []);
// }
var photodiode = {
    getall: function(successCallback,errorCallback) {
            exec(function (a) {
                sensorList = new JSONArray();
                sensorList = a;
                successCallback(sensorList);
            }, function (e) {
              errorCallback(e);
            }, "Photodiode", "getall", []);
    },
    meaning: function(successCallback,errorCallback) {
            exec(function (a) {
                // sensorList = new JSONArray();
                // sensorList = a;
                // successCallback(sensorList);
                successCallback(a);
            }, function (e) {
              errorCallback(e);
            }, "Photodiode", "meaningoflife", []);
    },
    /**
     * Asynchronously acquires the current acceleration.
     *
     * @param {Function} successCallback    The function to call when the acceleration data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the acceleration data. (OPTIONAL)
     * @param {AccelerationOptions} options The options for getting the photodiode data such as timeout. (OPTIONAL)
     */
    getCurrentLight: function (successCallback, errorCallback, options) {
        argscheck.checkArgs('fFO', 'photodiode.getCurrentLight', arguments);

        if (cordova.platformId === "windowsphone") {
            exec(function (a) {
                accel = new AmbientLight(a.x, a.timestamp);
                successCallback(accel);
            }, function (e) {
                errorCallback(e);
            }, "Photodiode", "getCurrentLight", []);

            return;
        }

        var p;
        var win = function (a) {
            removeListeners(p);
            successCallback(a);
        };
        var fail = function (e) {
            removeListeners(p);
            errorCallback && errorCallback(e);
        };

        p = createCallbackPair(win, fail);
        listeners.push(p);

        if (!running) {
            start();
        }
    },

    /**
     * Asynchronously acquires the acceleration repeatedly at a given interval.
     *
     * @param {Function} successCallback    The function to call each time the acceleration data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the acceleration data. (OPTIONAL)
     * @param {AccelerationOptions} options The options for getting the photodiode data such as timeout. (OPTIONAL)
     * @return String                       The watch id that must be passed to #clearWatch to stop watching.
     */
    watchLight: function (successCallback, errorCallback, options) {
        argscheck.checkArgs('fFO', 'photodiode.watchLight', arguments);
        // Default interval (10 sec)
        var frequency = (options && options.frequency && typeof options.frequency == 'number') ? options.frequency : 10000;

        // Keep reference to watch id, and report accel readings as often as defined in frequency
        var id = utils.createUUID();

        var p = createCallbackPair(function () { }, function (e) {
            removeListeners(p);
            errorCallback && errorCallback(e);
        });
        listeners.push(p);

        timers[id] = {
            timer: window.setInterval(function () {
                if (accel) {
                    successCallback(accel);
                }
            }, frequency),
            listeners: p
        };

        if (running) {
            // If we're already running then immediately invoke the success callback
            // but only if we have retrieved a value, sample code does not check for null ...
            if (accel) {
                successCallback(accel);
            }
        } else {
            start();
        }

        return id;
    },

    /**
     * Clears the specified photodiode watch.
     *
     * @param {String} id       The id of the watch returned from #watchLight.
     */
    clearWatch: function (id) {
        // Stop javascript timer & remove from timer list
        if (id && timers[id]) {
            window.clearInterval(timers[id].timer);
            removeListeners(timers[id].listeners);
            delete timers[id];
        }
    }

};
module.exports = photodiode;
