abstract class Entity {
    protected entities: Entity[];
    protected needsRedraw: boolean;
    constructor(protected ctx: CanvasRenderingContext2D, protected game: Game) {
    }

    public update() {
    }

    public draw() {
        //if (!this.needsRedraw) {
            //return;
        //}
    }

    // Input handling
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
    }
    public keyDown(ev: KeyboardEvent) {
    }
}
