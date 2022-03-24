import { Loader } from '@googlemaps/js-api-loader'

function makeFirstUppercase (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
  * @typedef {"drawing" | "geometry" | "localContext" | "places" | "visualization"} Libraries
  * @typedef {"weekly" | "quarterly"| "beta" } Version
*/

/**
 * @typedef {object} GoogleMapsOptions
 * @property {apiKey} string - Google Maps API Key
 * @property {HTMLElement} el - Rendering map elemenet
 * @property {string} language - Google Maps Data Language
 * @property {Version} version - Google Maps API Version
 * @property {Array<Libraries>} libraries - Used Google Maps libraries
 * @property {Object} mapOptions - Map Init Options
 * @property {Number} zoom - Map Zoom
*/

export default class GoogleMaps {
  /**
   * @class GoogleMaps
   * @constructor
   * @param {GoogleMapsOptions} opts Google Maps Options
  */
  constructor (opts = {}) {
    this.options = opts
    //
    this.el = opts.el
    this.language = opts.language || 'en'
    this.location = opts.location || { lat: 0, lng: 0 }
    this.version = opts.version || 'quarterly'
    this.libraries = opts.libraries || ['places']
    this.zoom = opts.zoom || 11

    //
    this.google = null
    this.googleMap = null
    this.autocomplete = null
    this.marker = null
    this.geocoder = null
    this.infoWindow = null
    this.drawingManager = null

    // Generate Loader
    this.Loader = new Loader({
      apiKey: opts.apiKey,
      version: this.version,
      libraries: this.libraries,
      language: this.language,
      ...opts.loaderOptions || {}
    })
  }

  // create google instance
  async createInstance () {
    this.google = await this.Loader.load()
  }

  // map init options
  get mapOptions () {
    return {
      zoom: this.zoom,
      center: this.location,
      mapTypeControl: false,
      streetViewControl: false,
      ...(this.options.mapOptions || {})
    }
  }


  // - MAP

  // create map
  async init (ignoreCurrentLocation) {
    const location = this.options.location
    if (!location && !ignoreCurrentLocation) {
      await this.setCurrentLocation()
    }
    try {
      await this.createInstance()
      this.googleMap = new this.google.maps.Map(this.el, this.mapOptions)
    } catch (error) {
      console.error(error)
    }
  }

  // - ZOOM

  // get map zoom value
  getZoom () {
    return this.googleMap.getZoom()
  }
  // reset map zoom
  resetZoom () {
    this.setZoom(this.zoom)
  }
  // set map zoom
  setZoom (zoom) {
    this.googleMap.setZoom(zoom)
  }


  // get map center
  getMapCenter () {
    return this.googleMap.getCenter()
  }

  // - LOCATIONS
  // set location data
  setLocation (location) {
    this.location.lat = location.lat
    this.location.lng = location.lng
  }

  // find location from device
  async getCurrentLocation (options = {}) {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
  }
  

  // get current location and set this data
  async setCurrentLocation () {
    let location = ''
    try {
      location = await this.getCurrentLocation()
    } catch (error) {
      console.log(error)
    } finally {
      if (location) {
        const { latitude, longitude } = location.coords
        const coords = {
          lat: latitude,
          lng: longitude
        }
        this.setLocation(coords)
      }
    }
  }

  // create location instance from location info
  generateLocationData (location) {
    return new this.google.maps.LatLng(location.lat, location.lng)
  }

  // convert location instance to object
  convertPositionInfo (position) {
    return {
      lat: position.lat(),
      lng: position.lng()
    }
  }

  // set address data to map
  setNewAddress (address) {
    if (
      !address ||
      !address.geometry ||
      !address.geometry.location) return

    const { location } = address.geometry
    const coords = this.convertPositionInfo(location)
    this.googleMap.setCenter(coords)
    if (!this.drawingManager) {
      this.setZoom(15)
    }

    return { ...address, coords }
  }

  // - MARKER

  // create location maker
  createMarker (opts = {}) {
    this.marker = new this.google.maps.Marker({
      map: this.googleMap,
      anchorPoint: new this.google.maps.Point(0, -29),
      ...opts
    })

    this.setMarkerPosition(this.location)
    this.createInfoWindow()
  }

  // set visible status for marker
  visibleMarker (visible) {
    this.marker.setVisible(visible)
  }

  // get marker position
  getMarkerPosition () {
    if (!this.marker) return
    const position = this.marker.getPosition()
    return this.convertPositionInfo(position)
  }

  // set marker location data to map
  async setMarkerData () {
    const location = this.getMarkerPosition()
    this.googleMap.setCenter(location)
    const address = await this.setGeocodeAddress(location)
    return address
  }

  // create a marker event
  markerAddListener (eventName, callback) {
    if (!this.marker) return
    this.marker.addListener(eventName, callback)
  }

  // change marker position
  setMarkerPosition (location) {
    this.marker.setPosition(location)
  }

  // - GEOCODER

  // create geocoder service -- for find location info
  createGeocoder () {
    this.geocoder = new this.google.maps.Geocoder()
  }

  // get address information with geocoder
  async getAddressOnGeocoder (location) {
    if (!location) return null
    try {
      const data = await this.geocoder.geocode({ location })
      const address = data.results[0]
      return address
    } catch (error) {
      console.error('error geocode', error)
      return null
    }
  }

  async setGeocodeAddress (location) {
    const address = await this.getAddressOnGeocoder(location)
    if (address) {
      this.setNewAddress(address)
    }

    return address
  }

  // - INFO WINDOW

  // create information popup for marker
  createInfoWindow (opts = {}) {
    this.infoWindow = new this.google.maps.InfoWindow(opts)
  }

  // open information popup
  openInfoWindow (opts = {}) {
    this.infoWindow.setContent(opts.content)
    this.infoWindow.open({
      anchor: this.marker,
      map: this.googleMap,
      ...opts
    })
  }

  // close info window
  closeInfoWindow () {
    this.infoWindow.close()
  }

  // -  AUTOCOMPLETE

  // create place search
  createAutoComplete (inputEl, opts = {}) {
    if (!this.google) return
    const autocomplete = new this.google.maps.places.Autocomplete(inputEl, opts)
    this.autocomplete = autocomplete
  }

  // get address information from autocomplete service
  getAutoCompleteAddress () {
    return this.autocomplete.getPlace()
  }

  // create a autocomplete service event
  autoCompleteAddListener (eventName, callback) {
    if (!this.autocomplete) return
    this.autocomplete.addListener(eventName, (e) => callback(e))
  }

  // set autocomplete location data to map
  setAutoComplete () {
    const address = this.getAutoCompleteAddress()
    const data = this.setNewAddress(address)
    this.setMarkerPosition(data.coords)
    this.visibleMarker(true)
    return data
  }

  // - DRAWING MANAGER

  // location control according to circle areas
  controlContainsCircles (circles, location) {
    return circles.some(circle => {
      // circle -> { center: locationObject, radius }
      const isIn = new this.google.maps.Circle(circle)
        .getBounds()
        .contains({ lat: location.lat, lng: location.lng })
      return isIn
    })
  }

  // create drawing tool
  createDrawingManager (opts = {}, callbacks) {
    const drawingManager = new DrawingManager(this.google, this.googleMap)
    drawingManager.init(opts, callbacks)
    this.drawingManager = drawingManager
  }
}

class DrawingManager {
  /**
 * @class DrawingManager
 * @constructor
 * @param {Class} google - a created google map instance
 * @param {Class} map - a created google map
 **/
  constructor (google, map) {
    this.google = google
    this.map = map
    this.manager = null
    this.shapes = {}
    this.shapeInstances = {}
    this.callbacks = {}
    this.isSingle = true
    this.shapeColor = '#53A1E0'
    //  https://developers.google.com/maps/documentation/javascript/reference/drawing#OverlayType
    this.OverlayTypes = google.maps.drawing.OverlayType


    this.OverlayTypeValues.map(type => {
      const shapeInstanceName = makeFirstUppercase(type)
      this.shapes[type] = {}
      this.callbacks[type] = null
      this.shapeInstances[type] = this.google.maps[shapeInstanceName]
    })
  }

  // maps instance
  get maps () {
    if (!this.google) return
    return this.google.maps
  }

  get OverlayTypeValues () {
    return Object.values(this.OverlayTypes)
  }

  // drawing tool
  get drawing () {
    if (!this.maps) return
    return this.maps.drawing
  }

  // - SHAPES
  get CIRCLE_SHAPE () {
    return this.OverlayTypes.CIRCLE
  }

  get POLYGON_SHAPE () {
    return this.OverlayTypes.POLYGON
  }

  get POLYLINE_SHAPE () {
    return this.OverlayTypes.POLYLINE
  }

  get RECTANGLE_SHAPE () {
    return this.OverlayTypes.RECTANGLE
  }

  get MARKER_SHAPE () {
    return this.OverlayTypes.MARKER
  }

  get ALL_SHAPES () {
    const data = Object.values(this.shapes)
      .map(data => Object.values(data))
    return data.flat()
  }


  // create drawing tool and drawing object event
  init (opts = {}, callbacks) {
    // set callbacks function
    this.setCallbacks(callbacks)
    // set isSingle
    if (Object.prototype.hasOwnProperty.call(opts, 'isSingle')) {
      this.isSingle = opts.isSingle
    }

    // replace object
    const options = this.getOptions(opts)

    // creating tool and set map
    this.manager = new this.drawing.DrawingManager(options)
    this.manager.setMap(this.map)

    // creating object events
    this.maps.event.addListener(this.manager, 'overlaycomplete', (data) => {
      const { type, overlay } = data
      // set creating circle to object
      const key = Date.now()

      const overlayObj = { key, type, overlay }
      this.setOverlay(overlayObj)

      // change editable opts
      if (overlay.setEditable) overlay.setEditable(true)

      // // listeners overlay events
      this.setOverlayEvents(overlayObj)
    })
  }

  // change shape color
  setShapeColor (color) {
    this.shapeColor = color
  }

  // run ballbacks
  runCallShapeCallback (type) {
    const action = this.callbacks[type]
    if (action && typeof action === 'function') {
      action(this.shapes[type])
    }
  }

  // create shapes
  createShapes ({ type, shapes, opts = {} }) {
    shapes.map(shapeData => {
      const shapeOptions = this.getShapeOptions({ type, shapeData, opts })
      const options = {
        ...shapeOptions,
        editable: true,
        map: this.map
      }

      const shape = new this.shapeInstances[type](options)
      const key = Date.now()

      const shapeObj = {
        key,
        type,
        overlay: shape
      }

      this.setOverlay(shapeObj)
      this.afterCompleteDrawing(type)
      this.setOverlayEvents(shapeObj)

      this.mapFitBounds({ type, shape })
    })
  }
  

  // CALLBACKS
  setCallbacks (callbacks) {
    if (!callbacks) return
    if (typeof callbacks !== 'object') {
      throw Error('callbacks must be object')
    }

    const callbackKeys = Object.keys(callbacks)
    callbackKeys.forEach(type => {
      const hasKey = this.OverlayTypeValues.includes(type)
      if (!hasKey) {
        throw Error(`${type}cannot be used as a callback. You can looks drawing overlay types. https://developers.google.com/maps/documentation/javascript/reference/drawing#OverlayType`)
      } else {
        this.callbacks[type] = callbacks[type]
      }
    })
  }

  // - FIT BOUNDS

  // create poly bouds
  createPolyBounds (shape) {
    const bounds = new this.google.maps.LatLngBounds()
    for (const path of shape.getPath().getArray()) {
      bounds.extend(path)
    }

    return bounds
  }

  // set shape center bounds
  mapFitBounds ({ type, shape }) {
    let bounds

    switch (type) {
      case this.CIRCLE_SHAPE:
      case this.RECTANGLE_SHAPE:
        bounds = shape.getBounds()
        break
      case this.POLYGON_SHAPE:
      case this.POLYLINE_SHAPE:
        bounds = this.createPolyBounds(shape)
        break
      case this.MARKER_SHAPE:
        this.map.setCenter(shape.getPosition())
        this.map.setZoom(15)
        break
      default:
        break
    }

    if (bounds) {
      this.map.fitBounds(bounds)
    }
  }

  // control Circle actions after complete drawing
  afterCompleteDrawing (type) {
    const shapesCount = this.ALL_SHAPES.length
    this.manager.setOptions({
      drawingMode: ''
    })

    if (this.isSingle) {
      this.manager.setOptions({
        drawingControl: shapesCount === 0
      })
    }

    this.runCallShapeCallback(type)
  }


  // - SHAPES OPTIONS
  
  // get circle options
  getCircleOptions (opts = {}) {
    const shapeColor = this.shapeColor
    return {
      fillColor: shapeColor,
      fillOpacity: 0.5,
      strokeColor: shapeColor,
      strokeWeight: 2,
      draggable: true,
      zIndex: 1,
      ...opts
    }
  }

  // get polygon options
  getPolygonOptions (opts = {}) {
    const shapeColor = this.shapeColor
    return {
      fillColor: shapeColor,
      fillOpacity: 0.5,
      strokeColor: shapeColor,
      strokeWeight: 2,
      draggable: true,
      zIndex: 1,
      ...opts
    }
  }

  // get polyline options
  getPolylineOptions (opts = {}) {
    const shapeColor = this.shapeColor
    return {
      strokeOpacity: 1,
      strokeColor: shapeColor,
      strokeWeight: 2,
      draggable: true,
      zIndex: 1,
      ...opts
    }
  }

  // get rectangle options
  getRectangleOptions (opts = {}) {
    const shapeColor = this.shapeColor
    return {
      fillColor: shapeColor,
      fillOpacity: 0.5,
      strokeColor: shapeColor,
      strokeWeight: 2,
      draggable: true,
      zIndex: 1,
      ...opts
    }
  }

  // get marker options
  getMarkerOptions (opts = {}) {
    return {
      draggable: true,
      zIndex: 1,
      anchorPoint: new this.google.maps.Point(0, -29),
      ...opts
    }
  }

  // get shape options
  getShapeOptions ({ type, opts = {}, shapeData }) {
    switch (type) {
      case this.CIRCLE_SHAPE:
        return {
          ...this.getCircleOptions(opts),
          center: shapeData.center,
          radius: shapeData.radius
        }
      case this.POLYGON_SHAPE:
        return {
          ...this.getPolygonOptions(opts),
          paths: shapeData
        }
      case this.POLYLINE_SHAPE:
        return {
          ...this.getPolylineOptions(opts),
          path: shapeData
        }
      case this.RECTANGLE_SHAPE:
        return {
          ...this.getRectangleOptions(opts),
          bounds: shapeData
        }
      case this.MARKER_SHAPE:
        return {
          ...this.getMarkerOptions(opts),
          position: shapeData
        }
      default:
        return {}
    }
  }

  // shapes options
  // replace opts with defaults
  getOptions (opts) {
    const defaultOptions = {
      drawingMode: '',
      drawingControl: true,
      map: this.map,
      drawingControlOptions: {
        drawingModes: this.OverlayTypeValues
      }
    }

    const drawingControlOptions = {
      ...defaultOptions.drawingControlOptions,
      ...(opts.drawingControlOptions || {})
    }

    const options = {
      ...defaultOptions,
      ...opts,
      drawingControlOptions,
      circleOptions: { ...this.getCircleOptions(opts.circleOptions) },
      polygonOptions: { ...this.getPolygonOptions(opts.polygonOptions) },
      polylineOptions: { ...this.getPolygonOptions(opts.polylineOptions) },
      rectangleOptions: { ...this.getRectangleOptions(opts.rectangleOptions) },
      markerOptions: { ...this.getMarkerOptions(opts.rectangleOptions) }
    }

    return options
  }

  // -OVERLAY EVENTS

  // set shape events
  setOverlayEvents ({ key, type, overlay }) {
    overlay.addListener('rightclick', () => this.removeOverlay({ key, type, overlay }))
    switch (type) {
      case this.CIRCLE_SHAPE:
        overlay.addListener('radius_changed', () => this.setOverlay({ key, type, overlay }))
        overlay.addListener('center_changed', () => this.setOverlay({ key, type, overlay }))
        break
      case this.RECTANGLE_SHAPE:
        overlay.addListener('bounds_changed', () => this.setOverlay({ key, type, overlay }))
        break
      case this.POLYGON_SHAPE:
      case this.POLYLINE_SHAPE:
        const path = overlay.getPath()
        path.addListener('insert_at', () => this.setOverlay({ key, type, overlay }))
        path.addListener('remove_at', () => this.setOverlay({ key, type, overlay }))
        path.addListener('set_at', () => this.setOverlay({ key, type, overlay }))
        break
      case this.MARKER_SHAPE:
        overlay.addListener('dragend', () => this.setOverlay({ key, type, overlay }))
        break
      default:
        break
    }
  }
  // set overlay
  setOverlay ({ key, type, overlay }) {
    this.shapes[type][key] = overlay
    this.afterCompleteDrawing(type)
  }

  // remove overlay
  removeOverlay ({ key, type, overlay }) {
    overlay.setMap()
    delete this.shapes[type][key]
    this.afterCompleteDrawing(type)
  }
}
