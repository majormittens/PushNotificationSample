package com.example.plugin;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import java.util.*;

public class Hello extends CordovaPlugin {
  private SensorManager sensorManager;    // Sensor manager
  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
      super.initialize(cordova, webView);
      this.sensorManager = (SensorManager) cordova.getActivity().getSystemService(Context.SENSOR_SERVICE);
  }
  @Override
  public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {

    if (action.equals("greet")) {
      JSONArray returnJSON = poolAllSensors();
      callbackContext.success(returnJSON);
      return true;

    } else {

      return false;

    }
  }
  public JSONArray poolAllSensors() {
    List<Sensor> SensorList = this.sensorManager.getSensorList( Sensor.TYPE_ALL );

    /* Loop through all sensor objects and create a JSON object */
    JSONArray rtnJSON = new JSONArray();
    for( Sensor s : SensorList ){
      JSONObject o = new JSONObject();

      try {
        //o.put( "vendor",		s.getVendor());
        o.put( "name",			s.getName());
        //o.put( "version",		s.getVersion());
        o.put( "maxRange",		s.getMaximumRange());
        //o.put( "power",			s.getPower());
        o.put( "resolution",	s.getResolution());
        o.put( "type",        s.getType());

        rtnJSON.put(o);
      } catch (JSONException e) {
        e.printStackTrace();
        return null;
      }

    } //EOF for() loop

    return rtnJSON;
  }
}
