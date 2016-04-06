import {Game} from '../game';
import {Entity} from '../entities/entity';
import {MapCell} from '../entities/mapcell';
import {Layout} from '../components/hexlib';
export class Unit extends Entity {
    public hp: number = 10;
    public symbol: string;
    public name: string;

    public waitTime: number = 5;
    public moveTime: number = 7;
    public attackTime: number = 10;
    public summonTime: number = 10;

    constructor(protected ctx: CanvasRenderingContext2D, protected game: Game, public parentCell: MapCell) {
        super(ctx, game);
    }
    public draw() {
        this.ctx.font = '2.0em Arial';
        this.ctx.fillStyle = '#000';
        var coordsText = this.symbol;
        var metrics = this.ctx.measureText(coordsText);
        var center = Layout.hexToPixel(this.game.layout, this.parentCell.getHex());
        this.ctx.fillText(coordsText, center.x - (metrics.width/2), center.y);
    }
    public move(to: MapCell) {
        this.parentCell.unit = null;
        this.parentCell = to;
        to.unit = this;
    }
}
