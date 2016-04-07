import {Entity} from './entities/entity';
import {Layout,Point} from './components/hexlib';
import {MapCell} from './entities/mapcell';
import {Map} from './entities/map';
import {Menu} from './entities/menu';
import {DebugBar} from './entities/debugbar';
import {Unit} from './units/unit';
import {Player} from './units/player';
import {GameState} from './states/state';
export class Game {
    public debug: boolean = true;
    public showCoordsText: boolean = false;

    public currentScene: Scene;
    public redrawNeeded: boolean = false;
    public ctx: CanvasRenderingContext2D;

    public timeToDraw: number;
    public startDraw: number;
    public worldWidth: number;
    public worldHeight: number;

    public mouseDrag: boolean = false;
    public mouseStart: Point = new Point(0,0);
    public oldPos: Point = new Point(0,0);

    public keyCodes = {};

    public layout: Layout;
    public hexSize: Point;

    public map: Map;
    public currentCell: MapCell;

    public entities: Entity[] = [];
    public state: GameState = GameState.MOVE;
    public turnQueue: Unit[] = [];
    public currentTurn: Unit = null;
    public myPlayer: Player;
    public opponentPlayer: Player;
    public previousPosition: MapCell;

    public winCondition: boolean = false;

    private debugBar: DebugBar;

    public constructor(private canvas, public globalWidth: number, public globalHeight: number, private ratio: number) {
        this.ctx = canvas.getContext("2d");
        this.hexSize = new Point(30,30);
        this.layout = new Layout(Layout.pointy, this.hexSize, new Point(this.hexSize.x, this.hexSize.y));

        this.myPlayer = new Player(this.ctx, this, null, true);
        this.myPlayer.allegiance = true;
        this.opponentPlayer = new Player(this.ctx, this, null, false);
        this.opponentPlayer.allegiance = false;
        this.turnQueue = [this.opponentPlayer];
        this.currentTurn = this.myPlayer;

        this.map = new Map(this.ctx, this, Map.generateStandardMap(this.ctx, this), this.hexSize);
        this.entities.push(this.map);
        this.entities.push(new Menu(this.ctx, this));
        this.debugBar = new DebugBar(this.ctx, this);
        this.entities.push(this.debugBar);


        this.setup();
    }

    public setup() {
        this.redrawNeeded = true;
        this.init();
        //requestAnimationFrame(() => (this.update()));
        var _self = this;
        this.canvas.addEventListener('mouseover', (ev: MouseEvent) => (this.mouseOver(ev)));
        this.canvas.addEventListener('mouseout', (ev: MouseEvent) => (this.mouseOut(ev)));
        this.canvas.addEventListener('mousemove', (ev: MouseEvent) => (this.mouseMove(ev)));
        this.canvas.addEventListener('mousedown', (ev: MouseEvent) => (this.mouseDown(ev)));
        this.canvas.addEventListener('mouseup', (ev: MouseEvent) => (this.mouseUp(ev)));
        window.onkeydown = (ev: KeyboardEvent) => (this.keyDown(ev));
        window.onkeyup = (ev: KeyboardEvent) => (this.keyUp(ev));
        window.onresize = () => (this.resize());
        this.resize();
    }

    public update() {
        if (this.winCondition)
            return;
        if (this.ratio != (window.devicePixelRatio || 1))
            this.resize();
        for (var entity of this.entities)
            entity.update();
        this.draw();
    }

    public init() {
        this.draw();
    }

    public draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var entity of this.entities)
            entity.draw();
    }

    // Input handling

    public mouseOver(ev: MouseEvent) {
        this.redrawNeeded = true;
        for (var entity of this.entities)
            entity.mouseOver(ev);
        this.update();
    }

    public mouseOut(ev: MouseEvent) {
        this.redrawNeeded = true;
        for (var entity of this.entities)
            entity.mouseOut(ev);
        this.update();
    }

    public mouseDown(ev: MouseEvent) {
        this.redrawNeeded = true;
        for (var entity of this.entities)
            entity.mouseDown(ev);
        this.update();
    }

    public mouseUp(ev: MouseEvent) {
        this.redrawNeeded = true;
        for (var entity of this.entities)
            entity.mouseUp(ev);
        this.update();
    }

    public mouseMove(ev: MouseEvent) {
        this.redrawNeeded = true;
        for (var entity of this.entities)
            entity.mouseMove(ev);
        this.update();
    }

    public keyUp(ev: KeyboardEvent) {
        this.redrawNeeded = true;
        for (var entity of this.entities)
            entity.keyUp(ev);
        this.update();
    }

    public keyDown(ev: KeyboardEvent) {
        this.redrawNeeded = true;
        for (var entity of this.entities)
            entity.keyDown(ev);
        this.update();
    }

    public nextTurn(action: GameAction) {
        if (this.myPlayer.hp <= 0) {
            alert('Opponent wins!');
            this.winCondition = true;
        }
        if (this.opponentPlayer.hp <= 0) {
            alert('You win!');
            this.winCondition = true;
        }
        this.turnQueue.push(this.currentTurn);
        this.map.moveAdjacent(this.currentTurn.parentCell.getHex(), false);
        this.currentTurn = this.turnQueue.shift();
        this.previousPosition = null;
        console.log(this.currentTurn);
        this.state = GameState.MOVE;
        this.draw();
    }

    public resize() {
        this.redrawNeeded = true;
        console.log('resize!');
        this.ratio = window.devicePixelRatio || 1;
        this.globalHeight = window.innerHeight;
        this.globalWidth = window.innerWidth;
        this.canvas.width = this.globalWidth*this.ratio;
        this.canvas.height = this.globalHeight*this.ratio;
        this.canvas.style.width = this.globalWidth.toString();
        this.canvas.style.height = this.globalHeight.toString();
        this.ctx.scale(this.ratio, this.ratio);

        this.draw();
    }
}

export enum GameAction {
    WAIT,
    MOVE,
    ATTACK,
    SUMMON
}
