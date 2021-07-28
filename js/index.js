    //获取奖品列表
    const getPrizeList = "https://qccbuf.fn.thelarkcloud.com/getPrizeList";
    //抽取奖品
    const getPrize = "https://qccbuf.fn.thelarkcloud.com/getPrize";

    let prizeNameList = [];//奖品名
    let degStart = 0;//当前转盘度数
    let cat = 0;//每个奖品扇形占据的度数
    let canRoll = false;//是否能转

    let zhiZhen = document.getElementById("zhizhen");
    let zhuanPan = document.getElementById("zhuanpan");

    //向服务器获取奖品基本信息
    $.getJSON(getPrizeList,function(json){
        json.forEach(x => {
            prizeNameList.push(x['name']);
        });
        cat = 360/json.length;//每个奖品扇形占据的度数
        draw(prizeNameList)//获取奖品列表后初始化各项参数，以及转盘绘制
    });

    //指针的点击抽奖，如果可以转，就向服务器请求抽奖，然后转到抽中奖品的位置
    zhiZhen.onclick = function (){
        if(canRoll){
            $.getJSON(getPrize,function(json){
                roll(json['prizeIndex']);
            });
        }
    }

    // 绘制转盘
    function draw(prize){
        // 转盘绘制
        let chartDom = zhuanPan;
        let myChart = echarts.init(chartDom);
        let data = [];
        for(x of prize){
            let obj = {};
            obj.name = x;
            obj.value = 1;
            data.push(obj);
        }

        let option = {
            series: {
                type: 'sunburst',
                emphasis: {
                    focus: 'none'//无高亮显示
                },
                nodeClick: false,//无数据下钻
            }
        };
        option.series.data = data;//传入奖品数据

        myChart.setOption(option);//使用设定好的参数绘制
        canRoll = true;//绘制完成后放开转盘的旋转限制
    }

    function roll(index){
        canRoll = !canRoll;

        //转到对应位置后随机偏移的度数
        let rdm = Math.floor(Math.random() * 100) % cat;
        //随机偏转的圈数（5到6圈）
        let rdm1 = Math.floor(Math.random() * 10) % 2 + 5;

        //从0开始旋转到目标位置的总旋转度数
        let deg = rdm + rdm1*360 - (index+1)*cat;

        //记录下一次旋转位置 = 当前转盘所在位置 + 从0度开始旋转到目标需要的度数 - 当前转盘在一圈内多出来的度数（将转盘归为初始值） 
        //【该方法可能存在BUG，当用户转了太多次，度数过大的话是不是可能会溢出？类似ae中的time表达式。】
        degStart = degStart + deg - degStart % 360;

        //旋转到下一次旋转位置
        zhuanPan.style.transform = `rotate(${degStart}deg)`

        //旋转五秒钟结束后，显示抽奖结果，window.setTimeout(函数名，时延，...用于函数执行可能需要的可选参数)
        setTimeout(()=>{
            canRoll = !canRoll;//转完了
            alert(`恭喜获得奖品：${prizeNameList[index]}`)
        }, 5000);
    }