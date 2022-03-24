# 🗺 google-maps-loader-helper

![Map](./map.gif)

##### This package is a helper for [@googlemaps/js-api-loader package](https://github.com/googlemaps/js-api-loader)

## Install Node Package

* ##### with yarn

```bash
yarn add google-maps-loader-helper
```

* ##### with npm

```bash
npm install google-maps-loader-helper
```

## Using

```javascript
  import GoogleMapLoader from 'google-maps-loader-helper'

  const GoogleMaps = new GoogleMapLoader(/*options*/)
```

----------------------------------------------


### Constructor

#### Options

----------------

* **`apiKey`**:

This is Google Maps Api Key

* **`el`**:

The el the html element that the map will render.

* **`language`** :

The language option is the language of the translation for data such as search input, address information.

* **`location`** :

The location is map default center

* **`version`**:

The version is Google Maps Js API version. "weekly" | "quarterly"| "beta" or custom version.

[More Detail For Version](https://developers.google.com/maps/documentation/javascript/versions)


* **`libraries`** :

The libraries are necessary google maps library items.
An array containing any or more of the following elements.
library types

```javascript
  {"drawing" | "geometry" | "localContext" | "places" | "visualization"}
```

[More Detail For Libraries](https://developers.google.com/maps/documentation/javascript/libraries)

* **`zoom`** :

The zoom is default map zoom value.


* **`mapOptions`**:

The mapOptions are Google Maps Map setting options.
zoom, center, mapTypeControl etc. contains many settings.

[Information about map options](https://developers.google.com/maps/documentation/javascript/reference/map?hl=en#MapOptions)

* **`loaderOptions`**:

Loader options other than `apiKey, version, language and libraries`.
* **id** : Script tag id
* **region**: Map region config for domain, localizes etc.

  The region is expressed by contributors as follows in the code base:
  [Region Description](https://github.com/googlemaps/js-api-loader/blob/main/src/index.ts#L129)

* **url**: Custom Url and path to for Google Maps API Scripts.
* **nonce**: a cryptographic nonce attribute.
* **retries**: The number of script load retries.

--------------
#### Loader

Loader is a `@googlemaps/js-api-loader` instance.
Creating with loaderOptions.

#### google

The default value of the google variable is null. With `createInstance` method `Loader.load` method called. The returned data in result this method is setted as the "google" constructor.

#### googleMap

The default value of the googleMap variable is null. 
a new map is created with `init` method. And setted to `new this.google.maps.Map` constructor `googleMap`.

#### autocomplete

The default value of the autocomplete variable is null. 
a new map is created with `createAutoComplete` method. And setted to `new this.google.maps.place.Autocomplete` constructor `autocomplete`.

#### marker

The default value of the marker variable is null. 
a new map is created with `createMarker` method. And setted to `new this.google.maps.Marker` constructor `marker`.

#### geocoder

The default value of the geocoder variable is null. 
a new map is created with `createGeocoder` method. And setted to `new this.google.maps.Geocoder` constructor `geocoder`.

#### infoWindow

The default value of the infoWindow variable is null. 
a new map is created with `createInfoWindow` method. And setted to `new this.google.maps.InfoWindow` constructor `infoWindow`. It is created automatically with the marker.

#### drawingManager

The default value of the drawingManager variable is null. With `createDrawingManager` method Creates a new instance of the DrawingManager class and this value is set to `drawingManager`.

--------------------

### Methods

* #### **`createInstance`**

This is created new a google maps instance with Loader.load method.


* #### **`init`**

This method is calls `createInstance` method and then new a instance `google.maps.Map` created.
This instance has been setted `googleMap`

Parameter: ignorecurrentlocation / boolean.

if ignorecurrentlocation value is true, map not initialized with current location. (current location -> find browser location)

* #### **`getZoom`**

This method returns map zoom value.

* #### **`resetZoom`**

This method sets the map zoom value as the initial value.

* #### **`setZoom`**

This method edits the map zoom value.
Parameter: zoom / number
  

* #### **`getMapCenter`**

This method returns map center value. 
This value is Typeof LatLng [doc](https://developers.google.com/maps/documentation/javascript/reference/3.46/coordinates?hl=en#LatLng)

* #### **`setLocation`**

This method sets location data.

Parameter: location (Object)
The object must be has property `lat` and `lng`.

* #### **`getCurrentLocation`**
  
This method get user location info with browser location.

* #### **`setCurrentLocation`**
  
This method get user location with `getCurrentLocation` and then set location data.

* #### **`generateLocationData`**
  
This method create `LatLng` instance with location object.

Parameter: location (Object)
The object must be has property `lat` and `lng`.

* #### **`convertPositionInfo`**
  
This method convert and return `LatLng` instance to location object.

Parameter: LatLng (new this.google.maps.LatLang)

* #### **`setNewAddress`**

This method sets map zoom as address location and return converted address information.

Parameter: address (Object)
The object must be has property `geometry`. And also `geometry` object must be has property `location`.


* #### **`createMarker`**

This method create a new `Marker` instance from `google.maps.Marker` class. And after marker position set as location and create info window.

Parameter: opts = {} (Object)
opts is marker instance config
[doc](https://developers.google.com/maps/documentation/javascript/reference/marker?hl=en#MarkerOptions)

* #### **`visibleMarker`**

This method change marker visible status

Parameter: visible (Boolean)

* #### **`getMarkerPosition`**

This method marker find mark position and return converted location object.

* #### **`setMarkerData`**

This method set map center as marker position and then return address information with geocoder by calling the `setGeocodeAddress` method.

* #### **`markerAddListener`**

A new marker listener is created with the by this method.

Parameter: (eventName: String, callback: Function)
`eventName` is market event name: [Event Names](https://developers.google.com/maps/documentation/javascript/reference/marker?hl=en#Marker-Events)

`callback` is action that must be taken after creating event.

* #### **`setMarkerPosition`**

The method sets marker position.

Parameter: location: google map `LatLng` instance
  
* #### **`createGeocoder`**

This method create a new `Geocoder` instance from `google.maps.Geocoder` class.

* #### **`getAddressOnGeocoder`**

This method find address information with location data.

Parameter: location: google map `LatLng` instance

* #### **`setGeocodeAddress`**

This method find address information by calling the `getAddressOnGeocoder` method and then set address data on map.

* #### **`createInfoWindow`**

This method create a new `InfoWindow` instance from `google.maps.InfoWindow` class.

Parameter: opts = {} (Object)
opts is infowindow instance config
[doc](https://developers.google.com/maps/documentation/javascript/reference/info-window?hl=en#InfoWindowOptions)

* #### **`openInfoWindow`**

This method change InfoWindow content and open InfoWindow

Parameter: opts = {} (Object)
* opts.content is required
and for another [doc](https://developers.google.com/maps/documentation/javascript/reference/info-window?hl=en#InfoWindowOpenOptions)

* #### **`closeInfoWindow`**

This method is close InfoWindow.

* #### **`createAutoComplete`**

This method create a new `Autocomplete` instance from `google.maps.Autocomplete` class.

Parameter: (inputEl: HTMLElement, opts = {})
`inputEl`: The input element that will be used for search action by Google Maps.
`opts`: Autocomplete Options [doc](https://developers.google.com/maps/documentation/javascript/reference/places-widget?hl=en#AutocompleteOptions)

* #### **`getAutoCompleteAddress`**

This method returns the information of the address selected with autocomplete.

* #### **`autoCompleteAddListener`**

A new marker listener is created with the by this method.

Parameter: (eventName: String, callback: Function)
`eventName` is autocomplete event name: [Event Names](https://developers.google.com/maps/documentation/javascript/reference/places-widget?hl=en#SearchBox-Events)

`callback` is action that must be taken after creating event.

* #### **`setAutoComplete`**

This method get address data by calling `getAutoCompleteAddress` method. And then
  * calling `setNewAddress` method
  * calling `setMarkerPosition` method
  * calling `visibleMarker` method set `true`

and return address data.


* #### **`controlContainsCircles`**
  
Checks if a location is within the given circles.

Parameter: (circles, location)

`circles`: Array<{lat, lng}>
`location`: Google Maps LatLng Instance

return `Boolean`

* #### **`createDrawingManager`**

This package has one more special class by name Drawing Manager. This class is for google maps `DrawingManager` library.

With this method, a new instance of the DrawingManager class is created.

* Firstly, created new instance from `DrawingManager` with google and and googleMap instance.

* and then calls the `init` method from that instance. `opts` and `callbacks` parameters were used in this method.

Parameter: (opts = {}, callbacks)
  
  `opts`: 
    
  This is Google Maps Drawing Manager Options: [doc](https://developers.google.com/maps/documentation/javascript/reference/drawing?hl=en#DrawingManagerOptions)

  Additionally, you can enable drawing multiple shapes on the map by sending the `isSingle` value to false.


  callbacks:
  
  This is an object. Object values should be a function that determines what it should be When Overlays updated in map. It returns you the last state of the overlay on the map with the event listener for each shape.

  ```javascript
    const callbacks = {
      circle: (circles) => {
        console.log(circles)
      },
      polygon: (polygons) => {
        console.log(polygons)
      }
      ...
      ...
    }
  ```

### Drawing Manager Class
   
#### Constructor

* ##### **`google`**

A created google map instance

* ##### **`map`**

A created google map instance

* ##### **`manager`**

This is a new `DrawingManager` instance to be created from `google map`.


* ##### **`shapes`**

This is the data that keeps the updated version of the created overlays.


* ##### **`shapeInstances`**

This data is shortcut for Google Map Overlay Types instance.

For example:
 `this.google.maps.Circle` => `this.shapeInstances.Circle`
 `this.google.maps.Polygon` => `this.shapeInstances.Polygon`
 ...

* ##### **callbacks**

This is an object. Object values should be a function that determines what it should be When Overlays updated in map. It returns you the last state of the overlay on the map with the event listener for each shape.

  ```javascript
    const callbacks = {
      circle: (circles) => {
        console.log(circles)
      },
      polygon: (polygons) => {
        console.log(polygons)
      }
      ...
      ...
    }
  ```
This data setted in `init` method.


* ##### **`isSingle`**

This value controls whether more than one overlay will be drawn on the map. Default: `true`

* ##### **`shapeColor`**

This value is default overlay fill or stroke color. Default Value: `#53A1E0`

* ##### **`OverlayTypes`**

This value are google maps drawing overlay types.

`Circle, Polygon, Polyline, Rectangle, Marker`

[More Details For Overlay](https://developers.google.com/maps/documentation/javascript/reference/drawing#OverlayType)



### Getters

* ##### **`maps`**

return `this.google.maps`

* ##### **`OverlayTypeValues`**
  
return OverlayTypes object values.

* ##### **`drawing`**

return `this.maps.drawing`

* ##### **`CIRCLE_SHAPE`**

return `Overlay.CIRCLE` value = `circle`

* ##### **`POLYGON_SHAPE`**

return `Overlay.POLYGON` value = `polygon`

* ##### **`POLYLINE_SHAPE`**

return `Overlay.POLYLINE` value = `polyline`

* ##### **`RECTANGLE_SHAPE`**

return `Overlay.RECTANGLE` value = `rectangle`

* ##### **`MARKER_SHAPE`**

return `Overlay.MARKER` value = `marker`

* ##### **`ALL_SHAPES`**

return all drawed overlays

### Methods

#### **`init`**
 
✅ This method create a new `DrawingManager` with options.

✅ Events for the created shapes are listened here.

✅ The shapes object is updated for each overlay created.

ℹ️ New Shape Data Example:


```javascript
"1647993459291": {shapeData}
```

Note: key is `Date.now()`

Parameter: (opts = {}, callbacks)

#### **`setShapeColor`**

This method is change shape color.

Parameter(color: string)

#### **`runCallShapeCallback`**

This method is run callback action to overlay type

Parameter(type: OverlayType)


#### **`createShapes`**

This method draws overlays with the data of that shape in the specified shape type.


Parameter(obj)

obj has property `type`, `shapes`, `opts`

`type`: Overlay Type
`shapes`: Array <Overlay Data>
`opts`: Overlay options

Note: LatLngLiteral is `{lat: number, lng: number}`

`For CIRCLE`:

* data -> { center: LatLngLiteral, radius: number }
* opts -> [go to document](https://developers.google.com/maps/documentation/javascript/reference/polygon#CircleOptions)

`For POLYGON`: 

* data -> Array<LatLng|LatLngLiteral>
* opts -> [go to document](https://developers.google.com/maps/documentation/javascript/reference/polygon#PolygonOptions)

`For POLYLINE`:

* data -> Array<LatLng|LatLngLiteral>
* opts -> [go to document](https://developers.google.com/maps/documentation/javascript/reference/polygon#PolylineOptions)

`For RECTANGLE`: 

* data -> `LatLngBounds|LatLngBoundsLiteral` 
[LatLngBounds doc](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds)

[LatLngBoundsLiteral doc](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBoundsLiteral)

* opts -> [go to document](https://developers.google.com/maps/documentation/javascript/reference/polygon#RectangleOptions)

`For MARKER`: 
* data -> `LatLng|LatLngLiteral`

* opts -> [go to document](https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions)


#### **`setCallbacks`**

The callbacks data received in the "init" method is set to the `callbacks` data of the class with this method.
  
Parameter(callbacks)

#### **`createPolyBounds`**

This method create a new `bounds` instance for `polygon` or `polyline` overlay and return this bounds.

Parameter(shape)

`shape`: Polygon or Polyline instance

#### **`mapFitBounds`**

This method focuses the map on the area where the shape is located.

Parametre(obj):

obj has property `type`, `shape`

`type`: Overlay type
`shape`: Overlay instance

#### **`afterCompleteDrawing`**

This method is control overlay options after `overlay change` events.

✅ Firstly manager options `drawingMode` set as empty. And If `isSingle == true` then `drawingControl` is set to `true` or `false` depending on the total number of shapes.

✅ Then run callback action (by the method `runCallShapeCallback`)

Parametre(type):

`type`: Overlay type

#### **`getCircleOptions`**

This method merge default circle options with custom options and return this data.

defaults: 

```javascript
  {
    fillColor: shapeColor
    fillOpacity: 0.5
    strokeColor: shapeColor
    strokeWeight: 2,
    draggable: true,
    zIndex: 1
  }
```
Parameter(obj = {}) -> options

#### **`getPolygonOptions`**

This method merge default polygon options with custom options and return this data.

defaults: 

```javascript
  {
    fillColor: shapeColor,
    fillOpacity: 0.5,
    strokeColor: shapeColor,
    strokeWeight: 2,
    draggable: true,
    zIndex: 1
  }
```

Parameter(obj = {}) -> options

#### **`getPolylineOptions`**

This method merge default polyline options with custom options and return this data.

defaults: 

```javascript
  {
    strokeOpacity: 1,
    strokeColor: shapeColor,
    strokeWeight: 2,
    draggable: true,
    zIndex: 1
  }
```

Parameter(obj = {}) -> options

#### **`getRectangleOptions`**

This method merge default rectangle options with custom options and return this data.

defaults: 

```javascript
  {
    fillColor: shapeColor,
    fillOpacity: 0.5,
    strokeColor: shapeColor,
    strokeWeight: 2,
    draggable: true,
    zIndex: 1
  }
```

Parameter(obj = {}) -> options

#### **`getMarkerOptions`**

This method merge default rectangle options with custom options and return this data.

defaults:

```javascript
  {
    draggable: true,
    zIndex: 1,
    anchorPoint: new this.google.maps.Point(0, -29)
  }
```

Parameter(obj = {}) -> options

#### **`getShapeOptions`**
 
This method returns the overlay options by converting them to data required for drawing.

Parameter(obj)

obj has property `type`, `opts`, `shapeData`

`type`: Overlay Type
`opts`: Overlay Options
`shapeData`: Overlay position data(paths, bounds, {center, radius} etc.)

For example:

```javascript

const position = { lat: -34, lng: 151 }
const opts = {
  draggable: false
}

const markerData = this.getShapeOptions({
  type: 'marker',
  opts,
  shapeData: position
})

/**
markerData = {
  zIndex: 1,
  anchorPoint: new this.google.maps.Point(0, -29),
  draggable: false,
  position: { lat: -34, lng: 151 }
}
**
/
```

#### **`getOptions`**

This method merge default drawing manager options with custom options.

Parameter(obj) [doc](https://developers.google.com/maps/documentation/javascript/reference/drawing?hl=en#DrawingManagerOptions)

**`setOverlayEvents`**

This method create events for existing shapes.

Events:

`rightclick`: the shape is deleted.

-------------------------------------

`radius_changed`: CIRCLE
`center_changed`: CIRCLE

`bounds_changed`: RECTANGLE

`insert_at`: POLYGON and POLYLINE path
`remove_at`: POLYGON and POLYLINE path
`set_at`: POLYGON and POLYLINE path

`dragend`: MARKER

Each of these events take the current version of existing shapes and updates this information in shapes data.


#### **`setOverlay`**

This method update `shapes` object.And then calls `afterCompleteDrawing` method.

Parameter(obj)

obj has property `key`, `type`, `overlay`

`key`: uniqueKey for shape data. This is `Date.now()` for `init` and `createShapes` methods.

`type`: Overlay Type

`Overlay`: Overlay instance


#### **`removeOverlay`**

This method remove shape data from shapes and on map. And then calls `afterCompleteDrawing` method.

Parameter(obj)

obj has property `key`, `type`, `overlay`

`key`: uniqueKey for shape data. This is `Date.now()` for `init` and `createShapes` methods.

`type`: Overlay Type

`Overlay`: Overlay instance
