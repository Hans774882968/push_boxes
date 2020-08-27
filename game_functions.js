"use strict";

import {Man} from "./man.js";

/*
空地 0
墙 1
箱子 2
人物 3
目的地 4
箱子推到目的地 2+4-->6
人可以站在目的地上 3+4-->7
*/
let isWall = function(val){return val === 1;};

let isBox = function(val){return val === 2 || val === 6;};

let isMan = function(val){return val === 3 || val === 7;};

let isAim = function(val){return val === 4 || val === 6 || val === 7;};

function Game(){
    if(arguments.length === 0) return;
    this.maps = [
        [
            [0,1,3,2,0,0,0,0,0,4,0,0,0,1,0],
            [0,1,0,2,0,0,0,0,0,4,0,0,0,1,0]
        ],
        [
            [1,1,1,1,1,0,0,0,0],
            [1,3,0,0,1,0,0,0,0],
            [1,0,2,2,1,0,1,1,1],
            [1,0,2,0,1,0,1,4,1],
            [1,1,1,0,1,1,1,4,1],
            [0,1,1,0,0,0,0,4,1],
            [0,1,0,0,0,1,0,0,1],
            [0,1,0,0,0,1,1,1,1],
            [0,1,1,1,1,1,0,0,0],
        ],
        [
            [0,0,0,1,1,1,1,1,1,1,0,0,0],
            [1,1,1,1,0,0,0,0,0,1,0,0,0],
            [1,0,0,0,4,1,1,1,0,1,0,0,0],
            [1,0,1,0,1,0,0,0,0,1,1,0,0],
            [1,0,1,0,2,0,2,1,4,0,1,0,0],
            [1,0,1,0,0,6,0,0,1,0,1,0,0],
            [1,0,4,1,2,0,2,0,1,0,1,0,0],
            [1,1,0,0,0,0,1,0,1,0,1,1,1],
            [0,1,0,1,1,1,4,0,0,0,0,0,1],
            [0,1,0,0,0,0,0,1,1,0,0,3,1],
            [0,1,1,1,1,1,1,1,1,1,1,1,1]
        ]
    ];
    this.lv = arguments[0];
    this.steps = 0;
    this.mapp = this.maps[this.lv - 1];
    this.cellSize = "55px";
    this.R = this.mapp.length;
    this.C = this.mapp[0].length;
    this.man = new Man();
    this.aims = [];
    for(let r = 0;r < this.mapp.length;++r){
        for(let c = 0;c < this.mapp[r].length;++c){
            let val = this.mapp[r][c];
            if(isAim(val)) this.aims.push([r,c]);
            if(isMan(val)){
                this.man.X = r;
                this.man.Y = c;
            }
        }
    }
}

Game.prototype.updateCell = function(x,y){
    $(`.cell[data-row=${x}][data-col=${y}]`).css("background-image",this.getBgOfCell(this.mapp[x][y]));
    $(`.cell[data-row=${x}][data-col=${y}]`).css("animation","");
};

Game.prototype.isIllegalPos = function(x,y){
    return x < 0 || y < 0 || x >= this.R || y >= this.C || isWall(this.mapp[x][y]);
};

/*
分2种情况：
1-(nx,ny)不是box：已经保证不是wall故可以走
2-是box：合法且不是wall、box
*/
Game.prototype.boxCanNotMove = function(bx,by,cellsShouldChange){
    if(cellsShouldChange != 3) return false;
    return this.isIllegalPos(bx,by) || isBox(this.mapp[bx][by]);
}

Game.prototype.updateDataMapp = function(x,y,nx,ny,bx,by,cellsShouldChange){
    this.mapp[x][y] -= 3;
    this.mapp[nx][ny] += 3;
    if(cellsShouldChange === 3){
        this.mapp[nx][ny] -= 2;
        this.mapp[bx][by] += 2;
    }
};

Game.prototype.manMove = function(dx,dy,direction){
    let x = this.man.X,y = this.man.Y;
    let nx = x + dx,ny = y + dy;
    if(this.isIllegalPos(nx,ny)) return 0;
    let bx = nx + dx,by = ny + dy;
    let cellsShouldChange = isBox(this.mapp[nx][ny]) ? 3 : 2;
    if(this.boxCanNotMove(bx,by,cellsShouldChange)) return 0;
    //同步数据
    this.updateDataMapp(x,y,nx,ny,bx,by,cellsShouldChange);
    [this.man.X,this.man.Y,this.man.direction] = [nx,ny,direction];
    //同步类名
    $(".man-pos").attr("class","cell");
    $(`.cell[data-row=${nx}][data-col=${ny}]`).attr("class","cell man-pos");
    //同步DOM
    this.updateCell(x,y);
    this.man.setMyAction();
    if(cellsShouldChange === 3) this.updateCell(bx,by);//要改3个格子的情况
    return cellsShouldChange;
};

Game.prototype.updateSteps = function(num){
    this.steps += num;
    $(".steps").text(`步数：${this.steps}`);
}

Game.prototype.areWeWin = function(){
    for(let pos of this.aims){
        if(this.mapp[pos[0]][pos[1]] != 6) return false;
    }
    return true;
};

Game.prototype.clearGameInterface = function(){
    $("#game").empty();
    $("#game").css("grid-template-columns","");
    $("#game").css("width","");
}

Game.prototype.changeMenuStatus = function(status){
    if(status === "outOfGame"){
        $("#choose").css("display","flex");
        $("#menu").css("display","none");
    }
    else{
        $("#choose").css("display","none");
        $("#menu").css("display","flex");
    }
};

Game.prototype.getBgOfCell = function(val){
    let name = ["land","wall","boxYellow",undefined,"aim","land","boxRed",undefined][val];
    let iSrc = "";
    if(name) iSrc = `url(./images/${name}.jpg)`;
    return iSrc;
};

Game.prototype.getCell = function(row,col,val){
    let cell = document.createElement("div");
    cell.className = isMan(val) ? "cell man-pos" : "cell";
    cell.dataset.row = row;
    cell.dataset.col = col;
    cell.style.width = this.cellSize;
    cell.style.height = this.cellSize;
    if(!isMan(val)){
        cell.style.backgroundImage = this.getBgOfCell(val);//是人的位置则不用背景
    }
    return cell;
};

Game.prototype.init = function(){
    this.clearGameInterface();
    $("#game").css("grid-template-columns",`repeat(${this.C},${this.cellSize})`);
    $("#game").css("width",`calc(${this.cellSize} * ${this.C})`);
    for(let r = 0;r < this.mapp.length;++r){
        for(let c = 0;c < this.mapp[r].length;++c){
            $("#game").append(this.getCell(r,c,this.mapp[r][c]));
        }
    }
    this.man.setMyAction();
};

export {Game};