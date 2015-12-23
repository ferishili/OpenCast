/**
 * xoctFileuploaderSettings
 * @type {{lng: {msg_select: string}, log: boolean, form_id: string, url: string, runtimes: string, pick_button: string, chunk_size: string, max_file_size: string,supported_suffixes:string}}
 */
var xoctFileuploaderSettings = JSON.parse('{SETTINGS}');
xoctFileuploaderSettings.getUrl = function () {
	var replacer = new RegExp('amp;', 'g');
	return this.url.replace(replacer, '');
};


var xoctFileuploader = new plupload.Uploader({
	cmd: '',
	runtimes: xoctFileuploaderSettings.runtimes,
	browse_button: xoctFileuploaderSettings.pick_button, // you can pass in id...
	url: xoctFileuploaderSettings.getUrl(),
	chunk_size: xoctFileuploaderSettings.chunk_size,
	unique_names: true,
	has_files: false,
	filters: {
		max_file_size: xoctFileuploaderSettings.max_file_size,
		mime_types: [
			{title: "-", extensions: xoctFileuploaderSettings.supported_suffixes},
		]
	},
	multi_selection: false,
	flash_swf_url: '../js/Moxie.swf',
	silverlight_xap_url: '../js/Moxie.xap',
	preinit: {
		Init: function (up, info) {
			var self = this;
			info.runtime == 'html5' ? xoctWaiter.init('percentage') : xoctWaiter.init();
			$(document).ready(function () {
				$(' .ilFormHeader > div:nth-child(2) > input:nth-child(1)').click(function (e) {
					e.preventDefault();
					self.cmd = $(this).attr('name');
					if (self.has_files) {
						xoctWaiter.show();
						self.start();
					} else {
						alert(xoctFileuploaderSettings.lng.msg_select);
					}
					return false;
				});
				$('#xoct_clear').click(function () {
					self.splice();
				});
				$('#xoct_clear').hide();
			});
		},
	},
	init: {
		UploadComplete: function (up, files) {
			var self_file = {
				target_name: '',
				name: '',
				size: '',
			};
			xoctWaiter.reinit('waiter');
			xoctWaiter.show();
			plupload.each(files, function (file) {
				self_file = file;
			});
			$('#postvar_temp_file').val(self_file.target_name);
			$('#postvar_file_name').val(self_file.name);
			$('#postvar_size').val(self_file.size);
			console.log(this.cmd);
			$('#xoct_cmd').attr('name', this.cmd);
			$('#xoct_cmd').val(1);
			$('#form_' + xoctFileuploaderSettings.form_id).submit();
		},
		FilesAdded: function (up, files) {
			this.has_files = true;
			$('#pickfiles').hide();
			$('#xoct_clear').show();
			$('#xoct_progress').show();
			plupload.each(files, function (file) {
				$('#xoct_file').html(file.name);
			});
		},

		FilesRemoved: function (up, files) {
			plupload.each(files, function (file) {
			});
			$('#xoct_file').html('&nbsp;');
			this.has_files = false;
		},
		UploadProgress: function (up, file) {
			var percent = file.percent;
			xoctWaiter.setPercentage(percent);
		},
	}
});

xoctFileuploader.init();