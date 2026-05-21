import React, { useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, PolylineF, OverlayViewF } from '@react-google-maps/api';
import { Navigation, Home, Utensils, Zap, Target, Activity, Plus, Bike } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const mapOptions = {
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
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }]
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
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }]
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }]
    }
  ]
};

const TacticalMarker = ({ position, type, label }) => {
  const getIcon = () => {
    switch(type) {
      case 'restaurant': return (
        <div className="relative flex flex-col items-center">
            <div className="absolute -inset-4 bg-orange-500/20 rounded-full animate-ping-slow" />
            <div className="p-3 bg-orange-500 rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.4)] text-white border-2 border-white relative z-10">
                <Utensils size={22} />
            </div>
            <div className="w-1 h-4 bg-orange-500 -mt-1 shadow-lg" />
        </div>
      );
      case 'home': return (
        <div className="relative flex flex-col items-center">
            <div className="absolute -inset-4 bg-emerald-500/20 rounded-full animate-pulse" />
            <div className="p-3 bg-emerald-500 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] text-white border-2 border-white relative z-10">
                <Home size={22} />
            </div>
            <div className="w-1 h-4 bg-emerald-500 -mt-1 shadow-lg" />
        </div>
      );
      case 'rider': return (
        <div className="relative">
          <div className="absolute -inset-6 bg-primary/20 rounded-full animate-radar" />
          <div className="p-3.5 bg-slate-900 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] text-primary border-2 border-primary/50 relative z-10 overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
            <Bike size={24} className="relative z-10 animate-float" />
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <OverlayViewF
      position={position}
      mapPaneName={OverlayViewF.OVERLAY_MOUSE_TARGET}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
        {getIcon()}
        {label && (
          <div className="mt-4 bg-slate-900/95 backdrop-blur-xl px-4 py-2 rounded-xl shadow-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 origin-top pointer-events-none">
            <p className="text-[9px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap">{label}</p>
          </div>
        )}
      </div>
    </OverlayViewF>
  );
};

const GOOGLE_MAPS_LIBRARIES = ['geometry', 'places'];

const LiveMap = ({ riderLocation, restaurantLocation, customerLocation, restaurantName, customerName, zoom = 13 }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY",
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  const mapRef = useRef(null);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const isValid = (loc) => {
    if (!loc) return false;
    const lat = Number(loc.lat);
    const lng = Number(loc.lng);
    return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  };

  const parseLoc = (loc) => ({ lat: Number(loc.lat), lng: Number(loc.lng) });

  const mapCenter = isValid(riderLocation) ? parseLoc(riderLocation) : 
                    isValid(restaurantLocation) ? parseLoc(restaurantLocation) : 
                    isValid(customerLocation) ? parseLoc(customerLocation) : 
                    { lat: 24.1030, lng: 72.3361 };

  const routePositions = [restaurantLocation, riderLocation, customerLocation]
        .filter(isValid)
        .map(parseLoc);

  // Auto-fit bounds when locations change
  useEffect(() => {
    if (mapRef.current && window.google) {
      const bounds = new window.google.maps.LatLngBounds();
      let pointCount = 0;

      if (isValid(restaurantLocation)) { bounds.extend(parseLoc(restaurantLocation)); pointCount++; }
      if (isValid(customerLocation)) { bounds.extend(parseLoc(customerLocation)); pointCount++; }
      if (isValid(riderLocation)) { bounds.extend(parseLoc(riderLocation)); pointCount++; }

      if (pointCount > 1) {
        mapRef.current.fitBounds(bounds, {
            top: 150, bottom: 150, left: 150, right: 150
        });
      } else if (pointCount === 1) {
        mapRef.current.setCenter(mapCenter);
        mapRef.current.setZoom(zoom);
      }
    }
  }, [restaurantLocation, customerLocation, riderLocation, isLoaded, zoom]);

  const handleZoom = (dir) => {
    if (mapRef.current) {
        mapRef.current.setZoom(mapRef.current.getZoom() + dir);
    }
  };

  const handleRecenter = () => {
    if (mapRef.current) {
        mapRef.current.setCenter(mapCenter);
        mapRef.current.setZoom(zoom);
    }
  };

  if (loadError) return <div className="p-4 text-red-500 text-center font-black uppercase tracking-widest bg-slate-900 h-full flex items-center justify-center">Map Interface Failure</div>;
  if (!isLoaded) return <div className="h-full w-full bg-slate-900 animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
          <Zap className="text-primary animate-bounce" size={32} />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Initializing Satellites...</span>
      </div>
  </div>;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {isValid(restaurantLocation) && (
          <>
            {/* Pulsing Supply Radar */}
            <OverlayViewF position={parseLoc(restaurantLocation)} mapPaneName={OverlayViewF.OVERLAY_MOUSE_TARGET}>
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                    <div className="w-48 h-48 bg-orange-500/10 rounded-full animate-ping-slow border border-orange-500/20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-orange-500/5 rounded-full border border-orange-500/10" />
                </div>
            </OverlayViewF>
            <TacticalMarker 
                type="restaurant" 
                position={parseLoc(restaurantLocation)} 
                label={restaurantName}
            />
          </>
        )}

        {isValid(customerLocation) && (
          <TacticalMarker 
            type="home" 
            position={parseLoc(customerLocation)} 
            label={customerName}
          />
        )}

        {isValid(riderLocation) && (
          <TacticalMarker 
            type="rider" 
            position={parseLoc(riderLocation)} 
          />
        )}

        {routePositions.length > 1 && (
            <PolylineF
              path={routePositions}
              options={{
                strokeColor: '#10b981',
                strokeOpacity: 0.8,
                strokeWeight: 4,
                icons: [{
                    icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3, strokeColor: '#fff' },
                    offset: '0',
                    repeat: '20px'
                }]
              }}
            />
        )}
      </GoogleMap>

      {/* Floating Controls (Google Maps Style) */}
      <div className="absolute right-6 bottom-12 z-20 flex flex-col gap-3 pointer-events-auto">
        <button 
            onClick={handleRecenter}
            className="w-14 h-14 bg-white dark:bg-slate-900 rounded-[1.2rem] flex items-center justify-center text-slate-600 dark:text-slate-400 shadow-2xl border border-slate-100 dark:border-white/10 hover:text-primary transition-all active:scale-90"
        >
            <Target size={24} />
        </button>
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-[1.2rem] shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
            <button 
                onClick={() => handleZoom(1)}
                className="w-14 h-14 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all border-b border-slate-100 dark:border-white/5"
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

      {/* Modern Scale/Coordinate Telemetry */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
         <div className="bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-3">
            <div className="w-1 h-3 bg-white/20 rounded-full" />
            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">
                {mapCenter.lat.toFixed(4)}N / {mapCenter.lng.toFixed(4)}E
            </span>
         </div>
      </div>
    </div>
  );
};

export default LiveMap;
