import {Stage} from 'jetcode-scrubjs';
import {TileSprite} from '../sprites/tile.sprite.js';
import {HeroSprite} from "../sprites/hero.sprite";
import {BatEnemySprite} from "../sprites/bat-enemy.sprite";
import {MoleEnemySprite} from "../sprites/mole-enemy.sprite";
import {BossEnemySprite} from "../sprites/boss-enemy.sprite";
import {BedbugEnemySprite} from "../sprites/bedbug-enemy.sprite";
import {ButtonSprite} from "../sprites/button.sprite";
import {SmokeSprite} from '../sprites/smoke.sprite';

export class DungeonStage extends Stage {
    static instance;

    static getInstance() {
        if (!DungeonStage.instance) {
            DungeonStage.instance = new DungeonStage();
        }

        return DungeonStage.instance;
    }

    init() {
        this.backgroundColor = 'black';

        this.enemyTemplates = {};

        this.batEnemyTemplate = new BatEnemySprite(this);
        this.batEnemyTemplate.layer = 2;
        this.moleEnemyTemplate = new MoleEnemySprite(this);
        this.moleEnemyTemplate.layer = 2;
        this.bedbugEnemyTemplate = new BedbugEnemySprite(this);
        this.bedbugEnemyTemplate.layer = 2;
        this.bossEnemyTemplate = new BossEnemySprite(this);
        this.bossEnemyTemplate.layer = 2;

        this.enemyTemplates['bat'] = this.batEnemyTemplate;
        this.enemyTemplates['mole'] = this.moleEnemyTemplate;
        this.enemyTemplates['bedbug'] = this.bedbugEnemyTemplate;
        this.enemyTemplates['boss'] = this.bossEnemyTemplate;

        this.tile = new TileSprite();
        this.TILE_WIDTH = 48;
        this.TILE_HEIGHT = 48;

        this.restartButton = new ButtonSprite();
        this.restartButton.layer = 4;
        this.restartButton.hidden = true;
        this.restartButton.onClick(this.restartGame.bind(this));

        this.restartButton.onReady(() => {
            this.restartButton.setLabel('Restart');
        });

        this.map = this.createDungeon();

        this.smoke = new SmokeSprite();

        this.hero = HeroSprite.getInstance();
        this.hero.layer = 2;
        this.initHero();

        this.onReady(()=>{
            this.renderRoom(this.hero.x_on_map, this.hero.y_on_map);
            this.pen(this.miniMap, 10);
        });
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
                                room[0][5] = 36;
                                room[0][6] = 37;
                                break;
                            case '2':
                                room[5][11] = 47;
                                room[6][11] = 57;
                                break;
                            case '3':
                                room[11][5] = 36;
                                room[11][6] = 37;
                                break;
                            case '4':
                                room[5][0] = 48;
                                room[6][0] = 58;
                                break;
                        }
                    }

                    const distance = Math.max(Math.abs(x - 5), Math.abs(y - 5));
                    const maxEnemies = 2 + distance;

                    const monsters = [];

                    if (distance > 0) {
                        for (let i = 0; i < maxEnemies; i++) {
                            if (this.game.getRandom(0, 10) <= 3) {
                                monsters.push('bedbug');

                            } else if (this.game.getRandom(0, 10) <= 2) {
                                monsters.push('mole');

                            } else if (distance >= 2 && this.game.getRandom(0, 10) <= 1) {
                                monsters.push('bat');
                            }
                        }
                    }

                    map[y][x] = {
                        completed: false,
                        map: room,
                        enemyTypes: monsters,
                        enemies: monsters.length
                    };

                    if (doors.length == 1) {
                        exitRooms.push({x: x, y: y});
                    }
                }
            }
        }
    }

    chooseExit(map, exitRooms) {
        const randomRoom = exitRooms[Math.floor(Math.random() * exitRooms.length)]
        // const randomRoom = {x: 5, y: 5}

        map[randomRoom.y][randomRoom.x].map[6][6] = 38;
    }

    renderRoom(x, y) {
        const room = this.map[y][x];

        this.tryFinishRoom();
        this.doRenderRoom(room);
    }

    completeRoom(x, y) {
        const room = this.map[y][x];
        if (!room.completed) {
            room.completed = true;
        }
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
            enemyTypes: ['boss'],
            enemies: 1
        };

        this.doRenderRoom(room);
    }

    doRenderRoom(room) {
        this.tile.deleteClones();
        this.batEnemyTemplate.deleteClones();
        this.moleEnemyTemplate.deleteClones();
        this.bedbugEnemyTemplate.deleteClones();
        this.bossEnemyTemplate.deleteClones();

        if (!room.completed) {
            const enemies = [];
            for (const enemyType of room.enemyTypes) {
                const enemy = this.createEnemy(enemyType);
                enemies.push(enemy);
            }

            room.enemies = enemies.length;
        }

        for (let tileY = 0; tileY < room.map.length; tileY++) {
            for (let tileX = 0; tileX < room.map[0].length; tileX++) {
                const tileIndex = room.map[tileY][tileX];

                if ([36, 37, 48, 47, 58, 57].includes(tileIndex)) {
                    const floorClone = this.tile.createClone();
                    floorClone.switchCostume(23);
                    floorClone.layer = 0;
                    floorClone.x = this.TILE_WIDTH / 2 + this.TILE_WIDTH * tileX;
                    floorClone.y = this.TILE_HEIGHT / 2 + this.TILE_HEIGHT * tileY;

                    if (this.map[this.hero.y_on_map][this.hero.x_on_map].completed) {
                        continue;
                    }
                }

                const clone = this.tile.createClone();
                clone.x = this.TILE_WIDTH / 2 + this.TILE_WIDTH * tileX;
                clone.y = this.TILE_HEIGHT / 2 + this.TILE_HEIGHT * tileY;
                clone.switchCostume(tileIndex);

                if ([2, 10, 35, 41].includes(tileIndex)) {
                    clone.setCostumeCollider('main');
                    clone.addTag('wall');
                }

                if (tileIndex === 38) { //exit
                    clone.setCostumeCollider('main');
                    clone.addTag('exit');
                }

                if ([36, 37, 48, 47, 58, 57].includes(tileIndex)) {
                    clone.layer = 1;
                    clone.setCostumeCollider('main');
                    clone.addTag('wall');

                    clone.forever(()=>{
                        if (!this.hero.deleted && this.map[this.hero.y_on_map][this.hero.x_on_map].completed){
                            clone.delete();
                        }
                    });
                }
            }
        }
    }

    createEnemy(enemyType) {
        if (this.enemyTemplates[enemyType]) {
            const enemyTemplate = this.enemyTemplates[enemyType];
            const enemy = enemyTemplate.createClone();

            enemy.x = this.game.getRandom(96, this.width - 96);
            enemy.y = this.game.getRandom(96, this.height - 96);

            // console.log(enemyTemplate);

            enemy.start();
        }
    }

    tryFinishRoom() {
        if (!this.hero.deleted && this.map[this.hero.y_on_map][this.hero.x_on_map].enemies <= 0) {
            this.completeRoom(this.hero.x_on_map, this.hero.y_on_map);
        }
    }

    killEnemy(x, y){
        const clone = this.smoke.createClone(this);
        clone.x = x;
        clone.y = y;
        clone.start();
        this.map[this.hero.y_on_map][this.hero.x_on_map].enemies -= 1;
        this.tryFinishRoom();
    }

    miniMap(ctx, stage) {
        if (!stage.hero.deleted) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            ctx.fillRect(stage.width - 168, 48, 120, 120);

            const map = stage.map;
            for (let y = 0; y < map.length; y++) {
                for (let x = 0; x < map[y].length; x++) {
                    const room = map[y][x];
                    if (room !== 0) {
                        if (room.completed) {
                            ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
                            ctx.fillRect(stage.width - 158 + x * 10, 53 + y * 10, 10, 10);
                        }

                        if (stage.hero.x_on_map === x && stage.hero.y_on_map === y) {
                            ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
                            ctx.fillRect(stage.width - 158 + x * 10, 53 + y * 10, 10, 10);
                        }
                    }
                }
            }
        }
    }

    showRestartButton() {
        this.restartButton.hidden = false;
    }

    hideRestartButton() {
        this.restartButton.hidden = true;
    }

    restartGame() {
        this.hideRestartButton();

        this.map = this.createDungeon();
        this.initHero();

        this.renderRoom(this.hero.x_on_map, this.hero.y_on_map);
    }

    initHero() {
        this.hero.hp = 100;
        this.hero.ammo = 100;
        this.hero.state = 'idle';
        this.hero.hidden = false;

        this.hero.onReady(() => {
            this.hero.y = this.height - 100;
            this.hero.x = this.width / 2 - this.hero.width / 2;
        });

        this.hero.x_on_map = 5;
        this.hero.y_on_map = 5;
    }
}
