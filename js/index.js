var db;
var selectedLng = 'ENG';
var selectedChart;
var selectedStep;
var prevStep = 0;
var dt;

function StepYES()
{
	prevStep = selectedStep;
	loadChartStep(dt.Steps[selectedStep.STP1]);
}

function StepNO()
{
	prevStep = selectedStep;
	loadChartStep(dt.Steps[selectedStep.STP0]);
}

function StepBACK()
{
	prevStep = selectedStep.prevStep.prevStep;
	loadChartStep(selectedStep.prevStep);
}

function loadChartStep(step) {
        $('#chartCathegory').text(selectedChart["C" + selectedLng]);
		$('#repoName').text(step["TXT" + selectedLng]);
		selectedStep = step;
		//alert(selectedStep.STP0 + ' - ' + selectedStep.STP1);
		isfirst = ((dt.Steps[selectedChart.FIRSTSTEP] == step));
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
			selectedStep.prevStep = 0;
			$('#btnPREV').closest('.ui-btn').hide();
		}
		else
		{
			selectedStep.prevStep = prevStep;
			$('#btnPREV').closest('.ui-btn').show();
		}
//        $('#description').text(repo.description);
//        //$('#forks').html("<strong>Forks:</strong> " + repo.forks + "<br><strong>Watchers:</strong> " + repo.watchers);

//        $('#avatar').attr('src', repo.owner.avatar_url);
//        $('#ownerName').html("<strong>Owner:</strong> <a href='" + repo.owner.url + "'>" + repo.owner.login + "</a>");
}


$(document).bind("mobileinit", function () {
    // Make your jQuery Mobile framework configuration changes here!

});

$('#indexPage').live('pageinit', function (event) {
    // JAZYKOVE MUTACIE
	//document.addEventListener("deviceready",onDeviceReady,false);
//	var viewPortHeight = $(window).height();
//    var headerHeight = $('div[data-role="header"]').height();
//    var footerHeight = $('div[data-role="footer"]').height();
//    var contentHeight = viewPortHeight - headerHeight - footerHeight;
//    // Set all pages with class="page-content" to be at least contentHeight
//    $('.flagsTable').css({'height': contentHeight + 'px'});
	
	
    // DATA
    //$("#btnShowCharts").addClass('ui-disabled');
    loadData();

    //    db = window.openDatabase("repodb","0.1","GitHub Repo Db", 1000);
    //    db.transaction(createDb, txError, txSuccess);
});


$('#chartsPage').live('pageshow', function (event) {
    // ZOZNAM DIAGRAMOV
    showCharts();
    //    db = window.openDatabase("repodb","0.1","GitHub Repo Db", 1000);
    //    db.transaction(createDb, txError, txSuccess);
});

$('#diagnosePage').live('pageshow', function (event) {
    // DIAGNOZA
    loadChartStep(dt.Steps[selectedChart.FIRSTSTEP], true);
});


$('#favesHome').live('pageshow', function (event) {
    db.transaction(loadFavesDb, txError, txSuccess);
});

function loadData() {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
	//$(".ui-loader").addClass("ui-loading");
	$.mobile.loading();
    $.ajax({ 
		url: "http://www.sebadiagnoza.sk/Services/data.svc/GetData", 
		type: 'POST', 
		success: function (data) {
        	dt = data;
			//$(".ui-loader").removeClass("ui-loading");
        	$(".flags a").removeClass('ui-disabled');
    	}
    });
}

function showCharts() {
    var i, chart, listItemID;
    $.each(dt.Charts, function (i, chart) {
        listItemID = "lstitem_" + i;
        $("#chartsList").append("<li id='" + listItemID + "'><a href='diagnose.html'>"
            + "<h4>" + chart["T" + selectedLng] + "</h4>"
            + "<p>" + chart["ST" + selectedLng] + "</p></a></li>");

        $(document).on('click', '#' + listItemID, function () {
            selectedChart = chart;
        });
    });
    $('#chartsList').listview('refresh');
}

