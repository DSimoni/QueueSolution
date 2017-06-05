﻿import { Injectable, NgZone }   from "@angular/core";
import { Observer }             from "rxjs/Observer";
import { Observable }           from "rxjs/Observable";
import { ILatLong }             from "../../interfaces/ilatlong";
import { IMarkerOptions }       from "../../interfaces/imarkeroptions";
import { IPoint }               from "../../interfaces/ipoint";
import { MapMarker }            from "../../components/mapmarker";
import { Marker }               from "../../models/marker";
import { MarkerService }        from "../markerservice";
import { MapService }           from "../mapservice";
import { LayerService }         from "../layerservice";
import { ClusterService }       from "../clusterservice";
import { BingMapService }       from "./bingmapservice";
import { BingConversions }      from "./bingconversions";

/**
 * Concrete implementation of the MarkerService abstract class for Bing Maps V8. 
 * 
 * @export
 * @class BingMarkerService
 * @implements {MarkerService}
 */
@Injectable()
export class BingMarkerService implements MarkerService {

    ///
    /// Field declarations
    ///
    private _markers: Map<MapMarker, Promise<Marker>> = new Map<MapMarker, Promise<Marker>>();

    ///
    /// Constructor
    ///

    /**
     * Creates an instance of BingMarkerService.
     * @param {MapService} _mapService - {@link MapService} instance. The concrete {@link BingMapService} implementation is expected. 
     * @param {LayerService} _layerService - {@link LayerService} instance. The concrete {@link BingLayerService} implementation is expected. 
     * @param {ClusterService} _clusterService - {@link ClusterService} instance. The concrete {@link BingClusterService} implementation is expected. 
     * @param {NgZone} _zone - NgZone instance to support zone aware promises.
     * 
     * @memberof BingMarkerService
     */
    constructor(private _mapService: MapService, private _layerService: LayerService, private _clusterService: ClusterService, private _zone: NgZone) { }

    ///
    /// Public members and MarkerService implementation
    ///

    /**
     * Adds a marker. Depending on the marker context, the marker will either by added to the map or a correcsponding layer. 
     * 
     * @param {MapMarker} marker - The {@link MapMarker} to be added.
     * 
     * @memberof BingMarkerService
     */
    public AddMarker(marker: MapMarker): void {
        let o: IMarkerOptions = {
            position: { latitude: marker.Latitude, longitude: marker.Longitude },
            title: marker.Title,
            label: marker.Label,
            draggable: marker.Draggable,
            icon: marker.IconUrl,
            iconInfo: marker.IconInfo,
            isFirst: marker.IsFirstInSet,
            isLast: marker.IsLastInSet
        };
        if (marker.Width) o.width = marker.Width;
        if (marker.Height) o.height = marker.Height;
        if (marker.Anchor) o.anchor = marker.Anchor;
        if (marker.Metadata) o.metadata = marker.Metadata;

        // create marker via promise.
        let markerPromise: Promise<Marker> = null;
        if(marker.InClusterLayer)  markerPromise = this._clusterService.CreateMarker(marker.LayerId, o);
        else if(marker.InCustomLayer) markerPromise = this._layerService.CreateMarker(marker.LayerId, o);
        else markerPromise = this._mapService.CreateMarker(o);

        this._markers.set(marker, markerPromise);
        if (marker.IconInfo) markerPromise.then((m: Marker) => {
            // update iconInfo to provide hook to do post icon creation activities and
            // also re-anchor the marker 
            marker.DynamicMarkerCreated.emit(o.iconInfo);
            let p: IPoint = {
                x: (o.iconInfo.size && o.iconInfo.markerOffsetRatio) ? (o.iconInfo.size.width * o.iconInfo.markerOffsetRatio.x) : 0,
                y: (o.iconInfo.size && o.iconInfo.markerOffsetRatio) ? (o.iconInfo.size.height * o.iconInfo.markerOffsetRatio.y) : 0,
            }
            m.SetAnchor(p);
        });
    }

