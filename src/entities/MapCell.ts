import {Game} from '../game';
import {Entity} from './entity';
import {Unit} from '../units/unit';
import {Layout,Hex,Point} from '../components/hexlib';
export class MapCell extends Entity {
    private _height:number = 0;
    public moveEnabled: boolean;
    public unit: Unit;

    constructor (ctx: CanvasRenderingContext2D, game: Game, public q: number, public r: number, public s: number, public type: MapCellType) { super(ctx, game); }

    get height(): number {
        return this._height;
    }

    public getHex(): Hex {
        return new Hex(this.q, this.r, this.s);
    }

    public toString(): string {
        return '[MapCell ' + this.getTypeText() + ', ' + this._height + ']';
    }

    public getColor() : string {
        switch (this.type) {
            case MapCellType.WATER:
                return '#8ED6FF';
            case MapCellType.MAGIC:
                return '#FFD6FF';
            case MapCellType.LAND:
                return '#8EFFD6';
            case MapCellType.WALL:
                return '#000000';
            case MapCellType.NONE:
                return '#fff';
        }
    }

    public getTypeText() : string {
        switch (this.type) {
            case MapCellType.WATER:
                return 'Water';
            case MapCellType.MAGIC:
                return 'Magic';
            case MapCellType.LAND:
                return 'Land';
            case MapCellType.WALL:
                return 'Wall';
            case MapCellType.NONE:
                return 'None';
        }
    }

    public update() {
    }

    public draw() {
        var hex = this.getHex();
        var center = Layout.hexToPixel(this.game.layout, hex);

        // Don't draw hexes that aren't being seen
        if (center.x < -this.game.hexSize.x || center.x > this.game.globalWidth + this.game.hexSize.x)
            return;
        if (center.y < -this.game.hexSize.y || center.y > this.game.globalHeight + this.game.hexSize.y)
            return;

        this.drawTile(this.game.layout, center, this.getColor(), '#ffffff');

        if (this.moveEnabled) {
            this.drawMovementCircle(center);
        }

        if (this.unit)
            this.unit.draw();
    }

    public drawTile(layout: Layout, center: Point, fillColor: string, strokeColor: string) {
        this.ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            var pt = Layout.hexCornerOffset(layout, i);
            if (i == 0) {
                this.ctx.moveTo(center.x + pt.x, center.y + pt.y);
            } else {
                this.ctx.lineTo(center.x + pt.x, center.y + pt.y);
            }
        }
        this.ctx.closePath();

        if (strokeColor) {
            this.ctx.strokeStyle = strokeColor;
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
        }

        this.ctx.fillStyle = fillColor;
        this.ctx.fill();
    }

    public drawMovementCircle(center: Point) {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#ff8E8E';
        this.ctx.arc(center.x, center.y, 5, 0, 2*Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
    }

    public cellClicked() {

    }
}

export enum MapCellType {
    WATER,
    LAND,
    WALL,
    MAGIC,
    NONE
}
