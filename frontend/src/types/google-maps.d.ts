/// <reference types="google.maps" />

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setMap(map: Map | null): void;
    }

    interface MapOptions {
      center: LatLng | LatLngLiteral;
      zoom: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      addListener(event: string, handler: () => void): void;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map: Map;
      title?: string;
      label?: {
        text: string;
        color: string;
        fontWeight?: string;
      };
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map, anchor?: Marker): void;
    }

    interface InfoWindowOptions {
      content: string | Element;
      position?: LatLng | LatLngLiteral;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
  }
} 