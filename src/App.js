import './App.css';

import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import Places from './Component/Places'
import MapContainer from './Component/MapContainer'
import React, { Component } from 'react';
import superagent from 'superagent';
class App extends Component {
  componentDidMount(){
    console.log("heba");
  }


  render() {

    return (
      <div className="App">

        <MapContainer google={this.props.google}
           />

      </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: ("AIzaSyARC-a63vxOWRRAgpjnDYOndn_2fFLYhAo")
})(App)
