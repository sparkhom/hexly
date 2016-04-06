import {Game, GameAction} from '../game';
import {GameState} from '../states/state';
import {Entity} from './entity';
import {Button} from './button';
export class Menu extends Entity {
    public buttons: Button[] = [];
    public waitButton: Button;
    public attackButton: Button;
    public summonButton: Button;
    constructor(ctx: CanvasRenderingContext2D, game: Game) {
        super(ctx, game);
        this.waitButton = new Button(ctx, game, "wait", this.game.globalWidth - 180, 20, 160, 20, this.wait);
        this.attackButton = new Button(ctx, game, "attack", this.game.globalWidth - 180, 60, 160, 20, this.attack);
        this.summonButton = new Button(ctx, game, "summon", this.game.globalWidth - 180, 100, 160, 20, this.summon);
        this.buttons.push(this.waitButton);
        this.buttons.push(this.attackButton);
        this.buttons.push(this.summonButton);
    }

    public update() {
        if (this.game.state != GameState.SELECT) {
            this.attackButton.disabled = true;
            this.summonButton.disabled = true;
        } else {
            this.attackButton.disabled = false;
            if (this.game.currentTurn.symbol == 'P')
                this.summonButton.disabled = false;
        }
    }

    public draw() {
        this.ctx.fillStyle = '#eee';
        this.ctx.fillRect(this.game.globalWidth - 200, 0, 200, this.game.globalHeight);
        for (var b of this.buttons) {
            b.draw();
        }
    }

    public mouseMove(ev) {
        for (var b of this.buttons) {
            b.mouseMove(ev);
        }
    }

    public mouseUp(ev) {
        for (var b of this.buttons) {
            b.mouseUp(ev);
        }
    }

    public attack() {
        if (this.game.state != GameState.SELECT)
            return;
        this.game.state = GameState.ATTACK;
    }

    public wait() {
        console.log(this.game);
        this.game.nextTurn(GameAction.WAIT);
    }

    public summon() {
        if (this.game.state != GameState.SELECT || this.game.currentTurn.symbol != 'P')
            return;
        this.game.map.moveAdjacent(this.game.currentTurn.parentCell.getHex(), true);
        this.game.state = GameState.SUMMON;
        console.log('summon clicked!');
    }
}
