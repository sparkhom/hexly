import {Game, GameAction} from '../game';
import {GameState} from '../states/state';
import {Entity} from './entity';
import {Creature} from '../units/creature';
import {MapCell, MapCellType} from './mapcell';
import {Layout,Hex,Point,OffsetCoord} from '../components/hexlib';
export class Map extends Entity {
    private _height: number;
    private _width: number;
    private _worldWidth: number;
    private _worldHeight: number;
    private vertDistance: number;
    private horizDistance: number;
    private hexHeight: number;
    private hexWidth: number;

    private mouseStart: Point = new Point(0,0);
    private oldPos: Point = new Point(0,0);
    private mouseDrag: boolean;
    private selectedCell: MapCell;

    constructor (ctx: CanvasRenderingContext2D, game: Game, private store: MapCell[][], private hexSize: Point) {
        super(ctx, game);
        this._height = store.length;
        this._width = store[0].length;
        this.hexHeight = hexSize.y * 2;
        this.hexWidth = Math.sqrt(3) / 2 * this.hexHeight;
        this.vertDistance = this.hexHeight * 3/4;
        this.horizDistance = this.hexWidth;
    }

    get worldHeight(): number {
        return this._height*this.vertDistance;
    }

    get worldWidth(): number {
        return this._width*this.horizDistance;
    }

    get height(): number {
        return this._height;
    }

    get width(): number {
        return this._width;
    }

    private qrij(q: number, r: number): number[] {
        var i: number = r;
        var j: number = Math.floor(q + r/2);
        if (i < 0 || j < 0)
            return null;
        if (i >= this._height || j >= this._width)
            return null;
        return [i, j];
    }

    public static generateRandomMap(ctx: CanvasRenderingContext2D, game: Game) {
        var mapstore:MapCell[][] = [];
        for (var i = 0; i < 15; i++) {
            mapstore[i] = [];
            for (var j = 0; j < 30; j++) {
                var coord:OffsetCoord = new OffsetCoord(j, i);
                var h:Hex = OffsetCoord.roffsetToCube(OffsetCoord.ODD, coord);
                var random:number = Math.floor((Math.random() * 10) + 1);
                var cell:MapCell = new MapCell(ctx, game, h.q, h.r, h.s, MapCellType.NONE);
                if (random > 6) {
                    mapstore[i][j] = cell;
                    continue;
                }
                if (random > 6)
                    cell.type = MapCellType.WATER;
                else
                    random = Math.floor((Math.random() * 10) + 1);
                    if (random > 1)
                        cell.type = MapCellType.LAND;
                    else
                        cell.type = MapCellType.MAGIC;

                mapstore[i][j] = cell;
            }
        }

        return mapstore;
    }

    public static generateStandardMap(ctx: CanvasRenderingContext2D, game: Game) {
        var mapstore:MapCell[][] = [];
        for (var i = 0; i < 15; i++) {
            mapstore[i] = [];
            for (var j = 0; j < 15; j++) {
                var coord:OffsetCoord = new OffsetCoord(j, i);
                var h:Hex = OffsetCoord.roffsetToCube(OffsetCoord.ODD, coord);
                var cell:MapCell = new MapCell(ctx, game, h.q, h.r, h.s, MapCellType.NONE);
                if (i % 5 == 3 && j % 5 == 3)
                    cell.type = MapCellType.MAGIC;
                else
                    cell.type = MapCellType.LAND;
                if (i == 0 && j == 0) {
                    cell.unit = game.myPlayer;
                    game.myPlayer.parentCell = cell;
                }
                if (i == 14 && j == 14) {
                    cell.unit = game.opponentPlayer;
                    game.opponentPlayer.parentCell = cell;
                }
                mapstore[i][j] = cell;
            }
        }

        return mapstore;

    }

    public get(q: number, r: number) : MapCell {
        var ij: number[] = this.qrij(q, r);
        if (!ij)
            return;
        var i: number = ij[0];
        var j: number = ij[1];
        return this.store[i][j];
    }

    public set(q: number, r: number, val: MapCell) {
        var ij: number[] | boolean = this.qrij(q, r);
        if (!ij)
            return;
        var i: number = ij[0];
        var j: number = ij[1];
        this.store[i][j] = val;
    }

