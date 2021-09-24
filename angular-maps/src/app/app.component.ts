import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { BookingFormComponent } from './booking-form/booking-form.component'
import { RestService } from './rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class AppComponent {

  apiService: RestService;
  keyword = 'name';
  openMap: boolean = false;
  branches: any = [];
  markers: any[] = [];

  constructor(restApiTest: RestService) {
    this.apiService = restApiTest;
  }



  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow?: MapInfoWindow;



  selectEvent(branch: any) {

    this.markers = [];

    const marker: any = {
      name: branch.name,
      position: { lat: +branch.latitude, lng: +branch.longitude }, title: 'Your Branch',
      options: {
        draggable: false,
        icon: 'assets/img/icon_raiffeisen.png'
      }
    };

    this.markers.push(marker);


    const bounds = this.getBounds(this.markers);

    this.map.googleMap?.fitBounds(bounds);
    this.map.googleMap?.setOptions({ minZoom: 2, maxZoom: 50 });

    // const streetView = this.map.getStreetView();

    // streetView.setOptions({
    //   position: { lat: +branch.latitude, lng: +branch.longitude },
    //    pov: { heading: 70, pitch: -10 },
    // });
 
    // streetView.setVisible(true);


  }

  onFocused(item: any) {
    // do something with selected item
  }

  onChangeSearch(txtSearched: string) {
  }


  public openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
  }

  ngAfterViewInit() {
    this.apiService.getBranches().subscribe((branches?: any) => {
      this.branches = branches;


      this.branches.forEach((branch: any) => {
        // console.log(branch.latitude);
        // console.log(branch.longitude);
        const marker: any = {
          name: branch.name,
          position: { lat: +branch.latitude, lng: +branch.longitude }, title: 'My Title',
          options: {
            draggable: false,
          }
        };
  
  
            this.markers.push(marker);
      });
  
      if (this.markers.length > 0) {
        const bounds = this.getBounds(this.markers);
        this.map.googleMap?.fitBounds(bounds);
      }
    })

     
  }

  getBounds(markers: any) {
    let north;
    let south;
    let east;
    let west;

    for (const marker of markers) {
      // set the coordinates to marker's lat and lng on the first run.
      // if the coordinates exist, get max or min depends on the coordinates.
      north = north !== undefined ? Math.max(north, marker.position.lat) : marker.position.lat;
      south = south !== undefined ? Math.min(south, marker.position.lat) : marker.position.lat;
      east = east !== undefined ? Math.max(east, marker.position.lng) : marker.position.lng;
      west = west !== undefined ? Math.min(west, marker.position.lng) : marker.position.lng;

    };

    const bounds = { north, south, east, west };

    return bounds;
  }



}

