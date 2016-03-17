/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		isReady = true;
        navigator.splashscreen.hide();
    }
};

function initDB(){
	alert('hh0');
	window.sqlitePlugin.openDatabase({name: "my.db", location: 2}, function(db) {
		/*
	  db.transaction(function(tx) {
		alert('Open database OK ');
	  }, function(err) {
		alert('Open database ERROR: ' + JSON.stringify(err));
	  });
	  */
	  alert('hh');
	});
	alert('hh1');
}

function getimg(){
    /* test image */
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true
        });
}

function onSuccess(imageData) {
    var image = document.getElementById('comment_image');
    image.src = "data:image/jpeg;base64," + imageData;
    getImg = true;
    //image.src = imageData;
          
         
	
}
        
function onFail(message) {
    alert('Failed because: ' + message);
}

 function onConfirm(buttonIndex) {

 }
 
 var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
 }};
 
function dev_kv_view_box(fact, date){
    box = "<div class=\"dev-kv-view-box\">";
        box += "<p><span class=\"title\">Manufacturer:</span> <span>"+fact+"</span></p>";
        box += "<p><span class=\"title\">Energized On:</span> <span>"+date+"</span></p>";
    box += "</div>";
    return box;
}

function get_HTML_fact_date(obj){
    var j = 0;
    HTML = "";
    for(j = 0; j < obj.length; j++){
        HTML += dev_kv_view_box(obj[j].fact, obj[j].date);
    }
    return HTML;
}

function view_kv(id){
  //  id = parseInt(id);
    var name = db[id].name;
    var srcImg = db[id].sld;
    LatLng = [{lat: parseFloat(db[id].latitude), lng: parseFloat(db[id].longitude)}];
    id_kv_view = id;
    var gisHTML = get_HTML_fact_date(db[id].gis);
    var transHTML = get_HTML_fact_date(db[id].trans);
    $("#dev-view-kv-title").html(name+" Data");
    $("#sld img").attr('src',domain+srcImg);
    $("#dev-kv-view-info-gis").html(gisHTML);
    $("#dev-kv-view-info-trans").html(transHTML);
} 


function deg2rad(deg){
    return deg * Math.PI / 180;
}

function distance(lat1, lon1, lat2, lon2){
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return parseInt(d*1.10);
}


function listview_li(num, name, city, km){
    return "<li><a num=\""+num+"\" href=\"#view_kv\" data-transition=\"slide\"><h2>"+name+"</h2><p>"+city+" <span class=\"distance\">"+km+"km</span></p></a></li>";
}


function listview(){
    
    $kv132 = "";
    $kv380 = "";
     
    var num;
    var name;
    var city;
    var km;
    var i = 0; 
    for(i = 0; i < db.length; i++){
        num = i;
        name = db[i].name; 
        city = db[i].city;
        km = db[i].km;
        if(db[i].type === '132'){
            $kv132 += listview_li(num, name, city, km);
        }else{ 
            $kv380 += listview_li(num, name, city, km);
        }
    }
    
    $("#dev-listview-380").html($kv380).listview().listview('refresh');
    $("#dev-listview-132").html($kv132).listview().listview('refresh');

     
  //  setDistance();
}

function setDistance(){
    if(navigator.geolocation){ 
        var options ={
            enableHighAccuracy: false,
            timeout: 15 * 1000
        }; 
        navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation, options);
    }else{ 
        alert("Geolocation is not supported.");
    }
}
                 
function onSuccessGeolocation(position){ 
    curLat = position.coords.latitude;
    curLon = position.coords.longitude; 
    
    $('.dev-listview a').each(function(){
        num = $(this).attr('num');
        km = distance(curLat,curLon,db[num].latitude,db[num].longitude);
        $(this).find('.distance').html(km+'km');
    });
    
} 
function onErrorGeolocation() {
     alert('The mobile App cannot detect your Geolocation, make sure your location services(GPS) is enable');
}

function show_loading(){
    $.mobile.loading( "show", {
      text: "Loading wait...",
      textVisible: true,
      theme: "b",
      html: ""
    });
}

function hide_loading(){
    setTimeout(function(){
        $.mobile.loading( "hide" );
    }, 500);
}

function goToNavigation(lat, lng){
    window.open('http://maps.google.com/maps?daddr='+lat+','+lng+'','_system', '');
}

function goToImageURLDev() {
    url = domain+db[id_kv_view].sld;
    window.open(url,'_system', '');
    
}
