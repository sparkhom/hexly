import {Game} from '../game';
import {Unit} from './unit';
import {MapCell} from '../entities/mapcell';
export class Player extends Unit {
    constructor(protected ctx: CanvasRenderingContext2D, protected game: Game, public parentCell: MapCell) {
        super(ctx, game, parentCell);
        this.symbol = 'P';
        this.name = 'Player';
    }
}
