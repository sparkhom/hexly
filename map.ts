class Map {
    private _height: number;
    private _width: number;

    constructor (private store:MapCell[][]) {
        this._height = store.length;
        this._width = store[0].length;
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
            return [];
        if (i >= this._height || j >= this._width)
            return [];
        return [i, j];
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
}

class MapCell extends Hex {
    private _height:number = 0;
    public moveEnabled:boolean = false;

    constructor (public q: number, public r: number, public s: number, public type: MapCellType) { super(q, r, s); }

    get height(): number {
        return this._height;
    }

    public toString() {
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
}

enum MapCellType {
    WATER,
    LAND,
    WALL,
    MAGIC,
    NONE
}
