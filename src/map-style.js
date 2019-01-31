import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
export const dataLayer = fromJS({
  id: 'data',
  source: 'residents',
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': {
      property: 'percentile',
      stops: [
        [0, '#F9E57D'],
        [1, '#F7CD74'],
        [2, '#F5B46C'],
        [3, '#F39C63'],
        [4, '#EE6B52'],
        [5, '#EC5349'],
        [6, '#EA3A41'],
        [7, '#E82238'],
        [8, '#E60A30'],
      ]
    },
    'fill-opacity': 0.8
  }
});

/*
blue
      stops: [
        [0, '#0A98C5'],
        [1, '#0F85C9'],
        [2, '#1472CD'],
        [3, '#195FD1'],
        [4, '#1E4CD5'],
        [5, '#2339D9'],
        [6, '#2826DD'],
        [7, '#2D13E1'],
        [8, '#3300E5'],
      ]
red
stops: [
        [0, '#F9E57D'],
        [1, '#F7CD74'],
        [2, '#F5B46C'],
        [3, '#F39C63'],
        [4, '#EE6B52'],
        [5, '#EC5349'],
        [6, '#EA3A41'],
        [7, '#E82238'],
        [8, '#E60A30'],
      ]




*/

export const heatMapLayer = fromJS({
  "id": "economicheatmap",
  "type": "heatmap",
  "source": "economicheatmap",
  "maxzoom": 9,
  "paint": {
      // Increase the heatmap weight based on frequency and property magnitude
      "heatmap-weight": [
          "interpolate",
          ["linear"],
          ["get", "mag"],
          0, 0,
          6, 1
      ],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      "heatmap-intensity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0, 1,
          9, 3
      ],
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, "rgba(33,102,172,0)",
          0.2, "rgb(103,169,207)",
          0.4, "rgb(209,229,240)",
          0.6, "rgb(253,219,199)",
          0.8, "rgb(239,138,98)",
          1, "rgb(178,24,43)"
      ],
      // Adjust the heatmap radius by zoom level
      "heatmap-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0, 5,
          20, 60
      ],
      // Transition from heatmap to circle layer by zoom level
      "heatmap-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8, 1,
          9, 0
      ],
  }});

export const defaultMapStyle = fromJS(MAP_STYLE)


/*

  "paint": {
      // Increase the heatmap weight based on frequency and property magnitude
      "heatmap-weight": [
          "interpolate",
          ["linear"],
          ["get", "mag"],
          0, 0,
          6, 1
      ],
      // Increase the heatmap color weight weight by zoom level
      // heatmap-intensity is a multiplier on top of heatmap-weight
      "heatmap-intensity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0, 1,
          9, 3
      ],
      // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
      // Begin color ramp at 0-stop with a 0-transparancy color
      // to create a blur-like effect.
      "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, "rgba(33,102,172,0)",
          0.2, "rgb(103,169,207)",
          0.4, "rgb(209,229,240)",
          0.6, "rgb(253,219,199)",
          0.8, "rgb(239,138,98)",
          1, "rgb(178,24,43)"
      ],
      // Adjust the heatmap radius by zoom level
      "heatmap-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0, 5,
          20, 60
      ],
      // Transition from heatmap to circle layer by zoom level
      "heatmap-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8, 1,
          9, 0
      ],
  }*/


