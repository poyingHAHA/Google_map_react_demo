import React, {useState} from 'react';
import usePlacesAutoComplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { InputBase } from '@mui/material';

type PlacesProps = {
  setOffice: (position: google.maps.LatLngLiteral) => void;
};


export default function Places({ setOffice }: PlacesProps) {
  const [current, setCurrent] = useState<google.maps.LatLngLiteral>({lat: 25.0476133, lng: 121.5174062});
  navigator.geolocation.getCurrentPosition((position) => {
    setCurrent({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    })
  }, (error) => {
    console.log(error);
  });
  // ready is a boolean that tells us if the library is ready to use
  // value is the value of the user input
  // setValue is a function that allows us to set the value of the user input
  // suggestions is an object that contains the status and the data of the suggestions
    // status is a string that tells us the status of the request
    // data is an array of suggestions
  // clearSuggestions is a function that allows us to clear the suggestions
  const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutoComplete({
    requestOptions: {
      locationBias:{
        center: {lat: current.lat, lng: current.lng},
        // center: {lat: 25.0476133, lng: 121.5174062},
        radius: 20 * 1000,
      },
      language: 'zh-TW',
      region: 'tw',
    }
  });

  // console.log({status, data});
  const handleSelect = async (val: string) => {
    // false means we don't want to fetch more data
    setValue(val, false);
    clearSuggestions();

    const result = await getGeocode({address: val});
    const {lat, lng} = await getLatLng(result[0]);

    setOffice({lat, lng});
  };
  
  return <div>
    <div className='w-[100%] p-2' >
      <InputBase 
        placeholder="Search an address"
        value={value}
        className='text-[#fff] border-solid border-[#fff] p-2 rounded-md w-[80%]'
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      {
        status === 'OK' && 
        <div className='w-[100%] bg-[white] text-black flex flex-col rounded-xl mt-4 shadow-lg shadow-cyan-500/50'>
          {data.map(({place_id, description}) => (
            <div className='px-2 py-4 hover:bg-[#efefef]' key={place_id} onClick={() => {handleSelect(description)}} >
              {description}
            </div>
          ))}
        </div>
      }
    </div>
  </div>
}