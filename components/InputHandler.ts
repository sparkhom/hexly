class InputHandler {
    protected keyCodes = {};
    public mouseStart = new Point(0,0);
    public oldPos = new Point(0,0)
    constructor(private entity: Entity, private game: Game) {
    }
    public mouseOut(ev: MouseEvent) {
    }
    public mouseOver(ev: MouseEvent) {
    }
    public mouseDown(ev: MouseEvent) {
    }
    public mouseUp(ev: MouseEvent) {
    }
    public mouseMove(ev: MouseEvent) {
    }
    public keyUp(ev: KeyboardEvent) {
        this.keyCodes[ev.keyCode] = false;
    }
    public keyDown(ev: KeyboardEvent) {
        this.keyCodes[ev.keyCode] = true;
    }
}
