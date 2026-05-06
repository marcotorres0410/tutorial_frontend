import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../model/Game';
import {MatCardModule} from '@angular/material/card';

@Component({
    selector: 'app-game-item',
    standalone: true,
    imports: [MatCardModule],
    templateUrl: './game-item.html',
    styleUrl: './game-item.scss'
})
export class GameItem {
    @Input() game: Game;
}