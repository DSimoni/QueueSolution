import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../_services/booking.service';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { AlertService } from '../_services';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-booking',
  templateUrl: './booking-map.component.html',
  styleUrls: ['./booking-map.component.css'],
  encapsulation: ViewEncapsulation.None

})

export class BookingMapComponent implements OnInit {

  branchservice: string = '';
  keyword = 'name';
  openMap: boolean = false;
  branches: any = [];
  markers: any[] = [];
  nearestBranch: any = {latitude:0,longitude:0, name:''};


  constructor(private route: ActivatedRoute,
    private router: Router,
    private apiService: BookService,
    private alertService: AlertService,
    private cookieService: CookieService) { }

  ngOnInit(): void {
    this.branchservice = this.route.snapshot.params['service'];
    
    let latitudeArray: number[] = [];
    let longtitudeArray: number[]  = [];

    this.apiService.getBranches().subscribe((branches?: any) => {
      this.branches = branches;


      this.branches.forEach((branch: any) => {


        const marker: any = {
          name: branch.name,
          position: { lat: +branch.latitude, lng: +branch.longitude }, title: branch.name,
          options: {
            draggable: false,
          }
        };


        this.markers.push(marker);

        latitudeArray.push(+branch.latitude);
        longtitudeArray.push(+branch.longitude);

        


      });

      if (this.markers.length > 0) {
        const bounds = this.getBounds(this.markers);
        this.map.googleMap?.fitBounds(bounds);
      }


      navigator.geolocation.getCurrentPosition(position => {  
        const { latitude, longitude } = position.coords;

        const latNear = latitudeArray.reduce((prev, curr) => Math.abs(curr - latitude) < Math.abs(prev - latitude) ? curr : prev);
        const longtNear = longtitudeArray.reduce((prev, curr) => Math.abs(curr - longitude) < Math.abs(prev - longitude) ? curr : prev);

        
        this.nearestBranch.latitude = latNear;
        this.nearestBranch.longitude = longtNear;
        
        this.branchNearUStBranch();
      });
    })




  }



  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow?: MapInfoWindow;



  selectEvent(branch: any) {

    this.markers = [];

    const marker: any = {
      name: branch.name,
      position: { lat: +branch.latitude, lng: +branch.longitude }, title: branch.name,
      options: {
        draggable: false,
      }
    };

    this.markers.push(marker);


    const bounds = this.getBounds(this.markers);

    this.map.googleMap?.setZoom(Math.max(15, this.map.googleMap?.getZoom()));
    this.map.googleMap?.fitBounds(bounds);
  }

  onFocused(item: any) {
    // do something with selected item
  }

  onChangeSearch(txtSearched: string) {
  }


  public openInfoWindow(marker: MapMarker, infoWindow: MapInfoWindow) {
    infoWindow.open(marker);
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

  createBook(branchname: string) {

    if(this.cookieService.check('branchname')) {

      this.alertService.error("You can't book more than 1 ticket in branch " + branchname, null);
    }
    else {
    const numberbooked: number = this.getRandomIntInclusive();

    this.cookieService.set('branchname', branchname);
    this.cookieService.set('branchservice', this.branchservice);
    this.cookieService.set('numberbooked', numberbooked + '');

    this.alertService.success("Thanks for appointment,of service '" + this.branchservice + "' wait for number " + numberbooked + " in branch name: '" + branchname + "'.", null);
    }
  }

  getRandomIntInclusive(): number {
    let min: number = Math.ceil(0);
    let max: number = Math.floor(1000);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }

  d(point: any) {
    return Math.pow(point.x, 2) + Math.pow(point.y, 2);
  }

  branchNearUStBranch(): string
  {

    this.markers.forEach((marker) =>
    {
      if(+marker.position.lat == +this.nearestBranch.latitude)
      {
        this.nearestBranch.name = marker.name;
        return marker.name;
      }
    });
    return '';

  }
}
