
function Run(id) {
	this.oParent = document.getElementById(id); 
	this.landmarks = [];  
	this.startTime = new Date();
  this.leapBtn = true;
  this.flag = true;
  
}

Run.prototype.init = function (mainName){   
	this.createCharacter(mainName);
}

Run.prototype.createCharacter = function(mainName) {
	 this.character = document.createElement('div'); 

	this.character.className = mainName;
	this.oParent.appendChild(this.character);

	var that = this;

	this.origin = this.character.offsetTop;
  this.target = this.origin -100;
	addEvent(this.oParent,'touchend',that.leap(that.character));
}



Run.prototype.leap = function(boy){
  
  var that = this;
  var speed = 7;
   var timer = null; 
  return function (){
if(that.flag) {

    that.flag=false;    
 	 timer=setInterval(function(){	
   
    if(that.leapBtn){
       boy.style.top=boy.offsetTop-speed+'px';
  			if(boy.offsetTop <= that.target){
  				  that.leapBtn = false;
  	 		}
      } else {
        
        boy.style.top=boy.offsetTop+speed+'px';
  	 			if(boy.offsetTop >= that.origin){
             that.leapBtn = true;
  	 				clearInterval(timer);
            that.flag = true;
  	 			}
  	 		}
  		
  	},30);  }

  }

}
Run.prototype.createBarry = function() {
	 var that = this;

	 var  pageY = window.innerHeight/10;
        if(typeof  pageY != "number"){
            pageY = document.documentElement.clientHeight/10;

        }else{
            pageY = document.body.clientHeight/10;
        }
        Y = pageY * 0.5;
        var barrColor = ['#f88dab', '#8db5f8', '#83e998', '#fff775'];//存储障碍物颜色



	  	 var tim = function(){
	  	 	clearInterval(tim);
            var oBarry = document.createElement('div');
            oBarry.className = 'barry';
            oBarry.style.width = that.rnd(1, 3) + 'rem';
            oBarry.style.height = that.rnd(2, 5) + 'rem';
            oBarry.style.borderRadius = that.rnd(1, 2) + 'rem';
            oBarry.style.top = that.rnd(Y * 0.15, Y * 0.4) + 'rem';
            var i = that.rnd(0, 5);
            oBarry.style.backgroundColor = barrColor[i];

            that.oParent.appendChild(oBarry);
            startMove(oBarry, that.character, {left:-40}, function(){
                oBarry.parentNode.removeChild(oBarry);
            });
        }
        setInterval(tim,2000);
        clearInterval(tim);           
    }

Run.prototype.rnd = function(min, max){
            return (Math.floor(Math.random() * (max - min)) + min);
        }
Run.prototype.createlandmark = function (){
    var that = this;
    this.lanwidth = [18,17,18,22,36];
   	setInterval(_newLM(that),500);
    function _newLM(that){
       return function(){
         that.newLM();
       };
    };
}

Run.prototype.newDiv = function(obj){

		var that =this;
	   var odiv = document.createElement('div');
	   var oImg = document.createElement('img'); 

	   odiv.className='landmark';


	   oImg.src = 'images/landmark.png';
	   oImg.style.left = -obj.left + "px";

	   odiv.style.width = obj.width + "px";
	   odiv.style.left = obj.x + "rem"; 
       
	   odiv.appendChild(oImg);
	   this.oParent.appendChild(odiv);
   
       startMove(odiv,that.character,{left:-obj.width*16},function(){//运动结束后清除
          that.landmarks.shift();
          odiv.parentNode.removeChild(odiv);       
       });
       //
	   return odiv;
      // this.oParent.appendChild(odiv);

	}
    

Run.prototype.randomLM = function(range,first){
	    var rad = Math.floor(Math.random()*range+first);
        return rad;
	}

Run.prototype.newLM = function(){
      var that=this;
	   var rad = this.randomLM(5,0); 
	   var left = 0,ofsetx = 70,len = this.landmarks.length;       //left值,ofsetx初始为屏幕宽度
       for (var i =0; i<rad;i++){
          left += this.lanwidth[i];
       }
      
       var lspace = this.randomLM(Math.floor(400/16),Math.floor(100/16)); 
	    
	   if (len>0){//如果有地标设置下个地标与上个地标的距离
	         ofsetx = this.landmarks[len-1].x +lspace; 
	   }

	   if(len>6){//有六个地标就不再创建
	      return false;
	   }
	     
	   var newLanMa = {
	        width:that.lanwidth[rad],//地标宽度
	        x:ofsetx,
	        height:60,
	        left:left,
	        inow:rad,//第几种地标与随机数相同
	        index:len,//第几个
	        getdiv:function getdiv(){
	               return that.newDiv(this);
	        }
	   };
       newLanMa.getdiv();
       this.landmarks.push(newLanMa);//添加进地标数组
     
	}

var boy = new Run('xiaoHong');
boy.createlandmark();
boy.init('xiaoHong');

var bay = new Run('bayMax');
bay.init('baymax');
bay.createBarry();




function addEvent(obj,type,fn){
  if(obj.addEventListener) {
    obj.addEventListener(type,fn,false);
  } else if(obj.attachEvent) {
    obj.attachEvent('on'+type,fn);
  }
}
