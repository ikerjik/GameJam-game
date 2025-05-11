import {Sprite} from 'jetcode-scrubjs';

export class BulletSprite extends Sprite {
    init() {
        this.name = 'Bullet';

        this.drawCostume(this.bulletCostume, {
            width: 12,
            height: 12,
        });

        this.size = 100;
    }

    bulletCostume(ctx) {
        const colors = [
            'rgba(0,0,0,0)', // 0 - transparent
            '#000000'        // 1 - black
        ];

        // Map (16x16)
        const pixelMap = [
            [0, 1, 1, 1, 0],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0],
        ];

        const pixelSize = 2;

        for (let y = 0; y < pixelMap.length; y++) {
            for (let x = 0; x < pixelMap[y].length; x++) {
                const colorIndex = pixelMap[y][x];
                if (colorIndex !== 0) {
                    ctx.fillStyle = colors[colorIndex];
                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }
}
