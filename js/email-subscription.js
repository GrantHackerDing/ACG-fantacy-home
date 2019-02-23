var status = 'false';
$('input[name="subscribe"]').blur(function() {
	var email = $(this).val();
	if(!email.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/) || email.length > 30) {
		$('#email_msg').html('请输入您的电子邮箱').show();
		status = 'false';
	} else {
		$('#email_msg').hide();
		/*$('#email_msg').html('Thanks for your subscription!').show();*/
		status = 'true';
	}
});
$(".btn_submit").click(function() {

	if(status == 'true') {
		var email = $("input[name=subscribe]").val();
		$('#email_msg').html('感谢你的订阅!').show();
		$.post("emailsub.php", {
			email: email
		}, function(data) {
			console.log(data);
			if(data == 1) {
				$('#email_msg').html("感谢你的订阅!");
			} else {
				$('#email_msg').html("Subscribe failed");
			}
			$("input[name=subscribe]").val('');
			/*$("input[name=subscribe]").val('');
			$('#email_msg').hide();*/
		}, "json");

	} else {
		$('#email_msg').show();
		$('#email_msg').html('请输入您的电子邮箱');
	}
}); 
