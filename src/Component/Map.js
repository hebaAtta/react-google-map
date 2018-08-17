import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React, { Component } from 'react';
class Map extends Component {
  render() {
    return (
      <Map role="aria"
       google={this.props.google} zoom={14}/>



    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyARC-a63vxOWRRAgpjnDYOndn_2fFLYhAo")
})(Map)
