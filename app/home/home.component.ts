import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../_models/index';
import { UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    loading = false;

    constructor(private router: Router, private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentTennisTiderUser'));
        this.userService.getByEmail(this.currentUser.email)
            .subscribe((user: any) => {
                if (user.success === false) {
                    this.router.navigateByUrl('/logga-in');
                }
            });
    }

    //sendMailList

    ngOnInit() {
        this.loadAllUsers();
    }

    sendMail() {
        this.loading = true;
        this.userService.sendMailList(this.currentUser.email)
            .subscribe((user: any) => {
                this.loading = false;
            });
    }

    private loadAllUsers() {
    }
}