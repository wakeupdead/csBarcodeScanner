import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
import { Geolocation } from 'ionic-native';

import * as moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  barcodes:any = [];
  id:number = 0;

  positionWatch:any;
  lat:any;
  lon:any;
  timestamp:any;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {
    this.positionWatch = Geolocation.watchPosition();
    this.positionWatch.subscribe((data) => {
    // data can be a set of coordinates, or an error (if an error occurred).
      this.lat = data.coords.latitude;
      this.lon = data.coords.longitude;
      this.timestamp = moment(data.timestamp);
    });
    
  }

  scan():void {
    BarcodeScanner.scan().then((barcodeData) => {
      // Success! Barcode data is here
      if (!barcodeData.cancelled) {
        this.id = this.id++;
        this.barcodes.push({
            id: this.id,
            text: barcodeData.text,
            lat: this.lat,
            lon: this.lon
          })
      } else {
        this.presentAlert('Scan cancelled');
      }
      
    }, (err) => {
        // An error occurred
        this.presentAlert('Error scanning barcode');
    });
  }

  delete(item):void {
    this.barcodes.splice(this.barcodes.indexOf(item),1);
  }

  presentAlert(text:string) {
  let alert = this.alertCtrl.create({
    title: 'Alert',
    subTitle: text,
    buttons: ['Ok']
  });
  alert.present();
}

}
