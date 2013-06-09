var app = {

    initialize: function() {
		
		this.showAlert('Version code: 2.0.20', 'Info');
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