function createDb(tx) {
    tx.executeSql("DROP TABLE IF EXISTS repos");
    tx.executeSql("CREATE TABLE repos(user,name)");
}

function txError(error) {
    console.log(error);
    console.log("Database error: " + error);
}

function txSuccess() {
    console.log("Success");
}

function saveFave() {
    db = window.openDatabase("repodb","0.1","GitHub Repo Db", 1000);
    db.transaction(saveFaveDb, txError, txSuccessFave);
}

function saveFaveDb(tx) {
    var owner = getUrlVars().owner;
    var name = getUrlVars().name;
        
    tx.executeSql("INSERT INTO repos(user,name) VALUES (?, ?)",[owner,name]);
}

function txSuccessFave() {
    console.log("Save success");
        
    disableSaveButton();
}

function checkFave() {
    db.transaction(checkFaveDb, txError);
}

function checkFaveDb(tx) {
    var owner = getUrlVars().owner;
    var name = getUrlVars().name;
    
    tx.executeSql("SELECT * FROM repos WHERE user = ? AND name = ?",[owner,name],txSuccessCheckFave);
}

function txSuccessCheckFave(tx,results) {
    console.log("Read success");
    console.log(results);
    
    if (results.rows.length)
        disableSaveButton();
}

function alertDismissed() {
    $.mobile.changePage("index.html");
}

function disableSaveButton() {
    // change the button text and style
    var ctx = $("#saveBtn").closest(".ui-btn");
    $('span.ui-btn-text',ctx).text("Saved").closest(".ui-btn-inner").addClass("ui-btn-up-b");
    
    $("#saveBtn").unbind("click", saveFave);
}



function loadFavesDb(tx) {
    tx.executeSql("SELECT * FROM repos",[],txSuccessLoadFaves);
}

function txSuccessLoadFaves(tx,results) {
    console.log("Read success");
    
    if (results.rows.length) {
        var len = results.rows.length;
        var repo;
        for (var i=0; i < len; i = i + 1) {
            repo = results.rows.item(i);
            console.log(repo);
            $("#savedItems").append("<li><a href='repo-detail.html?owner=" + repo.user + "&name=" + repo.name + "'>"
            + "<h4>" + repo.name + "</h4>"
            + "<p>" + repo.user + "</p></a></li>");
        };
        $('#savedItems').listview('refresh');
    }
    else {
        if (navigator.notification)
            navigator.notification.alert("You haven't saved any favorites yet.", alertDismissed);
        else
            alert("You haven't saved any favorites yet.");
    }
}








function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

// screen
var $, navigator, window;

function getDimensions() {
	// the iphone specific code is kind of kludgy, if you have a better way let me know
	var isIPhone = (/iphone/gi).test(navigator.appVersion),
		iPhoneHeight = (isIPhone ?  60 : 0),
		width = $(window).width(),
		height = $(window).height(),
		// if one of these doesn't exist, assign 0 rather a null or undefined
		hHeight = $('header').outerHeight() || 0,
		fHeight = $('footer').outerHeight() || 0;
	return {
		width: width - 4,
		height: height - hHeight - fHeight - 4 + iPhoneHeight
	};
}

function reSizeDiv() {
	var dims = getDimensions(),
		$flexDiv = $('#flexDiv');
	$flexDiv.css({
		width: dims.width,
		height: dims.height
	});
}

// we are watching all three of these events, if any occur we re-determine the size
// and scroll the window back to the top
$(window).bind('resize orientationchange pageshow', function (event) {
	window.scrollTo(1, 0);
	reSizeDiv();
});

$(document).on('pagebeforeshow', '#indexPage', function(){ 
    $(document).on('vmouseover', 'a.lng' ,function(){
        $(this).addClass("hover");
    });
	$(document).on('vmouseout', 'a.lng' ,function(){
        $(this).removeClass("hover");
    });
});