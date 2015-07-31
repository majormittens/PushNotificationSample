/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  onSuccess : function(acceleration) {
    alert('Acceleration X: ' + acceleration.x + '\n' +
    'Acceleration Y: ' + acceleration.y + '\n' +
    'Acceleration Z: ' + acceleration.z + '\n' +
    'Timestamp: '      + acceleration.timestamp + '\n');
    app.sendPOST(acceleration);
  },
  onError : function(){
    alert('onError!');
  },
  onLightSuccess : function(ambientlight) {
    //alert('Ambient Light [Lux]: ' + ambientlight.x + '\n' +
    //'Timestamp: '      + ambientlight.timestamp + '\n');
    app.sendPOST(ambientlight);
    //app.chart.data.dataPoints.push({x:ambientlight.x,y:ambientlight.timestamp});
    //app.chart.render();
  },
  onLightError : function(){
    alert('onError!');
  },
  sendPOST: function(content) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (req.readyState==4 && (req.status==200 || req.status==0)) {
        //alert("POST Response: " + req.responseText);
        window.plugins.toast.showLongTop('Successful POST to NodeRED!');
      }
    };
    req.open("POST", "http://178.172.46.5:1880/bar", true);  // async
    req.setRequestHeader('Content-type','application/json; charset=utf-8');
    var postContent = JSON.stringify(content);
    req.send(postContent);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
    //var pushNotification = window.plugins.pushNotification;
    //pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"893347479423","ecb":"app.onNotificationGCM"});
    //navigator.accelerometer.getCurrentAcceleration(app.onSuccess, app.onError);
    //navigator.photodiode.getCurrentLight(app.onLightSuccess,app.onLightError);
    /*
    var options = { frequency: 3000 };  // Update every 3 seconds
    var watchID = navigator.photodiode.watchLight(app.onLightSuccess, app.onLightError, options);
    */
    //console.log(Sensoromatic);

    //app.startLightWatch(10000);
    var sensorList;
    var success = function(message) {
      sensorList = message;
    }

    var failure = function() {
      alert("Error calling Hello Plugin");
    }

    hello.greet("lol", success, failure);
    App.controller('home', function (page, sensors) {
      var $sensors = $(page).find('.sensors');
      var $sensor = $(page).find('.sensor').remove();
      var $property = $(page).find('.property').remove();
      sensorList.forEach(function (sensor) {
        $sensors.append($sensor).text(sensor.name);
        for(var prop in sensor)
          $sensors.append($property).text(prop+" : "+sensor.prop);
      });
    });

  },
  sensorListHandler: function(result) {
    console.log(result);
  },
  startLightWatch: function(freq) {
    window.plugins.toast.showLongTop('Ambient light watch started!');
    var options = { frequency: freq };  // Update every freq seconds
    var watchID = navigator.photodiode.watchLight(app.onLightSuccess, app.onLightError, options);
  },
  onSensorListSuccess: function(result) {
    console.log(result);
  },
  onSensorListError: function(){
    console.log("error");
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    /*var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');*/



    console.log('Received Event: ' + id);
  },
  // result contains any message sent from the push plugin call
  successHandler: function(result) {
    //alert('Callback Success! Result = '+result)
    window.plugins.toast.showLongTop('Successfully connected to nodeRED!');
  },
  errorHandler:function(error) {
    //alert(error);
    window.plugins.toast.showLongTop(error);
  },
  onNotificationGCM: function(e) {
    switch( e.event )
    {
      case 'registered':
      if ( e.regid.length > 0 )
      {
        console.log("Regid " + e.regid);
        //alert('registration id = '+e.regid);
        window.plugins.toast.showLongTop('GCM Registration id = '+e.regid);
        app.sendPOST(e);
      }
      break;

      case 'message':
      // this is the actual push notification. its format depends on the data model from the push server
      //alert('message = '+e.message);
      window.plugins.toast.showLongTop('Notification message from nodeRED: '+e.message);
      break;

      case 'error':
      alert('GCM error = '+e.msg);
      break;

      default:
      alert('An unknown GCM event has occurred');
      break;
    }
  }

};