    /**
     * Registers an event delegate for a marker. 
     * 
     * @template T - Type of the event to emit. 
     * @param {string} eventName - The name of the event to register (e.g. "click")
     * @param {MapMarker} marker - The {@link MapMarker} for which to register the event. 
     * @returns {Observable<T>} - Observable emiting an instance of T each time the event occurs. 
     * 
     * @memberof BingMarkerService
     */
    public CreateEventObservable<T>(eventName: string, marker: MapMarker): Observable<T> {
        return Observable.create((observer: Observer<T>) => {
            this._markers.get(marker).then((m: Marker) => {
                m.AddListener(eventName, (e: T) => this._zone.run(() => observer.next(e)));
            });
        });
    }

    /**
     * Deletes a marker. 
     * 
     * @param {MapMarker} marker - {@link MapMarker} to be deleted.
     * @returns {Promise<void>} - A promise fullfilled once the marker has been deleted. 
     * 
     * @memberof BingMarkerService
     */
    public DeleteMarker(marker: MapMarker): Promise<void> {
        const m = this._markers.get(marker);
        if (m == null) {
            return Promise.resolve();
        }
        return m.then((m: Marker) => {
            return this._zone.run(() => {
                m.DeleteMarker();
                this._markers.delete(marker);
            });
        });
    }

    /**
     * Obtains geo coordinates for the marker on the click location 
     * 
     * @param {(MouseEvent| any)} e - The mouse event. 
     * @returns {ILatLong} - {@link ILatLong} containing the geo coordinates of the clicked marker. 
     * 
     * @memberof BingMarkerService
     */
    public GetCoordinatesFromClick(e: MouseEvent| any): ILatLong {
        if (!e) return null;
        if (!e.primitive) return null;
        if (!(e.primitive instanceof Microsoft.Maps.Pushpin)) return null;
        let p: Microsoft.Maps.Pushpin = e.primitive;
        let loc: Microsoft.Maps.Location = p.getLocation();
        return { latitude: loc.latitude, longitude: loc.longitude };
    }

    /**
     * Obtains the marker model for the marker allowing access to native implementation functionatiliy.  
     * 
     * @param {MapMarker} marker - The {@link MapMarker} for which to obtain the marker model. 
     * @returns {Promise<Marker>} - A promise that when fullfilled contains the {@link Marker} implementation of the underlying platform. 
     * 
     * @memberof BingMarkerService
     */
    public GetNativeMarker(marker: MapMarker): Promise<Marker> {
        return this._markers.get(marker);
    }

    /**
     * Obtains the marker pixel location for the marker on the click location 
     * 
     * @param {(MouseEvent| any)} e - The mouse event. 
     * @returns {IPoint} - {@link ILatLong} containing the pixels of the marker on the map canvas.
     * 
     * @memberof BingMarkerService
     */
    public GetPixelsFromClick(e: MouseEvent| any): IPoint {
        let loc: ILatLong = this.GetCoordinatesFromClick(e);
        if (loc == null) return null;
        let l: Microsoft.Maps.Location = BingConversions.TranslateLocation(loc);
        let p: Microsoft.Maps.Point = <Microsoft.Maps.Point>(<BingMapService>this._mapService).MapInstance.tryLocationToPixel(l, Microsoft.Maps.PixelReference.control);
        if (p == null) return null;
        return { x: p.x, y: p.y };
    }

    /**
     * Converts a geo location to a pixel location relative to the map canvas.
     * 
     * @param {(MapMarker | ILatLong)} target - Either a {@link MapMarker} or a {@link ILatLong} for the basis of translation. 
     * @returns {Promise<IPoint>} - A promise that when fullfilled contains a {@link IPoint} with the pixel coordinates of the MapMarker or ILatLong relative to the map canvas.
     * 
     * @memberof BingMarkerService
     */
    public LocationToPoint(target: MapMarker | ILatLong): Promise<IPoint> {
        if(target == null) return Promise.resolve(null);
        if(target instanceof MapMarker) {
            return this._markers.get(target).then((m: Marker) => {
                let l: ILatLong = m.Location;
                let p: Promise<IPoint> = this._mapService.LocationToPoint(l);
                return p;
            });
        }
        return this._mapService.LocationToPoint(target);
    }

