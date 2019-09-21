var TextE={
	VT: function(cx,cy,cw,ch){
		this.x=parseInt(cx);
		this.y=parseInt(cy);
		this.w=parseInt(cw);
		this.h=parseInt(ch);
	},
	Make: function(ctext,cimage,cwh,op){
		var se=this;
		//Kích thước
		this.Size=cwh;
		//Danh sách cắt
		this.splitL=[];
		var textV=ctext.split('\n');
		for(var i=1;i<textV.length;i++){
			var textD=textV[i].split(' ');
			this.splitL[textD[0]]=new TextE.VT(textD[3]||0,textD[4]||0,textD[1],textD[2]);
		}
		//Dữ liệu ảnh
		var data= {
			images: [cimage],
			frames: {width:cwh.x, height:cwh.y}
		};
		this.Sheet=new createjs.SpriteSheet(data);
		//Tạo chữ
		this.SpiteText=function(VB,MaxL,fontSize){
			fontSize= typeof fontSize !== 'undefined' ? fontSize : se.Size;
			//Tạo chữ
			var Gvb=new createjs.Container();
			var contro={x:0,y:0};
			var VBp=VB.split("");
			var Space=-1,Spacet=0;
			for(var i=0,j=0;i<VBp.length;i++,j++){
				if(contro.x>=MaxL-this.Size.x){
					contro.x=0;
					contro.y+=this.Size.y;
					j=0;
					if(VBp[i]==" "||Space==-1){
						console.log("AAAAAAAAAAAAAAAA!");
						Spacet++;
						Space=-1;
						j--;
						continue;
					}
					for(var lo=Space-Spacet+1;lo<i-Spacet;lo++){
						console.log(lo,VBp[lo+Spacet+1]);
						Gvb.getChildAt(lo).x=contro.x-j;
						Gvb.getChildAt(lo).y=contro.y;
						contro.x+=this.splitL[VBp[lo+Spacet]].w;
						j++;
					}
					Space=-1;
				}
				if(VBp[i]==" "){
					contro.x+=Math.floor(se.Size.x/2);
					Space=i;
					Spacet++;
					console.log(Space);
					continue;
				}
				var onChar= new createjs.Sprite(se.Sheet);
				onChar.gotoAndStop(VBp[i].charCodeAt(0)-32);
				onChar.x=contro.x-j;
				onChar.y=contro.y;
				console.log(VBp[i],i,j);
				contro.x+=this.splitL[VBp[i]].w;
				Gvb.addChild(onChar);
			}
			Gvb.cache(0,0,i*se.Size.x,(contro.y+1)*se.Size.y);
			var outA=new createjs.Bitmap(Gvb.cacheCanvas);
			outA.scaleX=fontSize.x/se.Size.x;
			outA.scaleY=fontSize.y/se.Size.y;
			return outA;
		}
	}
}