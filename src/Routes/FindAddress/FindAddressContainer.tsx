import React from 'react';
import ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router-dom';
import { geoCode, reverseGeoCode } from '../../mapHelpers';
import FindAddressPresenter from './FindAddressPresenter';

interface IState {
  lat: number;
  lng: number;
  address: any;
}

interface IProps extends RouteComponentProps<any>{
  google: any
}

class FindAddressContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map;
  public state = {
    address: "",
    lat: 0,
    lng: 0
  };
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  public componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSucces,
      this.handleGeoError
    );
  }
  public render() {
    const { address } = this.state;
    return (
      <FindAddressPresenter
        mapRef={this.mapRef}
        address={address}
        onInputChange={this.onInputChange}
        onInputBlur={this.onInputBlur}
        onPickPlace={this.onPickPlace}
      />
    );
  }

  public handleGeoSucces = (positon: Position) => {
    const {
      coords: { latitude, longitude }
    } = positon;
    this.setState({
      lat: latitude,
      lng: longitude
    });
    this.loadMap(latitude, longitude);
    this.reverseGeocodeAddress(latitude, longitude);
  };

  public handleGeoError = () => {
    console.log("No location");
  };

  public loadMap = (lat, lng) => {
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat: 37.494730,
        lng: 126.887570
      },
      disableDefaultUI: true,
      minZoom: 8,
      zoom: 14
    };

    this.map = new maps.Map(mapNode, mapConfig);
    this.map.addListener("dragend", this.handleDragEnd);
  };

  public handleDragEnd =  () => {
    const newCenter = this.map.getCenter();
    const lat = newCenter.lat();
    const lng = newCenter.lng();
    this.setState({
      lat,
      lng
    });
    this.reverseGeocodeAddress(lat, lng);
  };

  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };

  public onInputBlur = async () => { // input창 밖으로 나가면 입력완료
    const { address } = this.state;
    const result: any = await geoCode(address);
    if(result !== false){
      const { lat, lng, formatted_address: formatedAddress } = result;
      this.setState({
        address: formatedAddress,
        lat,
        lng
      })
      this.map.panTo({lat, lng}); // 핀의 위치를 해당 좌표로 이동
    }
  };

  public reverseGeocodeAddress = async (lat: number, lng: number) => {
    const reversedAddress: any = await reverseGeoCode(lat, lng);
    if(reversedAddress !== false){
      this.setState({
        address: reversedAddress
      })
    }
  }

  public onPickPlace = () => {
    const { address, lat, lng } = this.state;
    this.props.history.push({
      pathname: "/add-place",
      state: {
        address,
        lat,
        lng
      }
    })
    console.log(address, lat, lng);
  }
}

export default FindAddressContainer;