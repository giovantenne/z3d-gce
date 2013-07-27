var scostamento=1;
var zTimer=50;
var zAltezza=20;
var workaroundTimer=150;
var linkZoom="true";
var rimbalza="true";
var rimbalzaFreq=6;
var rimbalzaGrande="true";
var hideBkImage="false";
var notspace = /\S/;
var glassesType=1;
var colorL="#FF0000";
var colorR="#00FFFF";
var profondita=1/4;
var z3dAttivo=false;
var loaded=false;

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if (request.zStart=="true"){
			hideBkImage=request.hidebackground;
			linkZoom=request.zoomonlink;
			rimbalza=request.bounce;
			rimbalzaGrande=request.increasetextsize;
			zTimer=request.speed;
			zAltezza=request.maxheight;
			rimbalzaFreq=request.animations;
			glassesType=request.glassescolour;
			if(glassesType==1){
				colorL="#FF0000";
				colorR="#00FFFF";
			}else if (glassesType==2){
				colorL="#FF0000";
				colorR="#0000FF";
			}else if (glassesType==3){
				colorL="#FF0000";
				colorR="#00FF00";
			}else if (glassesType==4){
				colorL="#CF7B21";
				colorR="#2131FF";
			}			
			startZ3D();	
		}else{
			document.location.reload();
		}	
	
  	});

var rimbalzaCount=0;
var linkArray="0-0";
function startZ3D(){
		document.body.style.backgroundImage="url("+chrome.extension.getURL("images/Immagine.bmp")+")";
		document.body.style.backgroundColor="transparent";
		document.body.style.backgroundRepeat="repeat";
		recursiveNavigate(document.body);
		duplicateNode();
};

var  myID=0;
var debug="";

function recursiveNavigate(node){
   	var  i=0,  cNodes=node.childNodes, t;	
	while((t=cNodes[i++])){
		switch(t.nodeType){
		    case 1: // Element Node
				t.style.backgroundColor="transparent";
				if(hideBkImage=="true" && getStyle(t,"background-image")!="none"){
					t.style.backgroundImage="none";
					t.style.border="1px #AAAAAA solid";
					t.style.MozBorderRadius="10px";
				}
				t.normalize();
				recursiveNavigate(t);
		        break;
		    case 3: // Text Node
		        if(notspace.test(t.nodeValue)  ){
				var newElement = document.createElement('z3dspan');
				newElement.setAttribute("name", "z3dspan");
				newElement.setAttribute("id", "z3ID"+myID);
				//newElement.style.border="1px #ff0000 solid";
				var newTextElement = document.createTextNode(t.nodeValue);
				newElement.appendChild(newTextElement);
				var b=t.parentNode;
				var a=b.insertBefore(newElement,t);
				var c=b.removeChild(t);
				b.style.visibility="hidden";
				myDelay++;
				break;
			}
		    case 8: // Comment Node (and Text Node without non-whitespace content)
		        node.removeChild(t);
		        i--;
		}
		myID++;
	}
};
var myDebug="";
var myDelay=1;


function duplicateNode(){
	var myNodes=document.getElementsByTagName("z3dspan");
	for (var i=0; i< myNodes.length;i++){
		var myTmpID=myNodes[i].getAttribute("id");
		//var myFunction="executeDuplication('"+myTmpID+"');";
		//window.setTimeout(myFunction,workaroundTimer);
		myDelay++;
		executeDuplication(myTmpID);
	}
};

