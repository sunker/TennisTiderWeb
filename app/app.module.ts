import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService, ClubService, UserSlotPreference, TimePickerSettingsFactory } from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { DefaultTimeSelectorComponent } from './defaultTimeSelector/index';
import { ClubSelectorComponent } from './clubSelector/index';
import { TimeSelectorComponent } from './timeSelector/index';
import { TimeSlotSelectorComponent } from './timeSlotSelector/index';
import { ClubTimeSelectorComponent } from './clubTimeSelector/index';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        ClubSelectorComponent,
        TimeSelectorComponent,
        DefaultTimeSelectorComponent,
        TimeSlotSelectorComponent,
        ClubTimeSelectorComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        ClubService,
        UserSlotPreference,
        TimePickerSettingsFactory,
        // providers used to create fake backend
        //fakeBackendProvider,
        // MockBackend,
        BaseRequestOptions
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }