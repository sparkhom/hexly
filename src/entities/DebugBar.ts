import {Game} from '../game';
import {Entity} from './entity';
export class DebugBar extends Entity {
    private rightText: string;
    private leftText: string;
    private hidden: boolean;

    constructor(ctx: CanvasRenderingContext2D, game: Game) {
        super(ctx, game);
    }
    public update() {
        this.rightText = '';
        this.game.timeToDraw = (this.game.timeToDraw * 0.9999) + ((Date.now() - this.game.startDraw) * 0.0001);
        var fpsCount: number = Math.floor(1000 / this.game.timeToDraw);
        this.rightText += 'Current FPS: ' + fpsCount;

        this.leftText = 'Hexly (dev) | ';
        this.leftText += 'current state: ' + this.game.state.toString() + ' ';
        if (this.game.currentCell) 
            this.leftText += 'current cell at (' + this.game.currentCell.q + ',' + this.game.currentCell.r + '): ' + this.game.currentCell.toString() + ' ';
        if (this.game.showCoordsText)
            this.leftText += 'show-coords ';
    }

    public draw() {
        if (this.hidden)
            return;
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = '#eee';
        this.ctx.fillRect(0, this.game.globalHeight - 20, this.game.globalWidth, this.game.globalHeight);
        this.ctx.font = '0.5em Arial';
        this.ctx.strokeText(this.leftText, 10, this.game.globalHeight - 7);
        var metrics = this.ctx.measureText(this.rightText);
        this.ctx.strokeText(this.rightText, this.game.globalWidth - metrics.width - 10, this.game.globalHeight - 7);
    }

    public keyDown(ev) {
        if (ev.keyCode == 68)
            this.hidden = !this.hidden;
    }
}
