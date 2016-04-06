import {Game} from '../game';
import {Unit} from './unit';
import {MapCell} from '../entities/mapcell';
export class Player extends Unit {
    constructor(protected ctx: CanvasRenderingContext2D, protected game: Game, public parentCell: MapCell, public allegiance: boolean) {
        super(ctx, game, parentCell, allegiance);
        this.symbol = 'P';
        this.name = 'Player';
        this.attackScore = 10;
    }
}
