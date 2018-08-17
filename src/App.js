import './App.css';

import {  GoogleApiWrapper} from 'google-maps-react';

import MapContainer from './Component/MapContainer'
import React, { Component } from 'react';

class App extends Component {
  componentDidMount(){
    console.log("heba");
  }


  render() {

    return (
      <div>

        <MapContainer role="aria"
         google={this.props.google}
           />

      </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: ("AIzaSyARC-a63vxOWRRAgpjnDYOndn_2fFLYhAo")
})(App)
