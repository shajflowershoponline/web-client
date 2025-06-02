import { Component, OnInit, AfterViewInit, Inject, Input, Output, ViewChild, EventEmitter, ViewEncapsulation, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocationMapViewerComponent } from '../location-map-viewer/location-map-viewer.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { SystemConfigService } from 'src/app/services/system-config.service';
import { GeoLocationService } from 'src/app/services/geo-location.service';
@Component({
  standalone: true,
  imports: [LocationMapViewerComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,],
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrl: './location-picker.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LocationPickerComponent implements OnInit {
  @ViewChild('locationPickerModal') modalElement!: ElementRef;
  searchLocation = '';
  locationOptions: any[] = [];

  private searchSubject = new Subject<string>();
  selectedCoords = { lat: 0, lng: 0 };

  modalRef: any;
  // Existing code...
  @ViewChild('locationMapViewer') locationMapViewer!: LocationMapViewerComponent;

  @Output() onLocationSelected = new EventEmitter<{ selectedCoords: { lat: number, lng: number }; address: string; }>();
  constructor(
    private http: HttpClient,
    private systemConfigService: SystemConfigService,
    private geoLocationService: GeoLocationService,
  ) {
}

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      switchMap(text => this.geocodeAddress(text))
    ).subscribe(results => this.locationOptions = results);
  }

  show() {
    if (this.modalElement) {
      this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement, {
        backdrop: 'static', // optional: prevents closing by clicking outside
        keyboard: false, // optional: disables escape key
      });
      this.modalRef.show();
    }
  }

  onSearchChange(value: any) {
    // console.log(value);
    if (value && value !== '') {
      this.searchSubject.next(value);
    } else {
      this.locationOptions = []; // Hide dropdown
      this.selectedCoords = null;
    }
  }

  onAddressSelected(option: { lat: number; lng: number; label: string }) {
    if (option) {
      this.searchLocation = option.label;
      this.locationOptions = []; // Hide dropdown
      this.selectedCoords = { lat: option.lat, lng: option.lng };
      this.locationMapViewer.updateMapPin(option.lat, option.lng);
    }

    // Update the map viewer's marker
  }

 geocodeAddress(query: string) {
  return this.geoLocationService.geocodeAddress(query).pipe(
    map((response: any) => (response.data || []).map((item: any) => ({
      label: item.address,
      lat: item.coordinates.lat,
      lng: item.coordinates.lng
    }))),
    catchError(error => {
      console.error('Geocode error:', error);
      return of([]); // fallback to empty array
    })
  );
}


  reverseGeocode(lat: number, lng: number) {
    const apiKey = environment.openRouteServiceAPIKey;
    return this.http.get<any>(`https://api.openrouteservice.org/geocode/reverse?api_key=${apiKey}&point.lat=${lat}&point.lon=${lng}`)
      .pipe(
        switchMap(response => {
          const label = response?.features?.[0]?.properties?.label || '';
          return [label];
        })
      );
  }

  onMarkerChanged(coords: { lat: number; lng: number }) {
    this.selectedCoords = coords;
    this.locationMapViewer.updateMapPin(coords.lat, coords.lng); // <- center with animation

    this.reverseGeocode(coords.lat, coords.lng).subscribe((label) => {
      this.searchLocation = label;
    });
  }


  onConfirm() {
    this.modalRef.hide();
    this.onLocationSelected.emit({
      selectedCoords: this.selectedCoords,
      address: this.searchLocation,
    });

    this.searchLocation = null;
    this.locationMapViewer.updateMapPin(this.locationMapViewer.currentCoords.lat, this.locationMapViewer.currentCoords.lng);
  }

  onCancel() {
    this.modalRef.hide();
  }
}
