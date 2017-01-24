﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Club, User } from '../_models/index';
import { ClubService, UserSlotPreference } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'clubSelector.component.html'
})

export class ClubSelectorComponent implements OnInit {
    currentUser: User;
    clubs: Club[] = [];
    loading = false;

    constructor(
        private clubService: ClubService,
        private userSlotPreference: UserSlotPreference,
        private router: Router) {
        this.currentUser = JSON.parse(localStorage.getItem('currentTennisTiderUser'));
    }

    ngOnInit() {
        this.loadAllClubs();
    }

    saveClubs() {
        this.loading = true;
        const clubs = this.clubs.filter(x => x.active);
        if (clubs.length != 0) {
            this.userSlotPreference.saveClubs(this.currentUser.email, clubs)
                .subscribe((data) => {
                    this.router.navigateByUrl('/valj-bastid');
                });
        }
    }

    activeChanged(event: any, club: Club) {
        club.active = !club.active;
    }

    private loadAllClubs() {
        this.clubService.getAllWithUserInfo(this.currentUser.email).subscribe(club => {
            if (club.success === false) {
                this.router.navigateByUrl('/logga-in');
            }
            
            this.clubs = club;
        });
    }
}