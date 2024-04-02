import { _decorator, Component, Node, Color, Layout, Sprite, instantiate, Label, CCInteger, Game } from 'cc';
const { ccclass, property } = _decorator;
import { GameGlobal } from './GameGlobal';
import { ItemColorBox } from './ItemColorBox';
import { GameRules } from './GameRules';

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Color) colorBox: Color[] = [];
    @property(Color) colorDefault: Color = null!;

    @property(Node) panelButtonPlay: Node = null!;
    @property(Node) panelBox: Node = null!;

    @property(Node) nodeButtonPlay: Node = null!;
    @property(Node) nodeButtonReload: Node = null!;
    @property(Node) nodeLabelHi: Node = null!;
    @property(Node) nodeLabelCurrent: Node = null!;

    @property(Node) prefabBox: Node = null!;
    @property(Node) prefabParentBox: Node = null!;

    @property(Node) dragBox: Node = null!;
    @property(Sprite) spriteBox: Sprite = null!;

    @property(Label) labelValueScore: Label = null!;
    @property(Label) labelValueTimer: Label = null!;
    @property(Label) labelValueHiScore: Label = null!;
    @property(Label) labelValueCurrentScore: Label = null!;

    @property(CCInteger) timerNumber: number = 0;

    totalTime : number = 0;

    callbackScheduleTime: any;
    callbackCheckGame: any;

    protected onLoad(): void {
        GameGlobal.srcManager = this;
        GameGlobal.gameStop = false;
        this.totalTime = this.timerNumber;
        
    }

    // protected start(): void {
    //     this.countDonwTimer();
    // }

    onPlayGame() {
        this.panelButtonPlay.active = false;
        this.createGridBox();
    }

    createGridBox() {
        this.panelBox.removeAllChildren();
        let arrRow = [];
        let arrColumn = [];

        GameGlobal.listFirstRaw = [];
        for (let i = 0; i < GameGlobal.colomX; i++) {
            GameGlobal.listFirstRaw.push(i);
        }
        console.log(GameGlobal.listFirstRaw)
        for (let i = 0; i < GameGlobal.maxBox; i++) {
            let parentBox: Node = instantiate(this.prefabParentBox);
            let box: Node = instantiate(this.prefabBox);
            let boxScript: ItemColorBox = parentBox.getComponent(ItemColorBox);
            
            parentBox!.parent = this.panelBox;
            parentBox!.name = "parentBox_"+i.toString();
            box!.parent = parentBox;
            box!.name = "box_"+i.toString();

            boxScript.nodeBox = box!;
            boxScript.spriteBox = box!.getComponent(Sprite)!;
            boxScript.idColor = this.randomColor();
            boxScript.spriteBox.color = this.colorBox[boxScript.idColor];
            boxScript.idBox = i;

            boxScript.startEvent();
            boxScript.getSidePos();

            setTimeout(() => {
                boxScript.getDefaultPos();
            }, 20);

            GameGlobal.listParentColorBox.push(parentBox);
            GameGlobal.listColorBox.push(box);
            GameGlobal.listScriptColorBox.push(boxScript);

            arrRow.push(i);
            if(i == GameGlobal.colomX * (GameGlobal.listColumnLimit.length + 1) - 1) { //7,15,23,3,39,47,55
                GameGlobal.listColumnLimit.push(i);
                GameGlobal.listAllRow.push(arrRow);
                arrRow = [];
            }

            if (i == GameGlobal.maxBox - (GameGlobal.colomX - GameGlobal.listRawLimit.length)) {
                arrColumn = [];
                arrColumn.push(i);
                for (let aix = 1; aix < GameGlobal.colomY; aix++) {
                    arrColumn.push(i - (GameGlobal.colomX * aix));
                }

                GameGlobal.listRawLimit.push(i);
                GameGlobal.listAllColumn.push(arrColumn);
            }
        }

        setTimeout(() => {
            this.runGameRules();
            // this.countDownTimer();
        },20*GameGlobal.maxBox);
    }

    randomColor() {
        return Math.floor(Math.random() * this.colorBox.length);
    }

    runGameRules() {
        setInterval(() => {
            if (GameGlobal.gameStop) return;
            GameRules.checkGameRules();
        },100);
    }

    countDownTimer() {
        this.labelValueTimer.string = this.timerNumber.toString();
        

        this.callbackScheduleTime = () => {
            this.timerNumber--;
            this.labelValueTimer.string = this.timerNumber.toString();
            if (this.timerNumber == 0) {
                this.unschedule(this.callbackScheduleTime);
                this.winGanme();
            }
        }

        this.schedule(this.callbackScheduleTime, 1);
    }

    winGanme() {
        GameGlobal.gameStop = true;
        this.panelButtonPlay.active = true;
        this.nodeButtonReload.active = false;
        this.nodeLabelHi.active = true;
        this.nodeButtonReload.active = true;
        // this.nodeLabelCurrent.active = true;

        this.labelValueHiScore.string = GameGlobal.highScoreBox.toString();
        // this.labelValueCurrentScore.string = GameGlobal.scoreBox.toString();

        if (GameGlobal.highScoreBox > GameGlobal.scoreBox) {
            GameGlobal.highScoreBox = GameGlobal.scoreBox;
        }

        this.clearGame();
    }

    clearGame() {
        clearInterval(this.callbackCheckGame);
        GameGlobal.scoreBox = 0;
        this.labelValueScore.string = "";

        for (let boxScript of GameGlobal.listScriptColorBox) {
            boxScript.idColor = -1;
            boxScript.spriteBox.color = GameGlobal.srcManager.colorDefault;
        }
    }

    onReloadGame() {
        GameGlobal.gameStop = false;
        this.panelButtonPlay.active = false;

        this.timerNumber = this.totalTime;
        for (let boxScript of GameGlobal.listScriptColorBox) {
            boxScript.idColor = -1;
            boxScript.spriteBox.color = GameGlobal.srcManager.colorDefault;
        }
    }
}