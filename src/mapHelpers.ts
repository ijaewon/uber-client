import axios from 'axios';
import { toast } from 'react-toastify';
import { MAPS_KEY } from './keys';

export const geoCode = async (address: string) => { // 입력한 주소를 좌표로 변환시킴
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${MAPS_KEY}`;
  const { data } = await axios(URL);
  if (!data.error_message) {
    const { results } = data;
    const firstPlace = results[0];
    const {
      formatted_address,
      geometry: {
        location: { lat, lng }
      }
    } = firstPlace;
    return { formatted_address, lat, lng };
  } else {
    toast.error(data.error_message);
    return false;
  }
};

export const reverseGeoCode = async (lat: number, lng: number) => { // 좌표를 받아 주소로 변환
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_KEY}`;
  const { data } = await axios(URL);
  if (!data.error_message) {
    const { results } = data;
    const firstPlace = results[0];
    if(!firstPlace){
      return false;
    }
    const address = firstPlace.formatted_address;
    return address;
  } else {
    toast.error(data.error_message);
    return false;
  }
};