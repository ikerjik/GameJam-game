import {Sprite} from "jetcode-scrubjs";

export class TileSprite extends Sprite {
    init(){
        this.addCostumeGrid('../../../public/images/tileset.png', {
            cols: 8,
            rows: 6
        });

        this.removeCollider();
    }
}