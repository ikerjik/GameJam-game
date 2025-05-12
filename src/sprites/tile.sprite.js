import {Sprite} from "jetcode-scrubjs";

export class TileSprite extends Sprite {
    init(){
        this.addCostumeGrid('public/images/Dungeon_Tileset.png', {
            cols: 10,
            rows: 10
        });
        this.size = 400;
        this.removeCollider();
    }
}
