import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
// import { clubselector } from './club/index';
import { ClubSelectorComponent } from './clubSelector/index';
import { TimeSelectorComponent } from './timeSelector/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { DefaultTimeSelectorComponent } from './defaultTimeSelector/index';
import { ClubTimeSelectorComponent } from './clubTimeSelector/index';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'valj-klubbar', component: ClubSelectorComponent, canActivate: [AuthGuard] },
    { path: 'valj-tider', component: TimeSelectorComponent, canActivate: [AuthGuard] },
    { path: 'logga-in', component: LoginComponent },
    { path: 'skapa-konto', component: RegisterComponent },
    { path: 'valj-bastid', component: DefaultTimeSelectorComponent },
    { path: 'valj-klubbtider', component: ClubTimeSelectorComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);