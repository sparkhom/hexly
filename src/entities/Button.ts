import {Game} from '../game';
import {Entity} from './entity';
export class Button extends Entity {
    public hilight: boolean;
    public disabled: boolean;
    constructor(ctx: CanvasRenderingContext2D, game: Game, public text: string, public x: number, public y: number, public width: number, public height: number, public callback: () => void) {
        super(ctx, game);
    }

    public draw() {
        if (this.hilight)
            this.ctx.fillStyle = '#aaa';
        else
            this.ctx.fillStyle = '#777';

        if (this.disabled) {
            this.ctx.fillStyle = '#ccc';
        }

        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        var metrics = this.ctx.measureText(this.text);
        this.ctx.font = '1.0em Arial';
        this.ctx.fillStyle = '#000';
        this.ctx.fillText(this.text, this.x + ((this.width - metrics.width) / 2), this.y + this.height - 5);
    }

    public mouseMove(ev) {
        if (ev.clientX >= this.x && ev.clientX < this.x + this.width && ev.clientY >= this.y && ev.clientY < this.y + this.height) {
            this.hilight = true;
        } else
            this.hilight = false;
    }

    public mouseUp(ev) {
        if (ev.clientX >= this.x && ev.clientX < this.x + this.width && ev.clientY >= this.y && ev.clientY < this.y + this.height) {
            this.callback();
        }
    }
}
