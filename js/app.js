/* Custom Javascript for this PhoneGap APP */

document.addEventListener("deviceready",onDeviceReady,false);

function onDeviceReady()
{
  //Phonegap is ready
  console.log("Phonegap is ready");
}

$(document).on( "mobileinit", function() {
	console.log("Initialize jQuery Mobile Phonegap Enhancement Configurations")
    // Make your jQuery Mobile framework configuration changes here!
    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
    $.mobile.buttonMarkup.hoverDelay = 0;
    $.mobile.pushStateEnabled = false;
    $.mobile.defaultPageTransition = "none";
	loadRepos();
});



function loadRepos() {
	$.ajax({
	url: 'http://www.sebadiagnoza.sk/Services/data.svc/GetData',
	type: 'POST'
	}).done(function(data) {
	//$("#indexPage #content #flexDiv").text(data.Charts[1]["TENG"]);
		var i, repo;
		$.each(data.Charts, function (i, repo) {
			$("#Charts").append("<li><a href='repo-detail.html?owner=" + repo["C"] + "'>"
			+ "<h4>" + repo["TENG"] + "</h4>"
			+ "<p>" + repo["STENG"] + "</p></a></li>");
		});
		$('#Charts').listview('refresh');
	});
}