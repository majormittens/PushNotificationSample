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
var TYPE_PROXIMITY = "8";
var TYPE_ORIENTATION = "3";

var app = { //=/= App, an object of the App.js framework
  sensorsToWatch: [],
  implementedSensors: [TYPE_ACCELEROMETER, TYPE_LIGHT, TYPE_PROXIMITY, TYPE_ORIENTATION],
  options : {
    sensorList: "", /*JSONArray of sensor JSON data*/
    frequency: "10000", /*sampling frequency; by default: 10 seconds*/
    ip: "https://www.e-osu.si/umkoapi/test",//"178.172.46.5",
    regid: "", //registration id
    connected: false, //wifi or mobile data
    registered: false, //with GCM
    watching: false,
    //Track nfc listener
    taglistening : false
  },
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
  sensorKeys : function() {
    var objects = [];
    for(var property in app)
    //find sensor objects
    if(app[property].hasOwnProperty('data') && app[property].hasOwnProperty('target'))
    objects.push(property);
    return objects;
  },
  drawGraph : function(sensor) {
    console.log(sensor);
    if($('.graphscontainer').length > 0)
    MG.data_graphic({
      title: sensor.title,
      description: sensor.description,
      data: sensor.data, // an array of objects, such as [{value:100,date:...},...]
      width: (0.9 * $('.graphscontainer').width()),
      height: 250,
      target: ('#'+sensor.target), // the html element that the graphic is inserted in
      x_accessor: sensor.x,  // the key that accesses the x value
      y_accessor: sensor.y, // the key that accesses the y value
      show_tooltips: false
    });
  },
  light : {
    type: TYPE_LIGHT,
    watchID : "",
    data : [],
    title: 'Light Values',
    description: 'Ambient light values.',
    target: 'light_data',
    x : 'timestamp',
    y : 'x',
    onSuccess : function(ambientlight) {
      ambientlight.timestamp = (new Date(ambientlight.timestamp)).getSeconds();
      app.nodered.post(ambientlight);
      app.light.data.push(ambientlight);
      app.drawGraph(app.light);
    },
    startWatch: function(t) {
      var options = { frequency: t };  // Update every t seconds
      app.light.watchID = navigator.photodiode.watchLight(app.light.onSuccess, app.genericErrorHandler, options);
    },
    stopWatch: function() {
      navigator.photodiode.clearWatch(app.light.watchID);
    }
  },
  acceleration : {
    type: TYPE_ACCELEROMETER,
    watchID : "",
    data : [],
    title: 'Accelerations',
    description: 'X Acceleration values.',
    target: 'accel_data', // the html element that the graphic is inserted in
    x : 'timestamp',  // the key that accesses the x value
    y : 'x', // the key that accesses the y value
    onSuccess : function(accelerations) {
      accelerations.timestamp = (new Date(accelerations.timestamp)).getSeconds();
      app.nodered.post(accelerations);
      app.acceleration.data.push(accelerations);
      app.drawGraph(app.acceleration);
    },
    startWatch: function(t) {
      console.log("started accel watch");
      var options = { frequency: t };  // Update every t seconds
      app.acceleration.watchID = navigator.accelerometer.watchAcceleration(app.acceleration.onSuccess, app.genericErrorHandler, options);
    },
    stopWatch: function() {
      navigator.accelerometer.clearWatch(app.acceleration.watchID);
    }
  },
  orientation : {
    type: TYPE_ORIENTATION,
    watchID : "",
    data : [],
    title: 'Orientation',
    description: 'Device orientation',
    target: 'orientation_data',
    x : 'timestamp',
    y : 'magneticHeading',
    onSuccess : function(heading) {
      heading.timestamp = (new Date(heading.timestamp)).getSeconds();
      app.nodered.post(heading);
      app.orientation.data.push(heading);
      app.drawGraph(app.orientation);
    },
    startWatch: function(t) {
      var options = { frequency: t };  // Update every t seconds
      app.orientation.watchID = navigator.compass.watchHeading(app.orientation.onSuccess, app.genericErrorHandler, options);
    },
    stopWatch: function() {
      navigator.compass.clearWatch(app.orientation.watchID);
    }
  },
  tagbtncallback : function(nfcEvent) {
    //alert(JSON.stringify(nfcEvent.tag));
    App.dialog({
      title        : 'Quit',
      text         : JSON.stringify(nfcEvent.tag),
      cancelButton : 'Dismiss',
      okButton     : 'Send to nodeRED'
    }, function (ok) {
      if (ok) {
        app.nodered.post(nfcEvent.tag);
      }
    });
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    console.log("device ready");
    //Initial registration to make notification pop-ups work in foreground
    window.plugins.pushNotification.register(app.genericSuccessHandler, app.genericErrorHandler,
      {"senderID":"893347479423","ecb":"app.onNotificationGCM"});

      App.load('home');
      //Is the device connected to a network?
      if(navigator.connection.type == 'none')
      window.plugins.toast.showLongTop('No network connection enabled!');
      else {
        app.options.connected = true;
      }

      hello.greet("lol", function(message) {
        app.options.sensorList = message;
        App.controller('sensors', function (page,sensorList) {
          this.transition = 'rotate-right';
          var sensors = $(page).find('.app-list');
          for(var item in app.options.sensorList) {
            var checked = '';
            //Is the sensor selected?
            if(app.sensorsToWatch.indexOf(app.options.sensorList[item].type+"")>-1)
            checked = 'checked';
            var CHECKBOXHTML = "<input type='checkbox' id='sensorbox' "+checked+" name="+app.options.sensorList[item].type+">";
            //is the sensor implemented?
            if(app.implementedSensors.indexOf(app.options.sensorList[item].type+"")<0)
            CHECKBOXHTML = '';
            sensors.append("<label><div id='sensorname'>"+app.options.sensorList[item].name+"</div>"+CHECKBOXHTML+"</label>");
            for(var prop in app.options.sensorList[item])
            if(prop!="name")
            sensors.append('<li>'+prop+' : '+app.options.sensorList[item][prop]+'</li>');
          }

          $(page).find('#applybtn').on('click', function () {
            var checkboxes = $(page).find('#sensorbox');
            for(var box in checkboxes) {
              if(checkboxes[box].checked == true && app.sensorsToWatch.indexOf(checkboxes[box].name)<0)
              app.sensorsToWatch.push(checkboxes[box].name);
              else
              if(checkboxes[box].checked == false && app.sensorsToWatch.indexOf(checkboxes[box].name)>=0)
              app.sensorsToWatch.splice(app.sensorsToWatch.indexOf(checkboxes[box].name),1);
            }
            console.log(app.sensorsToWatch);
          });
        });
      }, app.genericErrorHandler);
    },
    startOrientationWatch: function(t) {
      console.log("started orientation watch");
      var options = { frequency: t };  // Update every t seconds
      app.watchIDs.watchOrientationID = navigator.compass.watchHeading(app.onOrientationSuccess, app.genericErrorHandler, options);
    },
    genericSuccessHandler: function(result) {
      console.log(result);
    },
    genericErrorHandler:function(error) {
      window.plugins.toast.showLongTop(error);
    },
    nodered : {
      data : {},
      dataHandler : function(e) { //special notification payload
        console.log(e.payload.title+" ; "+e.payload.message);
        if(e.payload.title === "Data") {
          var message = e.payload.message;
          if(message.hasOwnProperty('arrayname') && app.nodered.data.hasOwnProperty(message.arrayname)) {
            app.nodered.data[message.arrayname].push(message);
          }
          else if (message.hasOwnProperty('arrayname')) {
            app.nodered.data[message.arrayname] = [];
            app.nodered.data[message.arrayname].push(message);
          }
          app.nodered.drawGraphs();
        }
        else {
          App.dialog({
            title        : e.title,
            text         : e.message,
            okButton     : 'Ok'
          });
        }
      },
      drawGraphs : function() {
        //Do we have anything to render on?
        if($('.redcontainer').length > 0)
        for(var data_array in app.nodered.data)
        MG.data_graphic({
          title: 'Data from NodeRED',
          data: app.nodered.data[data_array], // an array of objects, such as [{value:100,date:...},...]
          width: (0.9 * $('.redcontainer').width()),
          height: 250,
          target: ('#'+ data_array), // the html element that the graphic is inserted in
          x_accessor: 'x',  // the key that accesses the x value
          y_accessor: 'y', // the key that accesses the y value
          show_tooltips: false
        });
      },
        post : function(content) {
          if(app.options.connected === false)
          return;
          var req = new XMLHttpRequest();
          req.onreadystatechange = function() {
            if (req.readyState==4 && (req.status==200 || req.status==0)) {
              //?
            }
          };
          req.open("POST", app.options.ip, true);
          req.setRequestHeader('Content-type','application/json; charset=utf-8');
          var postContent = JSON.stringify(content);
          req.send(postContent);
        }
    },

    onNotificationGCM: function(e) {
      switch( e.event )
      {
        case 'registered':
        if ( e.regid.length > 0 )
        {
          console.log("Regid " + e.regid);
          app.options.registered = true;
          //app.nodered.post(e);
          app.options.regid = e.regid; //store the latest regid
        }
        break;

        case 'message':
        // this is the actual push notification. its format depends on the data model from the push server
        console.log(e);
        app.nodered.dataHandler(e);
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
