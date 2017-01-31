import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/index';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    getAll() {
        return this.http.get('/api/user/list', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getByEmail(email: string) {
        return this.http.get('/api/user/getByEmail/' + email, this.jwt()).map((response: Response) => response.json());
    }

    sendMailList(email: string) {
        let bodyString = JSON.stringify({ "email": email });
        return this.http.post('/api/user/sendMailList', bodyString, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post('/api/authenticate/create', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentTennisTiderUser'));
        console.log(currentUser);
        if (currentUser && currentUser.token) {
            // let headers = new Headers({ 'Authorization': currentUser.token, 'Content-Type': 'application/json' });
            let headers = new Headers({ 'Authorization': '', 'Content-Type': 'application/json' });
            return new RequestOptions({ headers: headers });
        }
    }
}