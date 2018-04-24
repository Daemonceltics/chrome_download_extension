/*
 * This file is a part of the Chrome Download Manager project.
 *
 */

var swch=document.getElementById("liveSwitch");
var name=document.getElementById("liveName");
var desc=document.getElementById("liveDesc");

function bool(str){
	
    if (typeof str === "undefined" || str === null){
        return false;
    } else if (typeof str === "string"){
		
        switch (str.toLowerCase()){
			
		case "false":
		
		case '0':
		
		case '':
		
			return false;
			
		default:
		
			return true;
			
        };
		
    } else if (typeof str === "number"){
		
		return str !== 0;
		
    } else{
		
		return true;
		
	};
	
};

function showDesc(b){
	
	var desc=" live subframe of project optimization program.";
	if(b){
		desc.innerHTML="Disable"+desc;
	}else{
		desc.innerHTML="Enable"+desc;
	};
	
};

function liveActs(){
	
	var ch=swch.checked;
	localStorage["livejet"]=ch;
	showDesc(ch);
	
};

name.innerHTML="Live actions";
if(bool(localStorage["livejet"])){
	swch.checked=true;
	showDesc(true);
} else{
	swch.checked=false;
	showDesc(false);
};
swch.addEventListener("change", liveActs);