    public update() {
        if (this.game.state === GameState.MOVE) {
            this.moveAdjacent(this.game.currentTurn.parentCell, true);
        } else if (this.game.state === GameState.ATTACK) {
            this.attackAdjacent(this.game.currentTurn.parentCell, true);
        }
        for (var r = 0; r < this.height; r++) {
            var r_offset = Math.floor(r/2);
            for (var q = -r_offset; q < this.width - r_offset; q++) {
                var cell = this.get(q, r);
                cell.update();
            }
        }
    }

    public draw() {
        for (var r = 0; r < this.height; r++) {
            var r_offset = Math.floor(r/2);
            for (var q = -r_offset; q < this.width - r_offset; q++) {
                var cell = this.get(q, r);
                cell.draw();
            }
        }
    }

    public moveAdjacent(hex: Hex, move: boolean) {
        for (var i = 0; i < Hex.directions.length; i++) {
            var neighbor: Hex = Hex.neighbor(hex, i);
            var neighborcell: MapCell = this.get(neighbor.q, neighbor.r);
            if (neighborcell && neighborcell.type != MapCellType.NONE && !neighborcell.unit)
                neighborcell.moveEnabled = move;
        }
    }

    public attackAdjacent(hex: Hex, move: boolean) {
        for (var i = 0; i < Hex.directions.length; i++) {
            var neighbor: Hex = Hex.neighbor(hex, i);
            var neighborcell: MapCell = this.get(neighbor.q, neighbor.r);
            if (neighborcell && neighborcell.unit)
                neighborcell.moveEnabled = move;
        }
    }

    public mouseDown(ev: MouseEvent) {
        this.mouseStart.x = ev.clientX;
        this.mouseStart.y = ev.clientY;
        this.oldPos.x = this.game.layout.origin.x;
        this.oldPos.y = this.game.layout.origin.y;
    }

    public mouseUp(ev: MouseEvent) {
        if (this.oldPos.x == this.game.layout.origin.x && this.oldPos.y == this.game.layout.origin.y) {
            var hex: Hex = Hex.round(Layout.pixelToHex(this.game.layout, new Point(ev.clientX, ev.clientY)));
            var cell: MapCell = this.get(hex.q, hex.r);
            if (!cell)
                return;
            if (this.game.state === GameState.START && cell.unit == this.game.currentTurn) {
                this.moveAdjacent(hex, true);
                this.game.state = GameState.MOVE;
            } else if (this.game.state === GameState.MOVE) {
                if (cell.moveEnabled) {
                    this.moveAdjacent(this.game.currentTurn.parentCell.getHex(), false);
                    this.game.currentTurn.move(cell);
                    this.game.state = GameState.SELECT;
                } 
            } else if (this.game.state === GameState.ATTACK) {
                if (cell.moveEnabled) {
                    this.attackAdjacent(this.game.currentTurn.parentCell.getHex(), false);
                }
            } else if (this.game.state === GameState.SUMMON) {
                if (cell.moveEnabled) {
                    this.moveAdjacent(this.game.currentTurn.parentCell.getHex(), false);
                    cell.unit = new Creature(this.ctx, this.game, cell);
                    this.game.turnQueue.push(cell.unit);
                    this.game.nextTurn(GameAction.SUMMON);
                }
            }
            cell.cellClicked();
            // Didn't move
        }
    }
    public mouseOut(ev: MouseEvent) {
    }
    public mouseOver(ev: MouseEvent) {
    }
    public mouseMove(ev: MouseEvent) {
        if (ev.buttons === 1) {
            var newPosX = this.oldPos.x - (this.mouseStart.x - ev.clientX);
            var newPosY = this.oldPos.y - (this.mouseStart.y - ev.clientY);
            var newPos = new Point(newPosX, newPosY);

            this.updateBounds(newPos);
        }

        var hex: Hex = Hex.round(Layout.pixelToHex(this.game.layout, new Point(ev.clientX, ev.clientY)));
        this.game.currentCell = this.get(hex.q, hex.r);
    }
    public keyUp(ev: KeyboardEvent) {
    }
    public keyDown(ev: KeyboardEvent) {
    }
    public updateBounds(pos: Point) {
        if (pos.x < this.game.globalWidth - (this.worldWidth / 2) && pos.x > -(this.worldWidth / 2))
            this.game.layout.origin.x = pos.x;
        if (pos.y < this.game.globalHeight - (this.worldHeight / 2) && pos.y > -(this.worldHeight / 2))
            this.game.layout.origin.y = pos.y;
    }
}
