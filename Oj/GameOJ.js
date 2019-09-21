var gameOJ={
	stage: null,
	loadMC: null,
	asset: null,
	textMC: null,
	gameMap: null, //Map đang chơi
	gameW: 0,
	gameH: 0,
	gameSW: 0,
	gameSH: 0,
	gameTT: 0, //Trạng thái game: 0-loading 1-Menu 2-Chọn bảng đồ 3-Đang chơi
	gameNN: 0, //Số đếm trò chơi
	setval: function(){
		//stage
		gameOJ.stage=new  createjs.Stage("demoCanvas");
		gameOJ.stage.snapToPixelEnabled=true;
		//gameOJ.stage.canvas.width=window.innerWidth;
		//gameOJ.stage.canvas.height=window.innerHeight;
		//Màn hình
		gameOJ.gameH=300;
		gameOJ.gameW=400;
		gameOJ.gameSH=gameOJ.stage.canvas.height/gameOJ.gameH;
		gameOJ.gameSW=gameOJ.stage.canvas.width/gameOJ.gameW;
		gameOJ.stage.scaleX=gameOJ.gameSW;gameOJ.stage.scaleY=gameOJ.gameSH;
		//List tải
		gameOJ.asset=[
			{src:"./Asset/Boxy-Bold.ttf", id:"fontne", type:"font"},
			{src:"./Asset/fontchuan.png", id:"FontBoxy"},
			{src:"./Asset/boxy_bold_fat.txt", id:"TextBoxy"},
			{src:"./Asset/NhanVat.png", id:"NhanVat"},
			{src:"./Asset/Tmap1.png", id:"Tmap1"},
			{src:"./Asset/LogoBG.png", id:"LogoBG"},
			{src:"./Asset/MenuList.png", id:"MenuList"},
			{src:"./Asset/Tmap1.png", id:"Tmap1"},
			{src:"./MapD/demo.json", id:"M_demo"}
		];
		//biến tải
		gameOJ.loadMC=new LoadMi(gameOJ);
		//Tick event
		createjs.Ticker.addEventListener("tick", gameOJ.tick);
		//createjs.Ticker.timingMode=createjs.Ticker.RAF_SYNCHED;
		createjs.Ticker.timingMode=createjs.Ticker.RAF;
		//createjs.Ticker.framerate = 60;
		//
		//Ngăn ảnh bị nhòe
		var canvas = document.getElementById('demoCanvas');
		var ctx = canvas.getContext('2d');
		ctx.imageSmoothingEnabled = false;
	},
	Fitcon: function(){
		var newcon=new createjs.Container();
		newcon.scaleX=gameOJ.gameSW;
		newcon.scaleY=gameOJ.gameSH;
		return newcon;
	},
	changeTT: function(num){
		gameOJ.gameTT=num;
		gameOJ.gameNN=0;
	},
	//Camera
	Camera: function(cx,cy,cmx,cmy){
		this.x=cx;
		this.y=cy;
		this.maxX=cmx.x;
		this.minX=cmx.y;
		this.maxY=cmy.x;
		this.minY=cmy.y;
		this.moveto=function(cx,cy){
			this.x=cx;
			this.y=cy;
			if(cx<this.minX) this.x=this.minX;
			if(cx>this.maxX) this.x=this.maxX;
			if(cy<this.minY) this.y=this.minY;
			if(cy<this.maxY) this.y=this.maxY;
		}
	},
	//csTile {x : chiều wi tile map,y: he, ox: max wi,oy: max he}
	TaoCanh: function(csoTile){
		this.TileMap=gameOJ.loadMC.getAsset("Tmap1");
		this.soTile=csoTile;
		this.TaoHitL=function(trungtam){
			var se=this;
			var diemBD=trungtam.numTile(se.soTile);
			var minX=Math.max(diemBD.x-20,0),maxX=Math.min(diemBD.x+20,se.soTile.ox);
			var minY=Math.max(diemBD.y-20,0),maxY=Math.min(diemBD.y+20,se.soTile.oy);
			
		}
	},
	//Tick
	tick: function(){
		/* var Acm=gameOJ.TextMC.SpiteText("Haha",500);
		Acm.x=Math.floor(Math.random() * 500) + 50;
		Acm.y=Math.floor(Math.random() * 500) + 50;
		gameOJ.stage.addChild(Acm); */
		if(gameOJ.gameTT==1)
			gameOJ.tickMenu();
		else if(gameOJ.gameTT==3)
			gameOJ.tickPlay();
		gameOJ.stage.update();
	},
	tick_0: function(){
		console.log("tick 0");
	},
	tickMenu: function(){
		if(gameOJ.gameNN==0){
			gameOJ.stage.removeAllChildren();
			//Tạo logo
			var Logo=new createjs.Bitmap(gameOJ.loadMC.getAsset("LogoBG"));
			Logo.x=gameOJ.gameW/2-90; //90 là nữa wi ảnh
			Logo.y=43; //trong thiết kế
			Logo.visible=true;
			//Tạo nút
			console.log(gameOJ.loadMC.getAsset("MenuList"));
			var NutSheet=new createjs.SpriteSheet({images: [gameOJ.loadMC.getAsset("MenuList")],frames: {width:80, height:40}});
			var Nut=[5],ChuaNut=new createjs.Container();
			var Lenh=[0,0,3,0,0];
			for(var i=0;i<5;i++){
				Nut[i]=new createjs.Sprite(NutSheet);
				Nut[i].gotoAndStop(i);
				Nut[i].Lenh=Lenh[i];
				Nut[i].hitArea=new createjs.Shape(new createjs.Graphics().beginFill("#000000").drawRect(0, 0, 80, 40));
				var evNut=function(evt){gameOJ.changeTT(evt.currentTarget.Lenh);};
				Nut[i].on("click",evNut);
			}
			ChuaNut.x=gameOJ.gameW/2-40;ChuaNut.y=111;
			Nut[2].y=45;Nut[0].y=90;
			ChuaNut.addChild(Nut[0],Nut[1],Nut[2]);
			
			gameOJ.stage.addChild(Logo,ChuaNut);
			gameOJ.gameNN++;
		}
		console.log("tick 1");
	},
	tickPlay: function(){
		if(gameOJ.gameNN==0){
			gameOJ.stage.removeAllChildren();
			gameOJ.gameMap=new gameOJ.MapPlay(gameOJ.loadMC.getAsset("M_demo"));
			gameOJ.gameMap.updateMapc(new KhoiTest._Point(500,40));
		}
		console.log("tick play");
		gameOJ.gameMap.updateMapc(new KhoiTest._Point(500+gameOJ.gameNN,40));
		gameOJ.gameMap.layHitL.x--;gameOJ.gameMap.layBack1.x--;
		gameOJ.gameNN++;
	},
	//Đối tượng game
	MapPlay: function(cMapData){
		var se=this;
		//createjs layer
		this.layHitL=new createjs.Container();
		this.layBack1=new createjs.Container();
		gameOJ.stage.addChild(se.layBack1,se.layHitL);
		//
		this.MapData=cMapData;
		this.HitL=[]; //layer HitL
		this.Back1=[]; //layer Back1
		//this.Khoitai=[];
		this.cam=gameOJ.Camera(0,0,cMapData.width*32,cMapData.height*32);
		this.loadV=new KhoiTest._Point(-40,0); //Đơn vị tile
		this.loadV.setV(0,0); //Di Chuyển ảo
		//Dữ liệu ảnh
		var data= {
			images: [gameOJ.loadMC.getAsset("Tmap1")],
			frames: {width: 32, height:32}
		};
		this.Tilesheet=new createjs.SpriteSheet(data);
		//
		
		//cV: Đối tượng trung tâm
		this.updateMapc=function(cV){
			var Cpoint=cV.numTile({x:32,y:32});
			var Vuong=new KhoiTest._Tile(new KhoiTest._Point(Math.max(0,Cpoint.x-20),Math.max(0,Cpoint.y-20)),Math.min(se.MapData.width,Cpoint.x+20),Math.min(se.MapData.height,Cpoint.y+20));
			console.log(Cpoint,Vuong);
			for(var i=Vuong.VT.x;i<Vuong.VT.x+Vuong.wi;i++)
				for(var j=Vuong.VT.y;j<Vuong.VT.y+Vuong.he;j++){
					//Update Back1
				 	if(typeof this.Back1[i+j*se.MapData.width]=== "undefined"){
						if(se.MapData.layers[0].data[i+j*se.MapData.width]==0)
							this.Back1[i+j*se.MapData.width]=null;
						else{
							console.log(se.MapData.layers[1].data[i+j*se.MapData.width]);
							this.Back1[i+j*se.MapData.width]=new gameOJ.DatTile(new KhoiTest._Point(32*i,32*j),32,32,se.MapData.layers[0].data[i+j*se.MapData.width],se.Tilesheet);
							this.layBack1.addChild(se.Back1[i+j*se.MapData.width].DoHoa);
						}
					} 
					//Update HitL
					if(typeof this.HitL[i+j*se.MapData.width]==="undefined"){
						if(se.MapData.layers[1].data[i+j*se.MapData.width]==0)
							this.HitL[i+j*se.MapData.width]=null;
						else{
							console.log(se.MapData.layers[1].data[i+j*se.MapData.width],i,j);
							this.HitL[i+j*se.MapData.width]=new gameOJ.DatTile(new KhoiTest._Point(32*i,32*j),32,32,se.MapData.layers[1].data[i+j*se.MapData.width],se.Tilesheet);
							this.layHitL.addChild(se.HitL[i+j*se.MapData.width].DoHoa);
						}
					}
				}
		}
		/* this.updateMap=function(){
			if(se.loadV.x!=se.loadV.ox){
				var Vx=(se.loadV.x>se.loadV.ox)? se.loadV.ox+se.MapData.width:se.loadV.x;
				var Vy=se.loadV.oy;
				//var 
			}
		}
		this.loadQ=function(Vuong){
			for(var i=Vuong.VT.x;i<Vuong.VT.x+Vuong.wi;i++)
				for(var j=Vuong.VT.y;i<Vuong.VT.y+Vuong.he;j++){
					//Tải HitL
					this.HitL[i+j*se.MapData.width]=gameOJ.DatTile(KhoiTest._Point(0,0),32,32,se.MapData.layers.data[i+j*se.MapData.width],se.Tilesheet);
					stage.addChild(se.HitL[i+j*se.MapData.width].DoHoa);
				}
		} */
	},
	NguoiChoi: function(V){
		//Thuoc tinh
		this.HitBox=new KhoiTest._Tile(V,17,28);
		this.DoHoa=new createjs.Container();
		this.DoHoa.x=V.x,this.DoHoa.y=V.y;
		//Phương thức
		this.Move=function(cx,cy){
			this.HitBox.V.x=this.DoHoa.x=cx;
			this.HitBox.V.y=this.DoHoa.y=cy;
		}
	},
	DatTile: function(V,cwi,che,cidmap,csheet){
		//this.HitBox=new KhoiTest._Tile(V,cwi,che);
		this.DoHoa=new createjs.Container();
		this.DoHoa.x=V.x,this.DoHoa.y=V.y;
		//
		var tile=new createjs.Sprite(csheet);
		tile.gotoAndStop(cidmap-1);
		this.DoHoa.addChild(tile);
	},
}