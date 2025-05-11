import {Stage} from 'jetcode-scrubjs';

import {MenubackgroundSprite} from '../sprites/menubackground.sprite.js';
import {ButtonSprite} from '../sprites/button.sprite.js';
import {Dangeon} from "./dangeon.stage";

export class MenuStage extends Stage {
    init() {
        this.layer1 = MenubackgroundSprite.getInstance(0, 1);
        this.layer2 = MenubackgroundSprite.getInstance(1, 2);
        this.layer3 = MenubackgroundSprite.getInstance(2, 3);
        this.layer4 = MenubackgroundSprite.getInstance(3, 4);

        const startButton = new ButtonSprite();
        startButton.layer = 4;

        const dangeon = new Dangeon();

        startButton.onReady(()=>{
            const ctx = startButton.getCostume().image.getContext('2d');
            ctx.font = '14px Arial';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText('start', 0, 4);
        })

        startButton.forever(()=>{
            if (startButton.touchMouse() && this.game.mouseDownOnce()) {
                this.game.run(dangeon);
            }
        })
    }

}
