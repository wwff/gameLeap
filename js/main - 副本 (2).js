
function Run(id) {
	this.oParent = document.getElementById(id); 
	this.landmarks = []; //地标
  this.oBarrys = [];//障碍 
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
    //检测碰撞
    this.checkAll();
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
    	 				setInterval(timer);
              that.flag = true;
    	 			}
    	 		}

      
  	},30); 
   }

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

	  var timer = function creaBarry(ele) {
            clearInterval(timer);
            var oBarry = document.createElement('div');
            that.oParent.appendChild(oBarry);
            oBarry.className = 'barry';
            oBarry.style.width = that.rnd(1, 3) + 'rem';
            oBarry.style.height = that.rnd(2, 3) + 'rem';
            oBarry.style.borderRadius = that.rnd(1, 2) + 'rem';
            oBarry.style.top = 7 + 'rem';
            var i = that.rnd(0, 5);//随机时间

            oBarry.style.backgroundColor = barrColor[i];
            oBarry.addEventListener("webkitAnimationEnd", function(){ //动画结束时事件
                oBarry.parentNode.removeChild(oBarry);
                that.oBarrys.shift();
            }, false);

            that.oBarrys.push(oBarry);//新产生的oBarry
            console.log(that.oBarrys.length);
            var tim = function updateValue() {
                clearInterval(tim);
                var curLeft = getComputedStyle(oBarry).left;
            }

            setInterval(tim, 2);
            clearInterval(tim);
        }

  var tt = this.rnd(2500,3000);
  setInterval(timer,tt);
  clearInterval(timer);        

}

Run.prototype.rnd = function(min, max){
            return (Math.floor(Math.random() * (max - min)) + min);
        }
Run.prototype.createlandmark = function (){
    var that = this;
    this.lanwidth = [18,17,18,22,36];

    //随机时间产生地标
    var raTime  = this.randomLM(3000,1500); 

    this.latimer = setTimeout(_newLM(that),raTime);


    function _newLM(that){
       return function(){
         that.newLM();
         that.raTime = that.randomLM(3000,1500);
         setTimeout(arguments.callee,raTime);
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

     //动画结束
      odiv.addEventListener("webkitAnimationEnd", function(){ //动画结束时事件
                that.landmarks.shift();
                odiv.parentNode.removeChild(odiv);
            }, false);
     
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
    
	   var newLanMa = {
	        width:that.lanwidth[rad],//地标宽度
	        x:ofsetx,
	        height:60,
	        left:left,
	        inow:rad,//第几种地标与随机数相同
	        index:len,//第几个
	        getdiv:(function getdiv(){
	               return that.newDiv(this);
	        })()
	   };
       this.landmarks.push(newLanMa);//添加进地标数组
     
	}

//检测碰撞
Run.prototype.checkAll = function(){
   var that = this;
    var checkTimer = setTimeout(function(){
        var len = that.landmarks.length;
        var oBalen = that.oBarrys.length;
        var olan = null;
        if(len > 0){
          for (var i =0;i<len;i++){
              olan = that.landmarks[i].getdiv;
              if(rush(that.character,olan)){//发生碰撞
                 that.stopanmition();
              }
         }
        }else {
             for (var i =0;i<oBalen;i++){
              if(rush(that.character,that.oBarrys[i])){//发生碰撞
                 that.stopanmition();
               }
         }     
        }
        checkTimer = setTimeout(arguments.callee,50);
    },50);
}

Run.prototype.stopanmition = function(){
    var len = this.landmarks.length;
    var oblen = this.oBarrys.length;
    console.log(oblen);
    for(var i = 0;i<len;i++){
           this.landmarks[i].getdiv.style.animationPlayState = "paused";//运动停止地标
    }
    
    for(i = 0;i<oblen;i++){
         this.oBarrys[i].style.animationPlayState = "paused";
    }
    
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

//检测碰撞
function rush(ren,lanma){//人是大白或者小人，lanma是地标和障碍物

    var lx = lanma.offsetLeft;
    var ly = lanma.offsetTop;
    var lw = lanma.offsetWidth;
    var lh = lanma.offsetHeight;
   
    var rx = ren.offsetLeft;
    var ry = ren.offsetTop;  
    var rw = ren.offsetWidth;
    var rh = ren.offsetHeight; 

    if(rx+rw <lx || ry+rh <ly || lw + lx < rx || ly +lh < ry)
    {
      return false;
    }else{
     return true;
   }
   
}
