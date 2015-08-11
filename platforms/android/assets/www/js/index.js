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
//global constants
var TYPE_ACCELEROMETER = "1";
var TYPE_LIGHT = "5";
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
    if(app.connected === true)
    app.sendPOST(ambientlight);
    /*window.plugins.toast.showShortTop('Ambient Light [Lux]: ' + ambientlight.x + '\n' +
    'Timestamp: '      + ambientlight.timestamp);*/
    app.light_data.push(ambientlight);
    MG.data_graphic({
      title: 'Light Values',
      description: 'Ambient light values.',
      data: app.light_data, // an array of objects, such as [{value:100,date:...},...]
      width: 500,
      height: 250,
      target: '#plotarea', // the html element that the graphic is inserted in
      x_accessor: 'timestamp',  // the key that accesses the x value
      y_accessor: 'x', // the key that accesses the y value
      show_tooltips: false
    })
  },
  onLightError : function(){
    alert('onError!');
  },
  sendPOST: function(content) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (req.readyState==4 && (req.status==200 || req.status==0)) {
        //alert("POST Response: " + req.responseText);
        //window.plugins.toast.showShortTop('POST to NodeRED!');
        if(app.connected === false) {
          app.connected = true;
        }

      }
    };
    // req.open("POST", "http://"+app.ip+":1880/test", true);  // async
    req.open("POST", app.ip, true);
    req.setRequestHeader('Content-type','application/json; charset=utf-8');
    var postContent = JSON.stringify(content);
    req.send(postContent);
  },
  //Options:
  sensorList: "", /*JSONArray of sensor JSON data*/
  frequency: "10000", /*sampling frequency; by default: 10 seconds*/
  ip: "https://www.e-osu.si/umkoapi/test",//"178.172.46.5",
  connected: false,
  watching:false,
  watchID: "",
  light_data: [],
  sensorsToWatch: [],
  implementedSensors: [TYPE_ACCELEROMETER, TYPE_LIGHT],
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    console.log("device ready");
    //navigator.accelerometer.getCurrentAcceleration(app.onSuccess, app.onError);
    //app.startLightWatch(10000);
    // var pushNotification = window.plugins.pushNotification;
    // pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"893347479423","ecb":"app.onNotificationGCM"});
    App.load('home');
    if(navigator.connection.type == 'none')
    window.plugins.toast.showLongTop('No network connection enabled!');
    var success = function(message) {
      app.sensorList = message;
      App.controller('sensors', function (page,sensorList) {
        this.transition = 'rotate-right';

        var sensors = $(page).find('.app-list');
        for(var item in app.sensorList) {
          var checked = '';
          if(app.sensorsToWatch.indexOf(app.sensorList[item].type+"")>-1)
          checked = 'checked';
          var CHECKBOXHTML = "<input type='checkbox' id='sensorbox' "+checked+" name="+app.sensorList[item].type+">";
          sensors.append("<label><div id='sensorname'>"+app.sensorList[item].name+"</div>"+CHECKBOXHTML+"</label>");
          for(var prop in app.sensorList[item])
          if(prop!="name")
          sensors.append('<li>'+prop+' : '+app.sensorList[item][prop]+'</li>');
        }

        $(page).find('#applybtn').on('click', function () {
          var checkboxes = $(page).find('#sensorbox');
          for(var box in checkboxes) {
            console.log(checkboxes[box]);
            if(checkboxes[box].checked == true && app.sensorsToWatch.indexOf(checkboxes[box].name)<0)
            app.sensorsToWatch.push(checkboxes[box].name);
            else
            if(checkboxes[box].checked == false && app.sensorsToWatch.indexOf(checkboxes[box].name)>=0)
            app.sensorsToWatch.splice(app.sensorsToWatch.indexOf(checkboxes[box].name),1);
          }
          console.log(app.sensorsToWatch);
        });
      });

    }

    var failure = function() {
      alert("Error calling Hello Plugin");
    }
    hello.greet("lol", success, failure);
  },
  startLightWatch: function(freq) {
    window.plugins.toast.showLongTop('Ambient light watch started!');
    var options = { frequency: freq };  // Update every freq seconds
    app.watchID = navigator.photodiode.watchLight(app.onLightSuccess, app.onLightError, options);
  },
  onSensorListSuccess: function(result) {
    console.log(result);
  },
  onSensorListError: function(){
    console.log("error");
  },
  // result contains any message sent from the push plugin call
  successHandler: function(result) {
    //alert('Callback Success! Result = '+result)
    console.log('Message from nodeRED: '+result);
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
      //window.plugins.toast.showLongTop('Notification message from nodeRED: '+e.message);
      App.dialog({
        title        : e.title,
        text         : e.message,
        okButton     : 'Ok'
      });
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
