import {Stage} from 'jetcode-scrubjs';
import {TileSprite} from '../sprites/tile.sprite.js';
import {HeroSprite} from "../sprites/hero.sprite";
import {EnemyBatSprite} from "../sprites/enemy-bat.sprite";

export class DungeonStage extends Stage {

    init() {
        this.backgroundColor = 'black';


        this.map = this.createDungeon();
        // console.log(this.map);

        const hero = HeroSprite.getInstance();
        this.hero = hero;
        this.hero.y = this.height - 100;

        hero.x_on_map = 5;
        hero.y_on_map = 5;
        hero.layer = 2;

        this.enemyTemplates = {};

        this.batEnemyTemplate = new EnemyBatSprite(this);
        this.batEnemyTemplate.layer = 2;
        this.enemyTemplates['bat'] = this.batEnemyTemplate;

        this.tile = new TileSprite();
        this.TILE_WIDTH = 64;
        this.TILE_HEIGHT = 64;

        this.onReady(()=>{
            this.renderRoom(hero.x_on_map, hero.y_on_map);
        })
    }

    createDungeon() {
        const exitRooms = [];
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
        ];

        let x = 5;
        let y = 5;
        let chance = 100;

        this.createRoom(map, x, y, chance);
        this.calculateDoors(map);
        this.prepareMap(map, exitRooms);

        this.chooseExit(map, exitRooms);

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

    prepareMap(map, exitRooms) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] !== 0) {
                    const doors = map[y][x].split('');
                    const room = [
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
                        enemyTypes: ['bat'],
                        enemies: []
                    };

                    if (doors.length == 1) {
                        exitRooms.push({x: x, y: y});
                    }
                }
            }
        }
    }

    chooseExit(map, exitRooms) {
        // const randomRoom = exitRooms[Math.floor(Math.random() * exitRooms.length)]
        const randomRoom = {x: 5, y: 5}

        map[randomRoom.y][randomRoom.x].map[6][6] = 38;
    }

    renderRoom(x, y) {
        const room = this.map[y][x];

        this.doRenderRoom(room);
    }

    completeRoom(x, y) {
        const room = this.map[y][x];
        room.completed = true;
    }

    renderFinalRoom() {
        const room = {
            map: [
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
            ],
            completed: false,
            enemyTypes: ['bat'],
            enemies: []
        };

        this.doRenderRoom(room);
    }

    doRenderRoom(room) {
        this.tile.deleteClones();

        if (!room.completed) {
            const enemies = [];
            for (const enemyType of room.enemyTypes) {
                const enemy = this.createEnemy(enemyType);
                enemies.push(enemy);
            }

            room.enemies = enemies;
        }

        for (let tileY = 0; tileY < room.map.length; tileY++) {
            for (let tileX = 0; tileX < room.map[0].length; tileX++) {
                const tileIndex = room.map[tileY][tileX];

                const clone = this.tile.createClone();
                clone.x = this.TILE_WIDTH / 2 + this.TILE_WIDTH * tileX;
                clone.y = this.TILE_HEIGHT / 2 + this.TILE_HEIGHT * tileY;
                clone.switchCostume(tileIndex)

                if ([2, 10, 35, 41].includes(tileIndex)) {
                    clone.setCostumeCollider('main')
                    clone.addTag('wall')
                }

                if (tileIndex === 38) { //exit
                    clone.setCostumeCollider('main');
                    clone.addTag('exit')
                }
            }
        }
    }

    createEnemy(enemyType) {
        if (this.enemyTemplates[enemyType]) {
            const enemyTemplate = this.enemyTemplates[enemyType];
            const enemy = enemyTemplate.createClone();

            // console.log(enemyTemplate);

            enemy.start();
        }
    }
}
