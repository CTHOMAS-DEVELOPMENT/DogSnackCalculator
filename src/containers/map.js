import React from 'react'
import { API_KEY, MAP_STYLES, MAP_ZOOM, MAP_INITIAL_CENTER, MAX_WALK_LENGTH } from "../utils/constants"
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
const MapContainer = props => {  
    /**
     * displayMarkers:
     *  Uses the passed in props.walks array to put all the points of the selected walk.
     *  Adds a tooltip to each marker to provide additional information about the marker/walk point
     */
    const displayMarkers = () => {
        return props.walks.map((store, index) => {
            const toolTip = `${ props.walkName } \nPosition: ${index+1}.\nAltitude: ${store.altitude} meters.`
            return <Marker key={index} id={index}
                title={ toolTip }
                position={{
                    lat: store.latitude,
                    lng: store.longitude,
                }} 
            />
        })
    }
    if(props.walks.length>0)
    {
        if(props.walks.length <= MAX_WALK_LENGTH)
        {
            return (
                <Map
                    google={ props.google }
                    zoom={ MAP_ZOOM }
                    style={ MAP_STYLES }
                    initialCenter={MAP_INITIAL_CENTER}
                >
                    { displayMarkers() }
                </Map>
            )
        }
        else
        {
            return  <ul className="choicebuttons">
                        <li><a href="#" className={'active'}>{ `${props.walkName} is too long. It exceeds the maximum number of points allowed (${ MAX_WALK_LENGTH } points)` }</a></li>
                    </ul>
        }
    }
    else
    {
        return (
            <ul className="choicebuttons">
                <li><a href="#" className={'active'}>{ `Waiting for data` }</a></li>
            </ul>
        )
    }
}
export default GoogleApiWrapper({
    apiKey: API_KEY
})(MapContainer);
  
  