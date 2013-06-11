var App	 = {
	"selectedLng": "ENG",
	"selectedChart": 0,
	"selectedStep": 0,
	"prevStep": 0,
	"dt": null,
	
	"loadData": function() {
		console.log("======================== BL ========================");
		console.log("AJAX DATA REQUEST");
		$.ajax({ 
			url: "http://www.sebadiagnoza.sk/Services/data.svc/GetData", 
			type: 'POST', 
			error: function (request, status, error) { 
				console.log("RESULT: UNSUCCESFULL!");
				PGproxy.navigator.notification.alert(request.responseText + " - " + status + " - " + error);
				},
			success: function (data) {
				console.log("RESULT: SUCCESFULL");
				PGproxy.navigator.splashscreen.hide();
				App.dt = data;
				$("#indexPage .flags a").removeClass('ui-disabled');
				PGproxy.navigator.notification.alert('Dáta načítané');
				//$(".ui-loader").removeClass("ui-loading");
				}
		});
	},

	"showCharts": function() {
		console.log("SHOW CHARTS");
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
		console.log("STEP YES");
		App.prevStep = App.selectedStep;
		App.loadChartStep(App.dt.Steps[App.selectedStep.STP1]);
	},

	"StepNO": function() {
		console.log("STEP NO");
		App.prevStep = App.selectedStep;
		App.loadChartStep(App.dt.Steps[App.selectedStep.STP0]);
	},

	"StepBACK": function() {
		console.log("STEP BACK");
		App.prevStep = App.selectedStep.prevStep.prevStep;
		App.loadChartStep(App.selectedStep.prevStep);
	},

	"loadChartStep": function(step) {
		console.log("LOAD CHART STEP");
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
		console.log("[init]");
		if (document.URL.indexOf("http://") === -1) {
        	App.testing_on_desktop = false;
    	}
		jQuery(document).ready(function () {
			console.log("jQuery finished loading");
		 
			var deviceReadyDeferred = jQuery.Deferred();
			var jqmReadyDeferred    = jQuery.Deferred();
			if (App.testing_on_desktop) {
				console.log("PhoneGap finished loading");
				App.callbacks.onDeviceReady();
				deviceReadyDeferred.resolve();
			} else {
				document.addEventListener("deviceReady", function () {
					console.log("PhoneGap finished loading");
					App.callbacks.onDeviceReady();
					deviceReadyDeferred.resolve();
				}, false);
			}
		 
			jQuery(document).one("pageinit", function () {
				console.log("jQuery.Mobile finished loading");
				jqmReadyDeferred.resolve();
			});
		 
			jQuery.when(deviceReadyDeferred, jqmReadyDeferred).then(function () {
				console.log("PhoneGap & jQuery.Mobile finished loading");
				App.initPages();
				console.log("App finished loading");
				App.app_loaded = true;
			});
		});
    },

	"app_loaded": false,
    "testing_on_desktop": true,
 	"callbacks": {
    	"onDeviceReady": function () {
			var mql = window.matchMedia("(orientation: portrait)");
			// If there are matches, we're in portrait
			if(mql.matches) {  
				PGproxy.navigator.notification.alert('Portrait orientation');
			} else {  
				PGproxy.navigator.notification.alert('Landscape orientation');
			}
			
			App.loadData();
    	},
        "onPageInit": function () {
			alert('sss');
        }
	},
	"initPages": function () {
    	console.log("[initPages]");
    	//jQuery(document).bind("pageinit", App.callbacks.initPages);
		$('#indexPage').bind('pageinit', function (event) {
			console.log("[init: indexPage]");
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
                    console.log("navigator.notification.vibrate");
                }
            },
            "alert": function (a, b, c, d) {
                if (navigator.notification && navigator.notification.alert) {
                    navigator.notification.alert(a, b, c, d);
                } else {
                    console.log("navigator.notification.alert");
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