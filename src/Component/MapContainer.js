import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom'

export class MapContainer extends Component {

  state = {
    locations :[
    {  name: "Hambaka Cafe (بورصة همبكه)",location: {lat: 31.19889360178603,lng: 29.91774934626809},address: "Beside Olympic Club" },
    {  name: "Waly Cafe (بورصة والي)",location: {lat: 31.214762877225713,lng: 29.921239154041878},address: "El-Geish Rd." },
    {  name: "El Togaria Cafe (البورصة التجارية)",location: {lat: 31.20012587468943,lng: 29.895458551893515},address: "El-Geish Rd." },
    {  name: "Qenawy Cafe (بورصة قناوي)",location: {lat: 31.198324518848832,lng: 29.904462715599102},address: "Fahmi Fawzi El Gendi St"},
    {  name: "Grand Café",location: {lat: 31.205324644366804,lng: 29.885036059691988} ,address:"Corniche Road - 26th Of July"},
    ],
    query :'',
    markers:[],
    Animation:null,
    error:null,
    InfoWindow:new this.props.google.maps.InfoWindow()
  }

  componentDidMount(){
    const foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=31.2000924,29.9187387&query=cafe&radius=10000&client_id=DY0JQBSDV3ZX2TEBPSQJL24K50OGEEYPQVSCIX2IBZ1TSV0O&&client_secret=CDQKPG5C5P12SA3102OSYQGYVK4PFWGTYTJ53PROQDWDIS5U&v=20180816'
    fetch(foursquareURL)
    .then(data => {
    if(data.ok) {
      return data.json()
    } else {
      alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
    }
  })
   .then(data => {
    this.loadMap()

    this.onclickLoc()
    })
    .catch(err => {
       this.setState({error: err.toString()})
       alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
     })
    this.setState({Animation:this.changeMarker('ffff44')})



  }

  changeMarker=(markerColor)=>{
    const {google}=this.props
    var image = new google.maps.MarkerImage(
    'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    new google.maps.Size(71, 71),
    new google.maps.Point(0, 0),
    new google.maps.Point(17, 34),
    new google.maps.Size(25, 25));
    return  image;
 }
   loadMap(){
     if(this.props && this.props.google){
       const {google}= this.props
       const maps = google.maps

       const mapRef = this.refs.map
       const node = ReactDOM.findDOMNode(mapRef)
       const mapConfig = Object.assign({},{
       center :{lat : 31.2000924,lng : 29.9187387},
       zoom :14,

       mapTypeId :'roadmap'
       })
       this.map = new maps.Map(node,mapConfig)
       this.addMarkers()
     }
   }
   // Foursquare API settings
 	clientID = "DY0JQBSDV3ZX2TEBPSQJL24K50OGEEYPQVSCIX2IBZ1TSV0O";
 	clientSecret = "CDQKPG5C5P12SA3102OSYQGYVK4PFWGTYTJ53PROQDWDIS5U";



onclickLoc= ()=>{
  const here =this
  const {InfoWindow}=this.state
  const displayInfowindo = (e) => {
    const {markers} = this.state
    const markerInx =markers.findIndex (m=>m.title.toLowerCase() === e.target.innerText.toLowerCase())
    here.populateInfoWindo(markers [markerInx],InfoWindow)
      }
    document.querySelector ('.locations-list').addEventListener('click',function(e){
      if(e.target&&e.target.nodeName === "LI"){
        displayInfowindo(e)
      }
    })
}
filteredValue =(e)=>{
  this.setState({query:e.target.value})

}

addMarkerWithTimeout=(position, timeout)=> {
         window.setTimeout(function() {
           const {google,markers,map} = this.props
         markers.push(new google.maps.marker({
           position: position,
           map: map,
           animation: google.maps.Animation.DROP
         }));
       }, timeout);
     }



  addMarkers=()=>{
    const {google} = this.props
    let {InfoWindow} = this.state
    const bounds =new google.maps.LatLngBounds();

    this.state.locations.forEach( (location,inx)=>{
      const marker = new google.maps.Marker({
        position : {lat:location.location.lat,lng:location.location.lng},
        map :this.map,
        title:location.name,
         info :location.address
      });
      marker.addListener('click',()=>{
        this.populateInfoWindo(marker,InfoWindow)
      })
      this.setState((state) =>({
        markers:[...state.markers, marker]
      }))
      bounds.extend(marker.position)
    })
    this.map.fitBounds(bounds)
  }
  populateInfoWindo=(marker,InfoWindow)=>{
    const Icon = marker.getIcon()
    const {markers,Animation}=this.state
    if(InfoWindow.marker !== marker){
      if(InfoWindow.marker){
      const inx= markers.findIndex (m=>m.title === InfoWindow.marker.title)
      markers[inx].setIcon(Icon)
      }
      marker.setIcon(Animation)
      InfoWindow.marker =marker;
      InfoWindow.setContent(`<h3>${marker.title}</h3><h4>${marker.info}</h4>`);

      InfoWindow.open(this.map,marker);
      InfoWindow.addListener('closeclick',function(){
        InfoWindow.marker=null;
      });
    }
  }

  render() {
    const {markers}=this.state
    const{locations,InfoWindow,query}=this.state
    if(query) {
      locations.forEach((m,i)=>{
        if(m.name.toLowerCase().includes(query.toLowerCase())){
          markers[i].setVisible(true)
        }else {
          if(InfoWindow.marker===markers[i]){
            InfoWindow.close()
          }
          markers[i].setVisible(false)
        }
      })

    }

    return (
      <div>
      {this.state.error ? (
         <div className="error">
           An error has occurred; please try later
           <div className="error-description">{this.state.error}</div>
         </div>):
      ( <div className="container  left">
       <div className=" text-input">
            <input role="search"
            value={this.state.value}
             onChange={this.filteredValue}
             type="text"
             id="mySearch"

             placeholder=""
             title="Type in a category"/>
        <ul    className="locations-list">{
         markers.filter(m=>m.getVisible()).map((m,i)=>
       (<a><li   key={i}>{m.title}</li></a>))
     }</ul>
       </div>
         <div role="application" className="map   right" ref="map">
         Loading....
         {this.state.error && <div className="error">{this.state.error}</div>}



         </div>
         </div>)}
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyARC-a63vxOWRRAgpjnDYOndn_2fFLYhAo")
})(MapContainer)
