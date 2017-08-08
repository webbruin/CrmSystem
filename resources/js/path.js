// var pathUrl = 'http://192.168.2.198/';
var pathUrl = 'http://192.168.2.241:8080/yumi-front-manage/';

$('input[required]').before('<i style="color:red">&nbsp;*&nbsp;&nbsp;&nbsp;</i>');
$('select[required]').before('<i style="color:red">&nbsp;*&nbsp;&nbsp;&nbsp;</i>');

$('.desc').css({
  fontStyle:'normal',
  fontWeight:'bold',
  display:'inline-block',
  background:'#e9e9e9',
  minHeight:'30px',
  lineHeight:'30px',
  borderRadius:'3px',
  paddingLeft:'5px'
});

$('fieldset legend').css({fontSize:'16px'});
