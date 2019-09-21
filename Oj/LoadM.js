function LoadMe(){
	var se=this;
	this.loadwork=new createjs.LoadQueue(true);
	this.openload=ContainerR(); //simple load screen
	this.openload.addChild(
		new createjs.Shape(new createjs.Graphics().beginFill("#AAAAAA").drawRect(0, 0, _GameW,_GameH/8))
	);
	
	this.handleFileLoad=function(event){
		if(event.item.id == "loading"){
			console.log("loading is loaded");
			//create bitmap here
			var data = {
				images: [_DataGame.loadwork.getResult("loading")],
				frames: {width:400, height:300},
				animations: {
					load: [0,1,'load',0.1]
				}
			};
			var animation = new createjs.Sprite(new createjs.SpriteSheet(data), "load");
			animation.y=se.openload.getChildAt(0).y+_GameH/8;
			animation.x=(_GameW-400)/2;
			se.openload.addChild(animation);
		}
	}
	this.loadError=function(evt){
		console.log("Error!",evt.text);
	}
	this.handleFileProgress=function(event){
		se.openload.getChildAt(0).x=(se.loadwork.progress*_GameW)-_GameW;
		console.log(((se.loadwork.progress*_GameW))+"%",_GameW,(se.loadwork.progress*_GameW)-_GameW);
		//stage.update();
	}
	this.loadStart=function(){
		se.openload.getChildAt(0).y=_GameH/2-100;
		se.openload.getChildAt(0).x=-_GameW;
		stage.addChild(se.openload);
	}
	this.loadgo=function(datalist,whenend){
		this.loadwork.on("complete",whenend);
		this.loadwork.loadManifest(dataall);
	}
	
	//Cài đặt loadwork
	this.loadwork.installPlugin(createjs.Sound);
	this.loadwork.on("fileload",se.handleFileLoad);
	this.loadwork.on("progress",se.handleFileProgress);
	this.loadwork.on("error",se.loadError);
	this.loadwork.on("loadstart",se.loadStart);
}

function LoadMi(t){
	//Biến trỏ đối tượng
	var se=this;
	//Kiểu tải
	this.loadstyle=0;
	//Trò chơi được nạp vào
	this.gameIn=t;
	//Asset
	this.asset=t.asset;
	//Biến preload
	this.loadQ=new createjs.LoadQueue(true);
	//khung đồ họa
	this.canv=t.Fitcon();
	//Các method
	this.stepload=function(e){
		if(se.loadstyle==0){
			se.canv.getChildAt(0).y=se.gameIn.gameH/4;
			se.canv.getChildAt(0).x=se.loadQ.progress*se.gameIn.gameW-se.gameIn.gameW;
			console.log(se.loadQ.progress*se.gameIn.gameW-se.gameIn.gameW);
		}
	}
	this.makelist=function(listid){
		var listload=[];
		for(var i=0;i<listid.length;i++)
			listload.push(se.asset[i]);
		return listload;
	}
	this.nowload=function(listid,finevent,style){
		this.loadstyle=style;
		var listload=this.makelist(listid);
		this.canv.removeAllChildren;
		this.gameIn.stage.addChild(se.canv);
		if(style==0){
			this.canv.addChild(
				new createjs.Shape(new createjs.Graphics().beginFill("#000000").drawRect(0,0, se.gameIn.gameW,se.gameIn.gameH/8))
			);
		}
		this.loadQ.on("complete",finevent);
		this.loadQ.loadManifest(listload);
	}
	this.getAsset=function(id){
		return this.loadQ.getResult(id);
	}
	//Cài đặt loadQ
	this.loadQ.installPlugin(createjs.Sound);
	this.loadQ.on("progress",se.stepload);
}