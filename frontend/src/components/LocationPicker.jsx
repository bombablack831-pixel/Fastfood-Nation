import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, Autocomplete } from '@react-google-maps/api';
import { Target, Search, Loader2, MapPin, Plus } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '350px'
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    styles: [
        { elementType: 'geometry', stylers: [{ color: '#1a1c1e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1c1e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
        }
    ]
};

const GOOGLE_MAPS_LIBRARIES = ['geometry', 'places'];

const LocationPicker = ({ initialLocation, onLocationSelect }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_MAPS_LIBRARIES
    });

    const [marker, setMarker] = useState(initialLocation || { lat: 24.1030, lng: 72.3361 });
    const [fetching, setFetching] = useState(false);
    const [autocomplete, setAutocomplete] = useState(null);
    const [zoom, setZoom] = useState(15);
    const mapRef = useRef(null);

    useEffect(() => {
        if (initialLocation && initialLocation.lat && initialLocation.lng) {
            setMarker(initialLocation);
        } else {
            // Try to auto-locate on mount if no initial location
            getCurrentLocation();
        }
    }, [initialLocation]);

    const onLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const onAutocompleteLoad = (autocompleteInstance) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                const newPos = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                setMarker(newPos);
                onLocationSelect(newPos);
                if (mapRef.current) {
                    mapRef.current.panTo(newPos);
                    mapRef.current.setZoom(17);
                }
            }
        }
    };

    const handleMapClick = useCallback((e) => {
        const newPos = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        };
        setMarker(newPos);
        onLocationSelect(newPos);
    }, [onLocationSelect]);

    const getCurrentLocation = () => {
        setFetching(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newPos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setMarker(newPos);
                    onLocationSelect(newPos);
                    if (mapRef.current) {
                        mapRef.current.panTo(newPos);
                        mapRef.current.setZoom(17);
                    }
                    setFetching(false);
                },
                () => {
                    alert('Could not get your location. Please use search or select on map.');
                    setFetching(false);
                }
            );
        }
    };

    const handleZoom = (dir) => {
        if (mapRef.current) {
            setZoom(prev => prev + dir);
        }
    };

    if (loadError) return <div className="text-red-500 p-4 border border-red-100 rounded-2xl">Map Load Error</div>;
    if (!isLoaded) return <div className="h-[350px] w-full bg-slate-900 animate-pulse rounded-[2.5rem] flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] text-white">Initializing Tracking...</div>;

    return (
        <div className="space-y-4">
            <div className="relative rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
                {/* Search Bar Overlay */}
                {isLoaded && (
                    <div className="absolute top-6 left-6 right-6 z-10">
                        <Autocomplete
                            onLoad={onAutocompleteLoad}
                            onPlaceChanged={onPlaceChanged}
                        >
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                    <Search size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="SEARCH FOR TARGET HUB..."
                                    className="w-full bg-white/95 backdrop-blur-xl border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 shadow-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none placeholder:text-slate-300"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') e.preventDefault();
                                    }}
                                />
                            </div>
                        </Autocomplete>
                    </div>
                )}

                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={marker}
                    zoom={zoom}
                    onLoad={onLoad}
                    onUnmount={() => mapRef.current = null}
                    onClick={handleMapClick}
                    onZoomChanged={() => {
                        if (mapRef.current) setZoom(mapRef.current.getZoom());
                    }}
                    options={mapOptions}
                >
                    <MarkerF 
                        position={marker} 
                        draggable={true}
                        onDragEnd={handleMapClick}
                        icon={{
                            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                            fillColor: "#10b981",
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "#ffffff",
                            scale: 2,
                            anchor: new window.google.maps.Point(12, 22)
                        }}
                    />
                </GoogleMap>

                {/* Floating Controls (Matching Order Tracking) */}
                <div className="absolute right-6 bottom-12 z-20 flex flex-col gap-3">
                    <button 
                        onClick={getCurrentLocation}
                        disabled={fetching}
                        className={`w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 shadow-2xl border border-white/10 hover:text-emerald-500 transition-all active:scale-90 ${fetching ? 'animate-pulse' : ''}`}
                    >
                        <Target size={24} className={fetching ? 'animate-spin' : ''} />
                    </button>
                    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                        <button 
                            onClick={() => handleZoom(1)}
                            className="w-14 h-14 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all border-b border-white/5"
                        >
                            <Plus size={20} />
                        </button>
                        <button 
                            onClick={() => handleZoom(-1)}
                            className="w-14 h-14 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                        >
                            <div className="w-4 h-0.5 bg-current rounded-full" />
                        </button>
                    </div>
                </div>

                {/* Tactical Coordinate Telemetry */}
                <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                    <div className="bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-3 shadow-2xl">
                        <div className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">
                            {marker.lat.toFixed(4)}N / {marker.lng.toFixed(4)}E
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center justify-center gap-3">
                <MapPin size={12} className="text-emerald-500 animate-bounce" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                    Drag the emerald pin or use search to lock destination
                </p>
            </div>
        </div>
    );
};

export default LocationPicker;
