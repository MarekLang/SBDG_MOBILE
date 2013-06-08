var app = {
	appVersionCode: "",
	appappVersionName: "",
    initialize: function() {
		this.appVersionCode = window.plugins.version.getVersionCode();
		this.appVersionName = window.plugins.version.getVersionName();
		
		this.showAlert('Version code: ' + this.appVersionCode + "Version name: " + this.appVersionName, 'Info');


    },

	showAlert: function (message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	}
};

app.initialize();