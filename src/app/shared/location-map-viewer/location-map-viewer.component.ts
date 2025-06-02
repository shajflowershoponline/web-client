import { Component, EventEmitter, Input, Output, AfterViewInit, OnInit, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { GeoLocationService } from 'src/app/services/geo-location.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  standalone: true,
  selector: 'app-location-map-viewer',
  templateUrl: './location-map-viewer.component.html',
  styleUrls: ['./location-map-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LocationMapViewerComponent implements OnInit, AfterViewInit {
  readonly mapId: string = 'map-' + uuidv4(); // ✅ Unique map ID using UUID
  private map!: L.Map;
  private marker!: L.Marker;

  currentCoords: { lat: number; lng: number } = { lat: 0, lng: 0 };
  @Input() selectedCoords: { lat: number; lng: number } = { lat: 0, lng: 0 };
  @Output() onMarkerChange = new EventEmitter<{ lat: number; lng: number }>();

  @Input() readOnly = true;
  constructor(
    private http: HttpClient,
    private readonly geoLocationService: GeoLocationService
  ) { }

  async ngOnInit(): Promise<void> {
    this.geoLocationService.data$.subscribe((pos: GeolocationPosition) => {
      if (pos?.coords) {
        const { latitude, longitude } = pos.coords;
        this.currentCoords = { lat: latitude, lng: longitude };
        if (!this.selectedCoords) {
          this.selectedCoords = this.currentCoords;
        }
        this.initMap();
      }
    });
  }

  ngAfterViewInit(): void {
    // Handle resize glitch if inside dialog/tab
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 100);
  }

  initMap(): void {
    if (!this.map) {
      this.map = L.map(this.mapId).setView([this.selectedCoords.lat, this.selectedCoords.lng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      if (!this.readOnly) {
        this.addLocationButton();
      }

    }

    if (!this.marker) {
      this.marker = L.marker([this.selectedCoords.lat, this.selectedCoords.lng], {
        draggable: !this.readOnly,
      }).addTo(this.map);

      this.marker.on('dragend', () => {
        const { lat, lng } = this.marker.getLatLng();
        this.selectedCoords = { lat, lng };
        this.onMarkerChange.emit(this.selectedCoords);
      });
    } else {
      this.marker.setLatLng([this.selectedCoords.lat, this.selectedCoords.lng]);
    }

    this.map.setView([this.selectedCoords.lat, this.selectedCoords.lng], 15);
  }

  addLocationButton() {
    const locateControl = new L.Control({ position: 'topleft' });

    locateControl.onAdd = () => {
      const div = L.DomUtil.create(
        'div',
        'leaflet-bar leaflet-control leaflet-control-custom'
      );
      div.innerHTML =
        '<i class="fa fa-crosshairs" style="padding:8px; cursor:pointer;"></i>';

      L.DomEvent.on(div, 'click', async () => {
        this.geoLocationService.data$.subscribe({
          next: (position: GeolocationPosition) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Make sure map is correctly resized and focused
            this.map.invalidateSize();
            this.map.flyTo([lat, lng], 15, { animate: true });

            if (this.marker) {
              this.marker.setLatLng([lat, lng]);
            } else {
              this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
            }

            this.onMarkerChange.emit(this.selectedCoords);
          },
          error: (err) => {
            alert('Unable to retrieve your location');
            console.error(err);
          },
        });
      });

      return div;
    };

    locateControl.addTo(this.map);
  }

  updateMapPin(lat: number, lng: number) {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    }
    if (this.map) {
      this.map.flyTo([lat, lng], 15);
    }
    this.selectedCoords = { lat, lng };
  }
}
