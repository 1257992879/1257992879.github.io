var kill = 0;
var dead = 0;

//背景图随窗口大小缩放
$("body").css("width",window.innerWidth+"px").css("height",window.innerHeight+"px");
window.onresize = function () {
    $("body").css("width",window.innerWidth+"px").css("height",window.innerHeight+"px");
}

//创建僵尸计时器
var zombInterval = setInterval(function () {
    var index = parseInt(kill/20);
    if (index>3){index=3}

    var zomb;
    if (index===0){
        zomb = $('<img src="Exercise-打僵尸-File/zomb0.png" class="zomb">');
    }else if (index===1){
        zomb = $('<img src="Exercise-打僵尸-File/zomb1.png" class="zomb">');
    }else if (index===2){
        zomb = $('<img src="Exercise-打僵尸-File/zomb2.png" class="zomb">');
    }else {
        zomb = $('<img src="Exercise-打僵尸-File/zomb3.png" class="zomb">');
    }

    zomb.css("left",window.innerWidth+"px");
    zomb.css("top",Math.round(Math.random()*(window.innerHeight-144))+"px");
    $("body").append(zomb);

    //给创建的僵尸添加 鼠标移入 事件
    zomb.click(function () {
        zomb.remove();
        kill++;
        $("#kill").text("进入屋子的僵尸数: "+kill);
    })

},300);

//僵尸移动计时器
var moveInterval = setInterval(function (){
    $(".zomb").each(function () {
        $(this).css("left",parseInt($(this).css("left"))-1+"px")
        if (parseInt($(this).css("left"))<=100){
            $(this).remove();
            dead++;
            $("#dead").text("击败僵尸数: "+dead);
            if (dead>=20){
                if (confirm("游戏结束,是否继续?")){
                    location.reload();
                }else {
                    clearInterval(zombInterval);
                    $(".zomb").remove();
                    clearInterval(moveInterval);
                }
            }
        }
    })
},10);