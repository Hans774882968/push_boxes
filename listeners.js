"use strict";

import {Man} from "./man.js";
import {Game} from "./game_functions.js";

let game = undefined;

//通关、点击返回键时，游戏结束，此时需要清空game元素、停止bgm
let gameEnd = function(){
    game.changeMenuStatus("outOfGame");
    game.clearGameInterface();
    $("#bgm")[0].pause();
    $("#bgm")[0].currentTime = 0;
}

$("#menu .return").click(gameEnd);

$("#menu .restart").click(function(){
    game = new Game(game.lv);
    game.init();
    game.updateSteps(0);
    game.changeMenuStatus("inGame");
});

$("#menu .mute").click(function(){
    $("audio").each(function(){
        this.muted = !this.muted;
    });
    $(this).text($(this).text() === "🔈" ? "🔇" : "🔈");
});

$("body").keydown(function(event){
    let suc = false;
    if(event.keyCode === 37 || event.keyCode === 'A'.charCodeAt()) suc = game.manMove(0,-1,"Left");//l
    if(event.keyCode === 38 || event.keyCode === 'W'.charCodeAt()) suc = game.manMove(-1,0,"Up");//u
    if(event.keyCode === 39 || event.keyCode === 'D'.charCodeAt()) suc = game.manMove(0,1,"Right");//r
    if(event.keyCode === 40 || event.keyCode === 'S'.charCodeAt()) suc = game.manMove(1,0,"Down");//d
    if(suc) game.updateSteps(1);
    if(suc === 3){
        $("#box-move")[0].currentTime = 0;
        $("#box-move")[0].play();
    }
    if(game.areWeWin()){
        alert("你赢了！恭喜！");
        gameEnd();
    }
});

$(".game-level").click(function(){
    game = new Game($(this).text());
    game.init();
    game.updateSteps(0);
    game.changeMenuStatus("inGame");
    $("#bgm")[0].play();
});