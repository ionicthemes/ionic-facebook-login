import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
declare var FB: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  FB_APP_ID: number = 2392489640796829;

  constructor(
    private fb: Facebook,
    private nativeStorage: NativeStorage,
    public loadingController: LoadingController,
    private router: Router,
    private platform: Platform,
    public alertController: AlertController
  ) { }

  async doFbLogin(){
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    if (this.platform.is('cordova')) {
      // make your native API calls
      //the permissions your facebook app needs from the user
      const permissions = ["public_profile", "email"];

      this.fb.login(permissions)
      .then(response => {
        let userId = response.authResponse.userID;
        //Getting name and email properties
        //Learn more about permissions in https://developers.facebook.com/docs/facebook-login/permissions
        this.fb.api("/me?fields=name,email", permissions)
        .then(user => {
          user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
          //now we have the users info, let's save it in the NativeStorage
          this.nativeStorage.setItem('facebook_user',
          {
            name: user.name,
            email: user.email,
            picture: user.picture
          })
          .then(() => {
            this.router.navigate(["/user"]);
            loading.dismiss();
          }, error => {
            console.log(error);
            loading.dismiss();
          })
        })
      }, error =>{
        console.log(error);
        if(!this.platform.is('cordova')){
          this.presentAlert();
        }
        loading.dismiss();
      });
    } else {
      // fallback to browser APIs
      FB.login( response => {
        if (response.authResponse) {
         let userId = response.authResponse.userID;
         console.log('Welcome!  Fetching your information.... ');
         FB.api('/me?fields=name,email', user => {
           user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";

           localStorage.setItem('facebook_user',
             user.name + ";" + user.email +";" + user.picture
           )
           loading.dismiss();
           this.router.navigate(["/user"]);
         });
        } else {
         console.log('User cancelled login or did not fully authorize.');
        }
      });
    }

  }

  async presentAlert() {
    const alert = await this.alertController.create({
       message: 'Cordova is not available on desktop. Please try this in a real device or in an emulator.',
       buttons: ['OK']
     });

    await alert.present();
  }

  async presentLoading(loading) {
    return await loading.present();
  }

}