    /**
     * Updates the anchor position for the marker. 
     * 
     * @param {MapMarker} - The {@link MapMarker} object for which to upate the anchor. Anchor information is present in the underlying {@link Marker} model object. 
     * @returns {Promise<void>} - A promise that is fullfilled when the anchor position has been updated. 
     * 
     * @memberof BingMarkerService
     */
    public UpdateAnchor(marker: MapMarker): Promise<void> {
        return this._markers.get(marker).then((m: Marker) => {
            m.SetAnchor(marker.Anchor);
        });
    }

    /**
     * Updates whether the marker is draggable. 
     * 
     * @param {MapMarker} - The {@link MapMarker} object for which to upate dragability. Dragability information is present in the underlying {@link Marker} model object. 
     * @returns {Promise<void>} - A promise that is fullfilled when the marker has been updated. 
     * 
     * @memberof BingMarkerService
     */
    public UpdateDraggable(marker: MapMarker): Promise<void> {
        return this._markers.get(marker).then((m: Marker) => m.SetDraggable(marker.Draggable));
    }

    /**
     * Updates the Icon on the marker.
     * 
     * @param {MapMarker} - The {@link MapMarker} object for which to upate the icon. Icon information is present in the underlying {@link Marker} model object. 
     * @returns {Promise<void>} - A promise that is fullfilled when the icon information has been updated. 
     * 
     * @memberof BingMarkerService
     */
    public UpdateIcon(marker: MapMarker): Promise<void> {
        return this._markers.get(marker).then((m: Marker) => {
            if (marker.IconInfo) {
                let x: IMarkerOptions = {
                    position: { latitude: marker.Latitude, longitude: marker.Longitude },
                    iconInfo: marker.IconInfo
                }
                let o: Microsoft.Maps.IPushpinOptions = BingConversions.TranslateMarkerOptions(x);
                m.SetIcon(o.icon);
                marker.DynamicMarkerCreated.emit(x.iconInfo);
            }
            else {
                m.SetIcon(marker.IconUrl)
            }

        });
    }

    /**
     * Updates the label on the marker. 
     * 
     * @param {MapMarker} - The {@link MapMarker} object for which to upate the label. Label information is present in the underlying {@link Marker} model object. 
     * @returns {Promise<void>} - A promise that is fullfilled when the label has been updated. 
     * 
     * @memberof BingMarkerService
     */
    public UpdateLabel(marker: MapMarker): Promise<void> {
        return this._markers.get(marker).then((m: Marker) => { m.SetLabel(marker.Label); });
    }

    /**
     * Updates the geo coordinates for the marker. 
     * 
     * @param {MapMarker} - The {@link MapMarker} object for which to upate the coordinates. Coordinate information is present in the underlying {@link Marker} model object. 
     * @returns {Promise<void>} - A promise that is fullfilled when the position has been updated. 
     * 
     * @memberof BingMarkerService
     */
    public UpdateMarkerPosition(marker: MapMarker): Promise<void> {
        return this._markers.get(marker).then(
            (m: Marker) => m.SetPosition({
                latitude: marker.Latitude,
                longitude: marker.Longitude
            }));
    }

    /**
     * Updates the title on the marker. 
     * 
     * @param {MapMarker} - The {@link MapMarker} object for which to upate the title. Title information is present in the underlying {@link Marker} model object. 
     * @returns {Promise<void>} - A promise that is fullfilled when the title has been updated. 
     * 
     * @memberof BingMarkerService
     */
    public UpdateTitle(marker: MapMarker): Promise<void> {
        return this._markers.get(marker).then((m: Marker) => m.SetTitle(marker.Title));
    }
}