function executeDuplication(myObjID)
{
		var myObj=document.getElementById(myObjID);
		var oldContent=replaceSpecials(myObj.innerHTML);
		var newContent="";
		var myPos=findPos(myObj);
		var myX=myPos[0];
		var myY=myPos[1];
		if (myX==0 || myY==0){
				myObj.style.visibility="visible";
		}else{
		//zabsPos(myObj);
			myDebug+=myPos[0]+" "+myPos[1]+"\n";
			myScost=parseInt(calculateDeep(myObj)*profondita);
			//SCRIVI ROSSO
			var newElement = document.createElement('div');
			newElement.setAttribute("id", myObjID+"l");
			//newElement.className="m rosso";
			newElement.style.position="absolute";
			newElement.style.color=colorL;
			newElement.style.visibility="visible";	
			newElement.style.filter="alpha(opacity=50)";
			newElement.style.opacity=0.5;
	
			newElement.style.width=(1-1+myObj.offsetWidth)+"px";
			newElement.style.height=(1-1+myObj.offsetHeight)+"px";
			newElement.style.left=(1-1+myX-scostamento-myScost)+"px";
			newElement.style.top=1-1+myY+"px";
			var newTextElement = document.createTextNode(oldContent);
			newElement.appendChild(newTextElement);
			var aL=myObj.appendChild(newElement);

			//SCRIVI BLU
			var newElement = document.createElement('div');
			newElement.setAttribute("id", myObjID+"r");
			//newElement.className="m blu";
			newElement.style.position="absolute";
			newElement.style.color=colorR;
			newElement.style.visibility="visible";	
			newElement.style.filter="alpha(opacity=50)";
			newElement.style.opacity=0.5;
			newElement.style.width=(1-1+myObj.offsetWidth)+"px";
			newElement.style.height=(1-1+myObj.offsetHeight)+"px";
			newElement.style.left=(1-1+myX+scostamento+myScost)+"px";
			newElement.style.top=1-1+myY+"px";
			var newTextElement = document.createTextNode(oldContent);
			newElement.appendChild(newTextElement);
			var aR=myObj.appendChild(newElement);
			
			
			if (myObj.parentNode.tagName!="A"&&(myObj.parentNode.tagName=="B"||myObj.parentNode.tagName=="STRONG"|| getStyle(myObj,"font-weight")=="bold")&&rimbalza=="true"&&oldContent.length<50){
				if (rimbalzaCount%rimbalzaFreq==0){
					aR.style.width=getStyle(aR,"width").replace("px","")*2+"px";
					aL.style.width=getStyle(aL,"width").replace("px","")*2+"px";				
					aR.style.height=getStyle(aR,"height").replace("px","")*2+"px";
					aL.style.height=getStyle(aL,"height").replace("px","")*2+"px";				

					/*var zBlinkObjL=document.getElementById(myObjID+"l");
					var zBlinkObjR=document.getElementById(myObjID+"r");*/
					var zBlinkObjL=aL;
					var zBlinkObjR=aR;
					zBlinkObjL.style.whiteSpace="nowrap";
					zBlinkObjR.style.whiteSpace="nowrap";
					var ff="zblink('"+ myObjID+"','true')";
					window.setTimeout(function(){zblink(myObjID,'true')},zTimer);
				}
				rimbalzaCount++;
			}else if(myObj.parentNode.tagName=="A"&& linkZoom=="true" &&oldContent.length<50){	
				aR.style.width=getStyle(aR,"width").replace("px","")*2+"px";
				aL.style.width=getStyle(aL,"width").replace("px","")*2+"px";				
				aR.style.height=getStyle(aR,"height").replace("px","")*2+"px";
				aL.style.height=getStyle(aL,"height").replace("px","")*2+"px";				

				var zDiff=aR.style.left.replace("px","")-aL.style.left.replace("px","");
				var objName=myObj.getAttribute("ID");
				if (myObj.addEventListener){
					myObj.addEventListener("mouseover", function(event) { cresci(objName,zDiff) }, false); 
					myObj.addEventListener("mouseout", function(event) { decresci(objName,zDiff) }, false); 	
				}else if (myObj.attachEvent){	
					var r = myObj.attachEvent('onmouseover', function() { cresci(objName,zDiff) });
					var rr = myObj.attachEvent('onmouseout', function() { decresci(objName,zDiff) });
				}
				linkArray+="_"+objName+"-stand";
			}
			if(myObj.parentNode.tagName=="A"){
				myObj.parentNode.style.textDecoration="none";
				myObj.parentNode.style.fontWeight="bold";
				myObj.parentNode.style.whiteSpace="nowrap";
			}
		}
};


function cresci(zmyObjID,originalDist){
	setLinkStatus(zmyObjID,"up");
	zEseguiCrescita(zmyObjID,originalDist);
};


function decresci(zmyObjID,originalDist){
	setLinkStatus(zmyObjID,"down");
	zEseguiDecrescita(zmyObjID,originalDist);
};

function setLinkStatus(zmyObjID,status){
	linkArray=linkArray.replace(zmyObjID+"-stand",zmyObjID+"-"+status);
	linkArray=linkArray.replace(zmyObjID+"-up",zmyObjID+"-"+status);
	linkArray=linkArray.replace(zmyObjID+"-down",zmyObjID+"-"+status);
};

