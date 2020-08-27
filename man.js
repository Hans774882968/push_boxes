"use strict";

function Man(){
    this.X = -1;
    this.Y = -1;
    this.anime_duration = 1;
    this.direction = "Right";
}

//选择器是$(`.cell[data-row=${this.X}][data-col=${this.Y}]`)才能起作用，因为不同的选择器即使找到同一个元素，它们设置的同一css也是分开的。
Man.prototype.setMyAction = function(){
    $(".man-pos").css("animation",`Man${this.direction} ${this.anime_duration}s ease 0s infinite`);
    $(`.cell[data-row=${this.X}][data-col=${this.Y}]`).css("background-image","");
};

export {Man};