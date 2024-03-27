import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { GameManager } from './GameManager';

@ccclass('GameGlobal')
export class GameGlobal extends Component {
    static maxBox: number = 56;
    static colomX: number = 8;
    static colomY: number = 7;
    static listParentColorBox: Node[] = [];
    static listColorBox: Node[] = [];
    static listScriptColorBox: Node[] = [];

    static listFirstRaw: any;
    static listColumnLimit: number[] = [];
    static listRawLimit: number[] = [];
    static listAllRow: any[] = [];
    static listAllColumn: any[] = [];

    static widthBox = 85;
    static heightBox = 85;

    static srcManager: GameManager = null!;
}

