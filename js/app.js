var App	 = {
//	"logMessages": [],
//	"logging": false,
//	"logMessage": function(message){App.logMessages.push(message);if(App.logging) App.flushLog();},
//	"loggingTarget": "#loggingTarget",
//	"flushLog": function() {
//			var htmlStr = '<div id="appLog">';
//			for(i = 1; i < App.logMessages.length; i++)
//				{
//					//alert(App.logMessages[i-1]);
//					htmlStr += "<p><strong>" + i + ". </strong><span>" + App.logMessages[i-1] + "</span></p>";
//					
//				}
//				htmlStr += '</div>';
//				$("#indexPage #content #flexDiv").height($(window).height() - 80);
//				$("#indexPage #content #flexDiv").html(htmlStr);
//		},
//	
	"selectedLng": "ENG",
	"selectedChart": 0,
	"selectedStep": 0,
	"prevStep": 0,
	"dt": null,
	
	"loadData": function() {
		////App.logMessage("AJAX DATA REQUEST - ASYNC");
		PGproxy.navigator.notification.alert('START AJAX');
		$.ajax({ 
			url: "http://www.sebadiagnoza.sk/Services/data.svc/GetData", 
			type: 'POST', 
			error: function (request, status, error) { 
				PGproxy.navigator.notification.alert('AJAX ERROR - request:' + request + ' status:' + status + ' erroro:' + error);
				////App.logMessage("RESULT: UNSUCCESFULL!");
				//App.logMessage(request.responseText + " - " + status + " - " + error);
				},
			success: function (data) {
				////App.logMessage("AJAX DATA REQUEST RESULT: SUCCESFULL - ASYNC");
				//PGproxy.navigator.splashscreen.hide();
				PGproxy.navigator.notification.alert('AJAX SUCCES');
				App.dt = data;
				$("#indexPage .flags a").removeClass('ui-disabled');
				//App.logMessage('Dáta načítané');
				//$(".ui-loader").removeClass("ui-loading");
				if(App.logging) App.flushLog();
				}
		});
	},

	"showCharts": function() {
		////App.logMessage("SHOW CHARTS");
		//PGproxy.navigator.notification.alert(App.selectedLng);
		//PGproxy.navigator.notification.alert(App.dt.Charts);
		console.log(App.dt);
		PGproxy.navigator.notification.alert(App.dt.Charts["1"]["T" + App.selectedLng]);
		var i, chart, listItemID;
		$.each(App.dt.Charts, function (i, chart) {
			
			listItemID = "lstitem_" + i;
			$("#chartsList").append("<li id='" + listItemID + "'><a href='index.html#diagnosePage'>"
				+ "<h4>" + chart["T" + App.selectedLng] + "</h4>"
				+ "<p>" + chart["ST" + App.selectedLng] + "</p></a></li>");
	
			$(document).on('click', '#' + listItemID, function () {
				App.selectedChart = chart;
			});
		});
		$('#chartsList').listview('refresh');
	},
	
	"StepYES": function() {
		////App.logMessage("STEP YES");
		App.prevStep = App.selectedStep;
		App.loadChartStep(App.dt.Steps[App.selectedStep.STP1]);
	},

	"StepNO": function() {
		////App.logMessage("STEP NO");
		App.prevStep = App.selectedStep;
		App.loadChartStep(App.dt.Steps[App.selectedStep.STP0]);
	},

	"StepBACK": function() {
		////App.logMessage("STEP BACK");
		App.prevStep = App.selectedStep.prevStep.prevStep;
		App.loadChartStep(App.selectedStep.prevStep);
	},

	"loadChartStep": function(step) {
		////App.logMessage("LOAD CHART STEP");
        $('#chartCathegory').text(App.selectedChart["C" + App.selectedLng]);
		$('#repoName').text(step["TXT" + App.selectedLng]);
		App.selectedStep = step;
		//alert(selectedStep.STP0 + ' - ' + selectedStep.STP1);
		isfirst = ((App.dt.Steps[App.selectedChart.FIRSTSTEP] == step));
		if(step.STP0 == 0 && step.STP1 == 0)
		{
			$('#btnYES').closest('.ui-btn').hide();
			$('#btnNO').closest('.ui-btn').hide();
		}
		else
		{
			$('#btnYES').closest('.ui-btn').show();
			$('#btnNO').closest('.ui-btn').show();
		}
		if(isfirst)
		{
			App.selectedStep.prevStep = 0;
			$('#btnPREV').closest('.ui-btn').hide();
		}
		else
		{
			App.selectedStep.prevStep = App.prevStep;
			$('#btnPREV').closest('.ui-btn').show();
		}
	},
	
	/* SYSTEM */
    "init": function() {
		////App.logMessage("APP START - function App.Init()");
		if (document.URL.indexOf("http://") === -1) {
        	App.testing_on_desktop = false;
    	}
		jQuery(document).ready(function () {
			////App.logMessage("jQuery finished loading");
		 
			var deviceReadyDeferred = jQuery.Deferred();
			var jqmReadyDeferred    = jQuery.Deferred();
			if (App.testing_on_desktop) {
				////App.logMessage("PhoneGap finished loading");
				App.callbacks.onDeviceReady();
				deviceReadyDeferred.resolve();
			} else {
				document.addEventListener("deviceReady", function () {
					////App.logMessage("PhoneGap finished loading");
					App.callbacks.onDeviceReady();
					deviceReadyDeferred.resolve();
				}, false);
			}
		 
			jQuery(document).one("pageinit", function () {
				////App.logMessage("jQuery(document).one(\"pageinit\", function ()");
				jqmReadyDeferred.resolve();
			});
		 
			jQuery.when(deviceReadyDeferred, jqmReadyDeferred).then(function () {
				////App.logMessage("PhoneGap & jQuery.Mobile finished loading");
				App.initPages();
				////App.logMessage("App finished loading");
				App.app_loaded = true;
			});
		});
    },

	"app_loaded": false,
    "testing_on_desktop": true,
 	"callbacks": {
    	"onDeviceReady": function () {
			////App.logMessage("onDeviceReady - EVENT FIRED");
			var mql = window.matchMedia("(orientation: portrait)");
			// If there are matches, we're in portrait
			if(mql.matches) {  
				//App.logMessage('Portrait orientation');
			} else {  
				//App.logMessage('Landscape orientation');
			}
			
			App.loadData();
    	},
        "onPageInit": function () {
        }
	},
	"initPages": function () {
    	////App.logMessage("[initPages]");
    	//jQuery(document).bind("pageinit", App.callbacks.initPages);
		$('#indexPage').bind('pageinit', function (event) {
			////App.logMessage("[init: indexPage]");
		});
		$(document).on('pagebeforeshow', '#indexPage', function(){ 
    		$(document).on('vmouseover', 'a.lng' ,function(){
        		$(this).addClass("hover");
    		});
			$(document).on('vmouseout', 'a.lng' ,function(){
        		$(this).removeClass("hover");
    		});
			
		});
		$('#chartsPage').bind('pageshow', function (event) {
			App.showCharts();
		});
		$('#diagnosePage').bind('pageshow', function (event) {
			App.loadChartStep(App.dt.Steps[App.selectedChart.FIRSTSTEP], true);
		});
		$('#logPage').bind('pageshow', function (event) {
			
			if(App.logging) App.flushLog();
			
		});
		
	},
 
    "utilities": {
    }
};

var PGproxy = {
    "navigator": {
        "connection": function () {
            if (navigator.connection) {
                return navigator.connection;
            } else {
                console.log('navigator.connection');
                return {
                    "type":"WIFI" // Avoids errors on Chrome
                };
            }
        },
        "notification": {
            "vibrate": function (a) {
                if (navigator.notification && navigator.notification.vibrate) {
                    navigator.notification.vibrate(a);
                } else {
                    ////App.logMessage("navigator.notification.vibrate");
                }
            },
            "alert": function (a, b, c, d) {
                if (navigator.notification && navigator.notification.alert) {
                    navigator.notification.alert(a, b, c, d);
                } else {
                    ////App.logMessage("navigator.notification.alert");
                    alert(a);
                }
            }
        },
        "splashscreen": {
            "hide": function () {
                if (navigator.splashscreen) {
                    navigator.splashscreen.hide();
                } else {
                    console.log('navigator.splashscreen.hide');
                }
            }
        }
    }
};