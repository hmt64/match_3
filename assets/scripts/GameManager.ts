import { _decorator, Component, Node, Color, Layout, Sprite } from 'cc';
const { ccclass, property } = _decorator;
import { GameGlobal } from './GameGlobal';
import { ItemColorBox } from './ItemColorBox';

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Color) colorBox: Color[] = [];
    @property(Color) colorDefault: Color = null!;

    @property(Node) panelButtonPlay: Node = null!;
    @property(Node) panelBox: Node = null!;

    @property(Node) prefabBox: Node = null!;
    @property(Node) prefabParentBox: Node = null!;

    @property(Node) dragBox: Node = null!;
    @property(Sprite) spriteBox: Sprite = null!;

    protected onLoad(): void {
        GameGlobal.srcManager = this;
    }

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

        for (let i = 0; i < GameGlobal.maxBox; i++) {
            let parentBox: Node = instantiate(this.prefabParentBox);
            let box: Node = instantiate(this.prefabBox);
            let boxScript: ItemColorBox = parentBox.getComponent(ItemColorBox);
            
            parentBox!.parent = this.panelBox;
            parentBox!.name = "parentBox_"+i.toString();
            box!.parent = parentBox;
            box!.name = "box_"+i.toString();

            boxScript.nodeBox = box!;
            boxScript.spriteBox = box.getComponent(Sprite)!;
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
            if(i == GameGlobal.colomX * (GameGlobal.listColumnLimit.length + 1) - 1) {
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
    }

    randomColor() {
        return Math.floor(Math.random() * this.colorBox.length);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