function zEseguiCrescita(zmyObjID,originalDist){
	if(linkArray.indexOf(zmyObjID+"-down")==-1){
		var zBlinkObjL=document.getElementById(zmyObjID+"l");
		var zBlinkObjR=document.getElementById(zmyObjID+"r");
		var zDiff=getStyle(zBlinkObjR,"left").replace("px","")-getStyle(zBlinkObjL,"left").replace("px","");
		if(zDiff<zAltezza){
			zBlinkObjL.style.left=getStyle(zBlinkObjL,"left").replace("px","")-1+"px";
			zBlinkObjR.style.left=getStyle(zBlinkObjR,"left").replace("px","")-1+1+1+"px";
			zBlinkObjL.style.top=getStyle(zBlinkObjL,"top").replace("px","")-1+1+1+"px";
			zBlinkObjR.style.top=getStyle(zBlinkObjR,"top").replace("px","")-1+1+1+"px";
			if(rimbalzaGrande=="true"){		
				zBlinkObjL.style.fontSize=100+zDiff*2+"%";
				zBlinkObjR.style.fontSize=100+zDiff*2+"%";
				/*var nFont=zBlinkObjL.innerHTML.length;
				nFont=nFont-nFont/3
				zBlinkObjL.style.width=zBlinkObjL.style.width.replace("px","")-1+1+nFont+"px";
				zBlinkObjR.style.width=zBlinkObjR.style.width.replace("px","")-1+1+nFont+"px";				
				zBlinkObjL.style.fontSize=getStyle(zBlinkObjL,"font-size").replace("px","")-1+1+1+"px";
				zBlinkObjR.style.fontSize=getStyle(zBlinkObjR,"font-size").replace("px","")-1+1+1+"px";*/
			}	
			//zEseguiCrescita(zmyObjID,originalDist);
			var zmyFunction="zEseguiCrescita('"+zmyObjID+"','"+originalDist+"');";
			//console.log(zmyFunction);	
			window.setTimeout(function(){zEseguiCrescita(zmyObjID,originalDist);},zTimer);	
		}else{
			linkArray=linkArray.replace(zmyObjID+"-up",zmyObjID+"-stand");
		}
	}
};


function zEseguiDecrescita(zmyObjID,originalDist){
	if(linkArray.indexOf(zmyObjID+"-up")==-1){
		var zBlinkObjL=document.getElementById(zmyObjID+"l");
		var zBlinkObjR=document.getElementById(zmyObjID+"r");
		var zDiff=(getStyle(zBlinkObjR,"left").replace("px",""))-parseInt(getStyle(zBlinkObjL,"left").replace("px",""));
		if(zDiff>originalDist){
			zBlinkObjL.style.left=getStyle(zBlinkObjL,"left").replace("px","")-1+1+1+"px";
			zBlinkObjR.style.left=getStyle(zBlinkObjR,"left").replace("px","")-1+"px";
			zBlinkObjL.style.top=getStyle(zBlinkObjL,"top").replace("px","")-1+"px";
			zBlinkObjR.style.top=getStyle(zBlinkObjR,"top").replace("px","")-1+"px";
			if(rimbalzaGrande=="true"){			
				zBlinkObjL.style.fontSize=100+zDiff*2+"%";
				zBlinkObjR.style.fontSize=100+zDiff*2+"%";
				/*var nFont=zBlinkObjL.innerHTML.length;
				nFont=nFont-nFont/3
				zBlinkObjL.style.fontSize=getStyle(zBlinkObjL,"font-size").replace("px","")-1+"px";
				zBlinkObjR.style.fontSize=getStyle(zBlinkObjR,"font-size").replace("px","")-1+"px";
				zBlinkObjL.style.width=zBlinkObjL.style.width.replace("px","")-1+1-nFont+"px";
				zBlinkObjR.style.width=zBlinkObjR.style.width.replace("px","")-1+1-nFont+"px";*/
			}		
			var zmyFunction="zEseguiDecrescita('"+zmyObjID+"',"+originalDist+");";
			window.setTimeout(function(){zEseguiDecrescita(zmyObjID,originalDist);},zTimer);
		}else{
			linkArray=linkArray.replace(zmyObjID+"-up",zmyObjID+"-stand");
			zBlinkObjL.style.fontSize=100+"%";
			zBlinkObjR.style.fontSize=100+"%";
		}
	}
};

