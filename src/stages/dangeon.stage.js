import {Stage} from 'jetcode-scrubjs';
import {NpcSprite} from '../sprites/npc.sprite.js';
import {TileSprite} from '../sprites/tile.sprite.js';

export class Dangeon extends Stage {
    init() {
        this.backgroundColor = 'black';

        this.map = this.createDangeon();
        console.log(this.map);

        const hero = new NpcSprite();
        hero.x_on_map = 5;
        hero.y_on_map = 5;
        hero.layer = 2;
        // hero.setRectCollider('main', 38, 38)

        this.tile = new TileSprite();
        this.TILE_WIDTH = 64;
        this.TILE_HEIGHT = 64;

        this.onReady(()=>{
            this.renderRoom(this.map, hero.x_on_map, hero.y_on_map);
        })

        this.forever(this.control(hero))
    }

    createDangeon() {
        const map = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ]

        let x = 5;
        let y = 5;
        let chance = 100;

        this.createRoom(map, x, y, chance);
        this.calculateDoors(map);
        this.prepareMap(map);

        return map;
    }

    createRoom(map, x, y, chance) {
        if (map[y][x] !== undefined) {
            if (map[y][x] === 1) {
                return;
            }

            if (x < 1 || y < 1 || y > 9 || x > 9) {
                return;
            }

            map[y][x] = 1;

            if (this.game.getRandom(0, 100) <= chance) {
                if (map[y - 1][x - 1] === 0 && map[y - 1][x + 1] === 0) {
                    this.createRoom(map, x, y - 1, chance - 10);
                }
            }
            if (this.game.getRandom(0, 100) <= chance) {
                if (map[y - 1][x + 1] === 0 && map[y + 1][x + 1] === 0) {
                    this.createRoom(map, x + 1, y, chance - 10);
                }
            }
            if (this.game.getRandom(0, 100) <= chance) {
                if (map[y + 1][x - 1] === 0 && map[y + 1][x + 1] === 0) {
                    this.createRoom(map, x, y + 1, chance - 10);
                }
            }
            if (this.game.getRandom(0, 100) <= chance) {
                if (map[y - 1][x - 1] === 0 && map[y + 1][x - 1] === 0) {
                    this.createRoom(map, x - 1, y, chance - 10);
                }
            }
        }
    }

    calculateDoors(map) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] === 1) {
                    let roomStr = "";
                    if (map[y - 1][x] != 0) {
                        roomStr += `1`; //topDoor
                    }
                    if (map[y][x + 1] != 0) {
                        roomStr += `2`; //rightDoor
                    }
                    if (map[y + 1][x] != 0) {
                        roomStr += `3`; //bottomDoor
                    }
                    if (map[y][x - 1] != 0) {
                        roomStr += `4`; //leftDoor
                    }

                    map[y][x] = roomStr;
                }
            }
        }
    }

    prepareMap(map) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] !== 0) {
                    let doors = map[y][x].split('');
                    let room = [
                        [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5],
                        [10, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 35],
                        [10, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 35],
                        [10, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 35],
                        [10, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 35],
                        [10, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 35],
                        [10, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 35],
                        [10, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 35],
                        [10, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 35],
                        [10, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 35],
                        [10, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 35],
                        [40, 41, 41, 41, 41, 41, 41, 41, 41, 41, 41, 45],
                    ];

                    for (const door of doors) {
                        switch (door) {
                            case '1':
                                room[0][5] = 23;
                                room[0][6] = 23;
                                break;
                            case '2':
                                room[5][11] = 23;
                                room[6][11] = 23;
                                break;
                            case '3':
                                room[11][5] = 23;
                                room[11][6] = 23;
                                break;
                            case '4':
                                room[5][0] = 23;
                                room[6][0] = 23;
                                break;
                        }
                    }
                    map[y][x] = {
                        completed: false,
                        map: room,
                        enemies: null,
                        enemiesCount: null
                    }
                }
            }
        }
    }

    renderRoom(map, x, y) {
        this.tile.deleteClones()
        let room = this.map[y][x];
        for (let tileY = 0; tileY < room.map.length; tileY++) {
            for (let tileX = 0; tileX < room.map[y].length; tileX++) {
                const tileIndex = room.map[tileY][tileX];

                let clone = this.tile.createClone();
                clone.x = this.TILE_WIDTH / 2 + this.TILE_WIDTH * tileX;
                clone.y = this.TILE_HEIGHT / 2 + this.TILE_HEIGHT * tileY;
                clone.switchCostume(tileIndex)

                if ([2, 10, 35, 41].includes(tileIndex)) {
                    clone.setCostumeCollider('main')
                    clone.addTag('wall')
                }
            }
        }
    }

    control (hero) {
        return ()=> {
            if (this.game.keyPressed('w')) {
                hero.y -= 5;
                if (hero.touchTag('wall')) {
                    hero.topY = hero.otherSprite.bottomY;
                }
            }
            if (this.game.keyPressed('s')) {
                hero.y += 5;
                if (hero.touchTag('wall')) {
                    hero.bottomY = hero.otherSprite.topY;
                }
            }
            if (this.game.keyPressed('a')) {
                hero.x -= 5;
                if (hero.touchTag('wall')) {
                    hero.leftX = hero.otherSprite.rightX;
                }
            }
            if (this.game.keyPressed('d')) {
                hero.x += 5;
                if (hero.touchTag('wall')) {
                    hero.rightX = hero.otherSprite.leftX;
                }
            }

            if (hero.y < 0) {
                hero.y_on_map -= 1;
                hero.y = this.height;
                this.renderRoom(this.map, hero.x_on_map, hero.y_on_map);
            }
            if (hero.y > this.height) {
                hero.y_on_map += 1;
                hero.y = 0;
                this.renderRoom(this.map, hero.x_on_map, hero.y_on_map);
            }
            if (hero.x < 0) {
                hero.x_on_map -= 1;
                hero.x = this.width;
                this.renderRoom(this.map, hero.x_on_map, hero.y_on_map);
            }
            if (hero.x > this.width) {
                hero.x_on_map += 1;
                hero.x = 0;
                this.renderRoom(this.map, hero.x_on_map, hero.y_on_map);
            }
        }
    }

}
