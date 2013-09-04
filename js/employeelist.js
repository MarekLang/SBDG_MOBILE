var serviceURL = "http://www.sebadiagnoza.sk/Services/data.svc/GetData";

var employees;

$('#employeeListPage').bind('pageinit', function(event) {
	loadCharts();
});

function getEmployeeList() {
	$.getJSON(serviceURL, function(data) {
		$('#employeeList li').remove();
		charts = data.Charts;
		$.each(charts, function(index, repo) {
			$('#employeeList').append('<li><a href="employeedetails.html?id=' + repo["C"] + '">' +
					'<h4>' + repo["TENG"] + '</h4>' +
					'<p>' + repo["STENG"] + '</p></a></li>');
		});
		$('#employeeList').listview('refresh');
	});
}

function loadCharts() {
	$.ajax({
	url: "http://www.sebadiagnoza.sk/Services/data.svc/GetData",
	type: 'POST'
	}).done(function(data) {
	//$("#indexPage #content #flexDiv").text(data.Charts[1]["TENG"]);
		var i, repo;
		$.each(data.Charts, function (i, repo) {
			$("#chartsList").append("<li><a href='repo-detail.html?owner=" + repo["C"] + "'>"
			+ "<h4>" + repo["TENG"] + "</h4>"
			+ "<p>" + repo["STENG"] + "</p></a></li>");
		});
		$('#chartsList').listview('refresh');
	});
}