import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User, Club } from '../_models/index';

@Injectable()
export class ClubService {
    constructor(private http: Http) { }

    getAll() {
        return this.http.get('/api/club/list', this.jwt()).map((response: Response) => response.json());
    }

    getAllWithUserInfo(email: string) {
        return this.http.get('/api/club/withUserInfo/' + email, this.jwt()).map((response: Response) => {
            return response.json();
        });
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentTennisTiderUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': currentUser.token, 'Content-Type': 'application/json' });
            return new RequestOptions({ headers: headers });
        }
    }
}