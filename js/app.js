(function() {
  var device_ready = false;
  var jqm_mobile_init = false;

  var initApp = function() {
    if ((device_ready && jqm_mobile_init) || (jqm_mobile_init && !mobile_system)) {
      startApp();
    }
  };

  var onDeviceReady = function() {
    device_ready = true;
    //alert('dev ready');
    initApp();
  };

  var onMobileInit = function() {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    jqm_mobile_init = true;
    //alert('jqm ready');
    initApp();
  };

  $(document).bind('mobileinit', onMobileInit);
  document.addEventListener("deviceready", onDeviceReady, false);
})();

$('#ChartsPage').bind('pageinit', function(event) {
    loadRepos();
/*    db = window.openDatabase("repodb","0.1","GitHub Repo Db", 1000);
    db.transaction(createDb, txError, txSuccess);*/
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