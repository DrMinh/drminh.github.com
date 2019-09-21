var KhoiTest={
	//Điểm
	_Point: function(x,y){
		this.x=x||0;
		this.y=y||0;
		this.ox=x||0;
		this.oy=y||0;
		this.setX=function(xc){
			this.ox=this.x;
			this.x=xc;
		}
		this.setY=function(yc){
			this.oy=this.y;
			this.y=yc;
		}
		this.setV=function(xc,yc){
			this.ox=this.x;
			this.oy=this.y;
			this.x=xc;
			this.y=yc;
		}
		//diemmau {x: tile width,y:tile height}
		this.numTile=function(diemmau){
			var se=this;
			return new KhoiTest._Point(Math.ceil(se.x/diemmau.x),Math.ceil(se.y/diemmau.y));
		}
	},
	//Đường, đoạn thẳng AB
	_Line: function(A,B){
		this.PA=A||new KhoiTest._Point();
		this.PB=B||new KhoiTest._Point();
		this.a=this.PB.y-this.PA.y;
		this.b=this.PA.x-this.PB.x;
		this.c=-this.a*(this.PA.x)-this.b*(this.PA.y);
		this.leng=function(){
			var v1=this.PB.x-this.PA.x,
				v2=this.PB.y-this.PA.y;
			return Math.sqrt(v1*v1+v2*v2);
		}
		this.hitLine=function(ort){
			var del=this.a*ort.b-ort.a*this.b; //Biến xét song song
			if(del==0)
				return false;
			else
			{
				var KQ=new KhoiTest._Point();
				KQ.x=(ort.c*this.b-this.c*ort.b)/del;
				KQ.y=(ort.a*this.c-this.a*ort.c)/del;
				return KQ;
			}
		}
		//Check điểm nằm trong đoạn thẳng: 0-điểm nằm ngoài, 1-điểm nằm trên đường chứa đoạn,2-điểm nằm trong đoạn
		this.hitPoint=function(P){
			var se=this;
			//kiểm tra điểm thuộc đường thẳng
			if(Math.round(this.a*P.x+this.b*P.y+this.c)!=0) return 0;
			//Kiểm tra thuộc đoạn thẳng (xét giới hạn x)
			if(P.x>Math.max(se.PA.x,se.PB.x)||P.x<Math.min(se.PA.x,se.PB.x))
				return 1;
			//Xác định!
			return 2;
		}
	},
	//Dốc nghiêng <<Một đoạn thẳng không song song trục x hoặc y>>
	_Slope: function(V,L,cwi,che,top){
		this.VT=V;
		this.Line=L;
		this.wi=cwi;
		this.he=che;
		this.top=top||0; //0 dưới 1 trên
	},
	//Gạch lát << Hình chữ nhật có width và height, không xoay >>
	_Tile: function(V,cwi,che){
		this.VT=V||new KhoiTest._Point(); //Vị trí
		this.wi=cwi;
		this.he=che;
		//Va chạm với điểm A
		this.hitPoint=function(A){
			if(A.x<this.VT.x||A.x>this.VT.x+this.wi||A.y<this.VT.y||A.y>this.VT.y+this.he)
				return false;
			return true;
		}
		//Va chạm với gạch khác (Không xác định hướng)
		this.hitTile=function(Ti){
			var se=this; //Lấy đối tượng (tránh lỗi sai quy chiếu)
			var hitp=new KhoiTest._Tile(new KhoiTest._Point(se.VT.x-Ti.wi,se.VT.y-Ti.he),se.wi+Ti.wi,se.he+Ti.he);
			if(hitp.hitPoint(Ti.VT))
				return true;
			return false;
		}
		//Va chạm với gạch khác (tính hướng va chạm: 1-đầu, 2-đáy, 3-trái, 4-phải), this di chuyển, Ti đứng yên
		this.hitTileW=function(Ti,num){
			var se=this;
			num=num||new KhoiTest._Point();
			//Tạo vector di chuyển
			var vec=new KhoiTest._Point(se.VT.x-se.VT.ox,se.VT.y-se.VT.oy);
			//Trường hợp đứng yên, lấy vector đối làm vector di chuyển
			if(vec.x==0&&vec.y==0){
				vec.x=Ti.VT.ox-Ti.VT.x;
				vec.y=Ti.VT.oy-Ti.VT.y;
			}
			//đường di chuyển
			var lineD=new KhoiTest._Line(new KhoiTest._Point(se.VT.x-vec.x,se.VT.y-vec.y),se.VT);
			//Xét trường hợp
			//1
			if(vec.y>0){
				var lineH=new KhoiTest._Line(new KhoiTest._Point(Ti.VT.x-se.wi,Ti.VT.y-se.he),new KhoiTest._Point(Ti.VT.x+se.wi,Ti.VT.y-se.he));
				var pointR=lineH.hitLine(lineD);
				if(lineD.hitPoint(pointR)==2&&lineH.hitPoint(pointR)==2){
					num.setV(pointR.x,pointR.y);
					return 1;
				}
			}
			//2
			else if(vec.y<0){
				var lineH=new KhoiTest._Line(new KhoiTest._Point(Ti.VT.x-se.wi,Ti.VT.y+se.he),new KhoiTest._Point(Ti.VT.x+se.wi,Ti.VT.y+se.he));
				var pointR=lineH.hitLine(lineD);
				if(lineD.hitPoint(pointR)==2&&lineH.hitPoint(pointR)==2){
					num.setV(pointR.x,pointR.y);
					return 2;
				}
			}
			//3
			if(vec.x>0){
				var lineH=new KhoiTest._Line(new KhoiTest._Point(Ti.VT.x-se.wi,Ti.VT.y-se.he),new KhoiTest._Point(Ti.VT.x-se.wi,Ti.VT.y+se.he));
				var pointR=lineH.hitLine(lineD);
				if(lineD.hitPoint(pointR)==2&&lineH.hitPoint(pointR)==2){
					num.setV(pointR.x,pointR.y);
					return 3;
				}
			}
			//4
			else if(vec.x<0){
				var lineH=new KhoiTest._Line(new KhoiTest._Point(Ti.VT.x+se.wi,Ti.VT.y-se.he),new KhoiTest._Point(Ti.VT.x+se.wi,Ti.VT.y+se.he));
				var pointR=lineH.hitLine(lineD);
				if(lineD.hitPoint(pointR)==2&&lineH.hitPoint(pointR)==2){
					num.setV(pointR.x,pointR.y);
					return 4;
				}
			}
			//Không giao
			return false;
		}
		this.hitSlope=function(Ti){
			if(!this.hitTile(Ti)) return false;
			var se=this;
			//Tạo vector di chuyển
			var vec=new KhoiTest._Point(se.VT.x-se.VT.ox,se.VT.y-se.VT.oy);
			//Trường hợp đứng yên, lấy vector đối làm vector di chuyển
			if(vec.x==0&&vec.y==0){
				vec.x=Ti.VT.ox-Ti.VT.x;
				vec.y=Ti.VT.oy-Ti.VT.y;
			}
			//Tìm điểm giao
			var xp=0,yp=0,vecLine=new KhoiTest._Point(-Ti.Line.b,Ti.Line.a);
			if((vecLine.x*vecLine.y>0&&Ti.top)||(vecLine.x*vecLine.y<0&&!Ti.top))
				xp+=this.wi;
			if((vecLine.x*vecLine.y>0&&!Ti.top)||(vecLine.x*vecLine.y<0&&!Ti.top))
				yp+=this.he;
			var DiemG=new KhoiTest._Point(se.VT.x+xp,se.VT.y+yp);
			//đường di chuyển
			var lineD=new KhoiTest._Line(new KhoiTest._Point(DiemG.x-vec.x,DiemG.y-vec.y),DiemG);
			console.log(lineD);
			//Kiểm tra giao
			var pointR=lineD.hitLine(Ti.Line);
			console.log(pointR);
			if(pointR)
				if(lineD.hitPoint(pointR)==2&&Ti.Line.hitPoint(pointR)==2){
					var lineback=new KhoiTest._Line(new KhoiTest._Point(DiemG.x,0),DiemG); //đường phản xạ lại
					var pointback=lineback.hitLine(Ti.Line); //Điểm phản xạ lại
					return new KhoiTest._Point(se.VT.x,se.VT.y+pointback.y-DiemG.y);
				}
			return false;
		}
	}
}
var A=new KhoiTest._Line(new KhoiTest._Point(3,5),new KhoiTest._Point());
var B=new KhoiTest._Line(new KhoiTest._Point(2,0),new KhoiTest._Point(4,5));
var T1=new KhoiTest._Tile(new KhoiTest._Point(0,0),3,3);
var T2=new KhoiTest._Tile(new KhoiTest._Point(9,0),2,3);
var a=new KhoiTest._Point();
var CN=new KhoiTest._Tile(new KhoiTest._Point(-1,2),2,1);
var LO=new KhoiTest._Slope(new KhoiTest._Point(1,4),new KhoiTest._Line(new KhoiTest._Point(1,6),new KhoiTest._Point(5,4)),4,2,0);
CN.VT.setV(4,3);
console.log(CN.hitSlope(LO));
var TestT=new KhoiTest._Point(17,16);
console.log(TestT.numTile({x:15,y:15}));
///