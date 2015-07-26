package org.apache.cordova.devicemotion;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.content.Context;
import android.hardware.*;
import java.util.*;


/* Sensoromatic PhoneGap Plugin - Allows PhoneGap applications to
 *  access information on hardware sensors present on the host device.
 */
public class Sensoromatic extends Plugin {

	public static final String GET_ALL_SENSORS  = "poolAllSensors";
	public static final String GET_SPEC_SENSORS = "nativeAction";
	SensorManager Sensors;

	@Override
	public PluginResult execute(String action, JSONArray args, String callbackID) {

		@SuppressWarnings("deprecation")
		Context ctx = cordova.getContext(); //This is not deprecated. I promise..! (See note #1 below)
		Sensors = (SensorManager) ctx.getSystemService( Context.SENSOR_SERVICE );

		if( GET_ALL_SENSORS.equals(action) ){

			JSONArray rtnJSON = poolAllSensors();

			if( rtnJSON == null )
				return new PluginResult(PluginResult.Status.JSON_EXCEPTION);
			return new PluginResult( PluginResult.Status.OK, rtnJSON );

		} else if( GET_SPEC_SENSORS.equals(action)  ){

			/* not currently implemented */
			return new PluginResult( PluginResult.Status.NO_RESULT );

		} else {
			/* Invalid method call */
			return new PluginResult(PluginResult.Status.INVALID_ACTION);
		}
	}

	/*  This gets a list of Sensors from the SensorManager and returns a JSONObject
	 *  containing them.
	 */
	public JSONArray poolAllSensors() {
		List<Sensor> SensorList = Sensors.getSensorList( Sensor.TYPE_ALL );

		/* Loop through all sensor objects and create a JSON object */
		JSONArray rtnJSON = new JSONArray();
		for( Sensor s : SensorList ){
			JSONObject o = new JSONObject();

			try {
				o.put( "vendor",		s.getVendor()				);
				o.put( "name",			s.getName() 				);
				o.put( "type",			checkType( s.getType() ) 	);
				o.put( "version",		s.getVersion() 				);
				o.put( "maxRange",		s.getMaximumRange() 		);
				//o.put( "minDelay",		s.getMinDelay() 		);
				o.put( "power",			s.getPower() 				);
				o.put( "resolution",	s.getResolution() 			);

				rtnJSON.put(o);
			} catch (JSONException e) {
				e.printStackTrace();
				return null;
			}

		} //EOF for() loop

		return rtnJSON;
	}


	/* Just a really long switch() in all honesty. It compares the returned
	 *  type of a Sensor - and then checks it against the CONSTANT values
	 *  contained in the Sensor class. A string containing the sensor type
	 *  will be returned; or "Unknown" if no constant matches the value.
	 */
	@SuppressWarnings("deprecation")
	public static String checkType(int type){

		switch(type){

			case Sensor.TYPE_ACCELEROMETER :
				return "Accelerometer";

			case Sensor.TYPE_AMBIENT_TEMPERATURE :
				return "Ambient Temperature";

			case Sensor.TYPE_LIGHT :
				return "Light";

			case Sensor.TYPE_GRAVITY :
				return "Gravity";

			case Sensor.TYPE_GYROSCOPE :
				return "Gyroscope";

			case Sensor.TYPE_LINEAR_ACCELERATION :
				return "Linear Acceleration";

			case Sensor.TYPE_MAGNETIC_FIELD :
				return "Magnetic Field";

			case Sensor.TYPE_PRESSURE :
				return "Pressure";

			case Sensor.TYPE_PROXIMITY :
				return "Proximity";

			case Sensor.TYPE_RELATIVE_HUMIDITY :
				return "Relative Humidity";

			case Sensor.TYPE_ROTATION_VECTOR :
				return "Rotation Vector";

			/* These are deprecated - however, they are required as of Android 4.1 to correctly
			 * identify certain forms of sensor. Yes. Deprecated but even required by the official
			 * SDK, Emulator and latest Android image... You heard it here folks; Google is so
			 * hipster that they even rock out deprecated constants.
			 */
			 case Sensor.TYPE_ORIENTATION :
				return "Orientation";

			 case Sensor.TYPE_TEMPERATURE :
				return "Temperature";

			default:
				return "Unknown";

		}
	}

}

/* Notes:
 * 1) cordova.getContext() is NOT deprecated; this is an issue with the Apache
 *  Cordova/PhoneGap codebase that they have yet to fix.
 *  (src: http://simonmacdonald.blogspot.fr/2012/07/phonegap-android-plugins-sometimes-we.html)
 */
