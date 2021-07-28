    //todo 查询奖品列表，用简单的react的state属性实现
    //写错单词了，这里form就是拉取的奖品列表
    const form = document.getElementById("form");
    const getPrizeList = "https://qccbuf.fn.thelarkcloud.com/getPrizeList";
    const addPrize = "https://qccbuf.fn.thelarkcloud.com/addPrize";
    const deletePrize = "https://qccbuf.fn.thelarkcloud.com/deletePrize";

    const addItem = document.getElementById("addItem");//添加奖品按钮
    const addForm = document.getElementById("addForm");//这个是添加奖品的表单
    
    addItem.onclick = add;

    $.getJSON(getPrizeList,function(json){
            loadPrizelist(json);
        });
    
    function loadPrizelist(prize){
        prize.forEach((x,ind)=>{
            let tr = document.createElement("tr");
            form.appendChild(tr);

            let td1 = document.createElement("td");
            let td2 = document.createElement("td");
            let td3 = document.createElement("td");
            let btn = document.createElement("button");
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(btn);

            btn.setAttribute("name",x.name);
            btn.onclick = del;

            td1.innerHTML = x.name;
            td2.innerHTML = x.count;
            td3.innerHTML = x.level;
            btn.innerHTML = "删除";
        })
    }
    
    function del(){
        let name = this.getAttribute("name");
        let deleteData = JSON.stringify({"name":name});
        console.log(deleteData);
        $.ajax({
            type:"POST",
            async: false,
            url:deletePrize,
            data: deleteData,
            // data:delData,
            dataType:"text",
            success:(result)=>{
                alert(`奖品删除成功`);
                console.log(`成功：${result}`);
                $("tr:gt(0)").remove();
                $.getJSON(getPrizeList,function(json){
                    loadPrizelist(json);
                });
            },
            error:(e)=>{
                alert(`奖品删除失败`);
                console.log(`失败：${toString(e)}`);
            }
        })
    }

    function add(){
        //将表单数据转换成json格式
        console.log($('#addForm').serializeArray());
        let formdata = $('#addForm').serializeArray();
        let jsonObj = {};
        formdata.forEach((x)=>{
            jsonObj[x.name] = x.value;
        })

        $.ajax({
            type:"POST",
            async: false,
            url:addPrize,
            data: JSON.stringify(jsonObj),//将js对象转换成json格式的字符串
            success:(result)=>{
                alert(`奖品添加成功`);
                console.log(`成功：${result}`);
                $("tr:gt(0)").remove();
                $.getJSON(getPrizeList,function(json){
                    loadPrizelist(json);
                });
            },
            error:(e)=>{
                alert(`奖品添加失败`);
                console.log(`失败：${toString(e)}`);
            }
        })
    }