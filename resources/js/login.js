$(function() {
	// Waves初始化
	Waves.displayEffect();
	// 输入框获取焦点后出现下划线
	$('.form-control').focus(function() {
		$(this).parent().addClass('fg-toggled');
	}).blur(function() {
		$(this).parent().removeClass('fg-toggled');
	});
});
Checkbix.init();
$(function() {
  var username = $('#username');
  var password = $('#password');
	// 点击登录按钮
	$('#login-bt').click(function() {
		login(username.val(),password.val());
	});
	// 回车事件
	$('#username, #password').keypress(function (event) {
		if (13 == event.keyCode) {
			login(username.val(),password.val());
		}
	});
});
// 登录
function login(Usn,Pwd) {
  var url = pathUrl+'doLogin.do';
	$.ajax({
		url: url,
		type: 'POST',
		data: {
      codeOrMobile:Usn,
      emplPwd:Pwd
		},
		beforeSend: function() {

		},
		success: function(json){
      if(json.code == 200){
        if(json.result.rest == 1){
          var stringifyCookie = JSON.stringify({emplId:json.result.user.id,emplName:json.result.user.emplName});
          var date = new Date();
          date.setTime(date.getTime() + (1*10*60*60*1000));
          $.cookie('CRM',stringifyCookie,{expires:date,path:'/'});
          window.location.href='index.html';
        }else if(json.result.rest == 2){
          alert('用户名不存在');
        }else if(json.result.rest == 3){
          alert('密码错误');
        }
      }
		},
		error: function(error){
			console.log(error);
		}
	});
}