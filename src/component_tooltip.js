import React, { Component } from 'react';

export default function Tooltip(props) {
    return (  
    <div className="tooltip" style={{left: props.x, top: props.y}}>
    <div>State: {props.hoveredFeature}</div>
    <div>Median Household Income: {props.hoveredFeature}</div>
    <div>Percentile: {props.hoveredFeature}</div>
    </div>);
  }