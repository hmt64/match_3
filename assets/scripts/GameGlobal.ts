import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { GameManager } from './GameManager';
import { ItemColorBox } from './ItemColorBox';

@ccclass('GameGlobal')
export class GameGlobal extends Component {
    static maxBox: number = 6;
    static colomX: number = 3;
    static colomY: number = 3;
    static listParentColorBox: Node[] = [];
    static listColorBox: Node[] = [];
    static listScriptColorBox: ItemColorBox[] = [];

    static listFirstRaw: any;
    static listColumnLimit: number[] = [];
    static listRawLimit: number[] = [];
    static listAllRow: any[] = [];
    static listAllColumn: any[] = [];

    static widthBox = 85;
    static heightBox = 85;

    static highScoreBox = 0;
    static scoreBox = 0;
    static timerBox = 0;

    static gameStop: boolean = false;

    static srcManager: GameManager = null!;
}

