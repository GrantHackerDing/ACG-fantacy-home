//1.功能区tabBar悬停切换
//鼠标移入“登录 ”按钮
$(function() {
	var tabTimer = '';
	$('div#signIn,div#signInTab').mouseover(function() {
		if(tabTimer) {
			clearTimeout(tabTimer);
		}
		$('div#signInTab').css('opacity', '1').css('display', 'block');
		$('div#signUpTab').css('opacity', '0').css('display', 'none');
	});

	//鼠标移入“注册”按钮	
	$('div#signUp,div#signUpTab').mouseover(function() {
		if(tabTimer) {
			clearTimeout(tabTimer);
		}
		$('div#signInTab').css('opacity', '0').css('display', 'none');
		$('div#signUpTab').css('opacity', '1').css('display', 'block');
	});

});

//2.“注册”区表单联动
$(function() {
	var cbh = $('div#signUpTab :checkbox');
	var others = $('div#signUpTab :input:not(:checkbox)');
	cbh.on('click', function() {
		others.prop('disabled', !$(this).prop('checked'));
	});
});

//3."注册"功能
$(function() {
	function register() {
		if(NoKongUp()) {
			var arr = [];
			if(localStorage.user) {
				arr = eval(localStorage.user);
				for(e in arr) {
					if($('div#signUpTab :input[type=text]').val() == arr[e].loginName) {
						alert('该账号已被注册');
						clearUp();
						return;
					}
				}
			}
			var user = {
				'loginName': $('div#signUpTab :input[type=text]').val(),
				'loginPsd': $('div#signUpTab :input[type=password]').val()
			};
			arr.push(user);
			localStorage.user = JSON.stringify(arr);
			alert('注册成功，请先登录');
			clearUp();
		}
	}

	function clearUp() {
		$('div#signUpTab :input[type=text]').val('');
		$('div#signUpTab :input[type=password]').val('');
	}

	function NoKongUp() {
		if($('div#signUpTab :input[type=text]').val() == "") {
			alert('用户名不能为空');
			return false;
		} else if($('div#signUpTab :input[type=password]').val() == "") {
			alert('密码不能为空');
			return false;
		}
		return true;
	}
	$('div#signUpTab :input[type=submit]').on('click', function() {
		register();
		document.location='../index.html';
	});
//4.登录功能
	function login() {
		if(NoKongIn()) {
			if(localStorage.user) {
				arr = eval(localStorage.user); //获取localStoragevar 
				k = 0;
				for(e in arr) {
					if($('div#signInTab :input[type=text]').val() == arr[e].loginName) {
						if($('div#signInTab :input[type=password]').val() == arr[e].loginPsd) {
							alert('登录成功');
							clearIn();
							k = 0;
							return;
						} else {
							alert('密码错误');
							clearIn();
							k = 0;
							return;
						}
					} else {
						k = 1;
					}
				}
				if(k == 1) {
					alert('用户名不存在');
					clearIn();
				}
			} else {
				alert('用户名不存在');
				clearIn();
			}
		}
	}
	
	function clearIn() {
		$('div#signInTab :input[type=text]').val('');
		$('div#signInTab :input[type=password]').val('');
	}

	function NoKongIn() {
		if($('div#signInTab :input[type=text]').val() == "") {
			alert('用户名不能为空');
			return false;
		} else if($('div#signInTab :input[type=password]').val() == "") {
			alert('密码不能为空');
			return false;
		}
			return true;
	}

	$('div#signInTab :input[type=submit]').on('click', function() {
		login();
		document.location='../index.html?user='+arr[e].loginName;
	});
});