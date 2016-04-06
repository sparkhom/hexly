import {Game} from './game';

export function main(): void {
    var canvas = <HTMLCanvasElement> document.getElementById("game");
    var globalWidth: number = window.innerWidth;
    var globalHeight: number = window.innerHeight;
    var ratio: number = 1;
    var game = new Game(canvas, globalWidth, globalHeight, ratio);
}