function zblink(zmyObjID,cresce){
	var zBlinkObjL=document.getElementById(zmyObjID+"l");
	var zBlinkObjR=document.getElementById(zmyObjID+"r");
	var zDiff=getStyle(zBlinkObjR,"left").replace("px","")-getStyle(zBlinkObjL,"left").replace("px","");
	if	(zDiff<0){
		cresce="true";
	}else if(zDiff>zAltezza){
		cresce="false";
	}
	if(cresce=="true"){
		zBlinkObjL.style.left=getStyle(zBlinkObjL,"left").replace("px","")-1+"px";
		zBlinkObjR.style.left=getStyle(zBlinkObjR,"left").replace("px","")-1+1+1+"px";
		zBlinkObjL.style.top=getStyle(zBlinkObjL,"top").replace("px","")-1+1+1+"px";
		zBlinkObjR.style.top=getStyle(zBlinkObjR,"top").replace("px","")-1+1+1+"px";
	}else{
		zBlinkObjL.style.left=getStyle(zBlinkObjL,"left").replace("px","")-1+1+1+"px";
		zBlinkObjR.style.left=getStyle(zBlinkObjR,"left").replace("px","")-1+"px";
		zBlinkObjL.style.top=getStyle(zBlinkObjL,"top").replace("px","")-1+"px";
		zBlinkObjR.style.top=getStyle(zBlinkObjR,"top").replace("px","")-1+"px";
	}
	if(rimbalzaGrande=="true"){
		/*if(cresce=="true"){
			zBlinkObjL.style.width=1-1+parseInt(zBlinkObjL.style.width.replace("px",""))+zDiff+"px";
			zBlinkObjR.style.width=1-1+parseInt(zBlinkObjR.style.width.replace("px",""))+zDiff+"px";
		}else{
			zBlinkObjL.style.width=1-1+parseInt(zBlinkObjL.style.width.replace("px",""))-zDiff+"px";
			zBlinkObjR.style.width=1-1+parseInt(zBlinkObjR.style.width.replace("px",""))-zDiff+"px";
		}*/
		zBlinkObjL.style.fontSize=100+zDiff*2+"%";
		zBlinkObjR.style.fontSize=100+zDiff*2+"%";
	}
	var zmyFunction="zblink('"+zmyObjID+"','"+cresce+"')";
	window.setTimeout(function(){zblink(zmyObjID,cresce)},zTimer);
};

function findPos(ooo) {
	var obj2=ooo;
	var curleft = 0;
	var curtop = 0;
	var i=0;
	var positionValue;
	if (obj2.offsetParent ) {
			do {
					positionValue=getStyle(obj2,"position");
					if( positionValue && (positionValue=="absolute"|| positionValue=="relative")){				
						return [curleft,curtop];
					}
					curleft += (1-1+obj2.offsetLeft);
					curtop += (1-1+obj2.offsetTop);
					i++;
			} while (obj2 = obj2.offsetParent);
	}
	return [curleft,curtop];
};
/*function findPos(ooo){
	var aa=document.getBoxObjectFor(ooo); 
	//var aa=document.getBoundingClientRect(ooo); 
	return[aa.x,aa.y];
}*/
function zabsPos(o){	
	var positionValue;
	while (o.parentNode) {
		if(!o.nodeValue){
			positionValue=getStyle(o,"position");
			if(positionValue && positionValue=="absolute"){
				alert(o.className+" "+positionValue);
			}
			/*var positionValue = current.document.defaultView.getComputedStyle(o, null).getPropertyCSSValue("position").cssText;
			alert(positionValue);*/
		}
		o=o.parentNode;
	}
	return false;
};

function  calculateDeep(o){
	var deep = 0;
	while (o.parentNode) {
		deep++;
		o=o.parentNode;
	}
	return (deep);
};

function trim(stringa){
    while (stringa.substring(0,1) == ' '){
        stringa = stringa.substring(1, stringa.length);
    }
    while (stringa.substring(stringa.length-1, stringa.length) == ' '){
        stringa = stringa.substring(0,stringa.length-1);
    }
    return stringa;
};
function replaceSpecials(oString)
{
    var nString = oString;
    
    nString=nString.replace(/<!--([^>]|[^-]>|[^-]->)*-->/g, ' ');
    
    //N.B. could this regular expression be broken up into smaller parts?
    //   [ED. No. It matches both valid and invalid (x)html tags]
    nString=nString.replace(/<[\/!]?[a-z]+\d*(\s+[a-z][a-z\-]*(=[^\s>"']*|="[^"]*"|='[^']*')?)*\s*(\s\/)?>/gi, ' ');

    nString=nString.replace(/[^\S ]+/g, ' ');
    nString=nString.replace(/&lt;/g, '<');
    nString=nString.replace(/&gt;/g, '>');
    nString=nString.replace(/&nbsp;/g, ' ');
    nString=nString.replace(/&quot;/g, '"');
    nString=nString.replace(/&amp;/g, '\t');
    nString=nString.replace(/&#?\w+;/g, ' ');
    nString=nString.replace(/\t/g, '&');
    nString=nString.replace(/ +/g, ' ');
    return nString;
}

function getStyle(el,styleProp)
{
		var x = el;
		if (x.currentStyle){
			var y = x.currentStyle[styleProp];
		}
		else if (window.getComputedStyle){
			var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
		}
		return y;
};

function stringToBool(v){
	if(v=="true")
		return true;
	return false;
};

function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    };
  }
};



