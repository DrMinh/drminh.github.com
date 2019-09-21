$(document).ready(function() {
	gameOJ.setval();
	gameOJ.loadMC.nowload([0,1,2,3,4,5,6,7,8],function(){
		//gameOJ.stage.removeAllChildren();
		gameOJ.changeTT(1);
	},0);
	/* function(){
		gameOJ.stage.removeAllChildren();
		gameOJ.TextMC=new TextE.Make(gameOJ.loadMC.getAsset("TextBoxy"),gameOJ.loadMC.getAsset("FontBoxy"),{x:9,y:8},0);
		var anh=new createjs.Bitmap(gameOJ.loadMC.getAsset("Tmap1"));
		var A=gameOJ.TextMC.SpiteText("Text is wtf 12039487749 lmsc WAITING... LOADING... FUCKING... > < > < ? HELLO BABY SHIT HEO",100,{x:18,y:16});
		A.x=50;
		A.y=50;
		gameOJ.stage.addChild(anh,A);
		},0); */
});