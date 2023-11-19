import React from 'react';
import Map from './components/map';
import { useLoadScript } from '@react-google-maps/api';
import { StyledEngineProvider } from '@mui/material/styles';

function App() {
  // 
  const {isLoaded} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP_API_KEY || '',
    libraries: ['places']
  })

  if (!isLoaded) return <div>Loading...</div>;


  return(
    <StyledEngineProvider injectFirst>
      <Map />
    </StyledEngineProvider>
  ) 
  ;
}

export default App;
