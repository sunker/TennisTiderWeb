import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }

    login(email: string, password: string) {
        let bodyString = JSON.stringify({ "email": email, "password": password });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('/api/authenticate', bodyString, options)
            .map((response: Response) => {
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentTennisTiderUser', JSON.stringify(user));
                }
                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentTennisTiderUser');
    }
}