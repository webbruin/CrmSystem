var $table = $('#table');
var funcList = pathUrl+'funcList.do?pageSize=99999';
var funcDelete = pathUrl+'funcDelete.do';
var funcSave = pathUrl+'funcSave.do';
var getFunc = pathUrl+'getFunc.do';

var allMenuList = pathUrl+'allMenuList.do';

var addFuncCode = $('#addFuncCode');
var addFuncName = $('#addFuncName');
var addFuncMenuId = $('#addFuncMenuId');

var modFuncCode = $('#modFuncCode');
var modFuncName = $('#modFuncName');
var modFuncMenuId = $('#modFuncMenuId');

$('.modal-body div').css({display:'flex',justifyContent:'space-between'});
$('.modal-body span').css({width:'100%',display:'inline-block'});
$('.modal-body input').css({width:'100%'});
$('.modal-body select').css({width:'100%'});

$.ajax({
  url: funcList,
  type:'POST',
  dataType:'json',
  success:function (json) {
    if(json.code == 200){

      $('#table').bootstrapTable({
        height: getHeight(),
        classes: 'table table-hover table-no-bordered',
        striped: true,
        search: true,
        searchOnEnterKey: true,
        showRefresh: false,
        showToggle: true,
        showColumns: true,
        minimumCountColumns: 2,
        showPaginationSwitch: true,
        clickToSelect: true,
        detailView: false,
        detailFormatter: 'detailFormatter',
        pagination: true,
        idField: 'id',
        sortName: 'id',
        sortOrder: 'asc',
        escape: true,
        maintainSelected: true,
        toolbar: '#toolbar',
        columns: [
          {field: 'state', radio: true},
          {field: 'id', title: 'ID', sortable: true, align: 'center'},
          {field: 'funcCode', title: '功能编号', sortable: true, align: 'center'},
          {field: 'funcName', title: '功能名称', sortable: true, align: 'center'},
          {field: 'menuId', title: '菜单', sortable: true, align: 'center'}
        ],
        data:json.result.result.result
      });

    }
  }
})

function detailFormatter(index, row) {
  var html = [];
  $.each(row, function (key, value) {
    html.push('<p><b>' + key + ':</b> ' + value + '</p>');
  });
  return html.join('');
}

//＋展示所有键值对
function detailFormatter(index, row) {
  var html = [];
  $.each(row, function (key, value) {
    html.push('<p><b>' + key + ':</b> ' + value + '</p>');
  });
  return html.join('');
};

//下拉枚举数据
var funcMenuIdData = [{text:'',id:''}];

//全部菜单
$.ajax({
  url:allMenuList,
  type:'POST',
  data:{
    pageSize:999
  },
  dataType : "json",
  success:function (json) {
    if(json.msg == 'success'){
      json.result.map(function(item,index){
        var menuId = {text:item.menuName,id:item.id};
        funcMenuIdData.push(menuId);
        $(".select_menuId").select2({
          data: funcMenuIdData,
          placeholder:'请选择',
          allowClear:true
        });
      });

    }
  }
});

//新增函数
function addFunc() {
  $.ajax({
    url: funcSave,
    type:'POST',
    dataType:'json',
    data:{
      funcCode:addFuncCode.val(),
      funcName:addFuncName.val(),
      menuId:addFuncMenuId.val()
    },
    success:function (json) {
      console.log(json);
      if(json.code == 200){
        if(json.msg == 'success'){
          alert('添加成功');
        }else{
          alert(json.msg);
        }
      }
    }
  })
};
//新增
$('.Added').on('click',function () {
  if(
    addFuncCode.val()==''||
    addFuncName.val()==''||
    addFuncMenuId.val()==''
  ){
    alert('必填项不能为空')
  }else{
    addFunc();
    $(".funcForm").submit();
  }
});

//修改函数
function modFunc(Id) {
  $.ajax({
    url: funcSave,
    type:'POST',
    dataType:'json',
    data:{
      id:Id,
      funcCode:modFuncCode.val(),
      funcName:modFuncName.val(),
      menuId:modFuncMenuId.val()
    },
    success:function (json) {
      if(json.code == 200){
        if(json.msg == 'success'){
          alert('修改成功');
        }else{
          alert(json.msg);
        }
      }
    }
  })
};
// 编辑
function updateAction() {
  var rows = $table.bootstrapTable('getSelections');
  if (rows.length == 0) {
    $.confirm({
      title: false,
      content: '请至少选择一条记录！',
      autoClose: 'cancel|3000',
      backgroundDismiss: true,
      buttons: {
        cancel: {
          text: '取消',
          btnClass: 'waves-effect waves-button'
        }
      }
    });
  } else {
    var ids = new Array();
    for (var i in rows) {
      ids.push(rows[i].id);
    }
    getSingleFunc(ids[0]);
    $('#modFunc').attr('href','#mod-func');

    $('.Modify').on('click',function () {
      if(
        modFuncCode.val()==''||
        modFuncName.val()==''||
        modFuncMenuId.val()==''
      ){
        alert('必填项不能为空')
      }else{
        modFunc(ids[0]);
        $(".funcForm").submit();
      }
    });
  }
};

//默认修改前数据
function getSingleFunc(Id) {
  $.ajax({
    type : "POST",
    url :getFunc,
    data:{
      funcId:Id
    },
    dataType : "json",
    success:function (json) {
      if(json.code == 200){
        modFuncCode.val(json.result.funcCode);
        modFuncName.val(json.result.funcName);
        modFuncMenuId.val(json.result.menuId);
      }else{
        alert(json.msg);
      }
    }
  });
};

// 删除
function deleteAction() {
  var rows = $table.bootstrapTable('getSelections');
  if (rows.length == 0) {
    $.confirm({
      title: false,
      content: '请至少选择一条记录！',
      autoClose: 'cancel|3000',
      backgroundDismiss: true,
      buttons: {
        cancel: {
          text: '取消',
          btnClass: 'waves-effect waves-button'
        }
      }
    });
  } else {
    $.confirm({
      type: 'red',
      animationSpeed: 300,
      title: false,
      content: '确认删除该功能吗？',
      buttons: {
        confirm: {
          text: '确认',
          btnClass: 'waves-effect waves-button',
          action: function () {
            var ids = new Array();
            for (var i in rows) {
              ids.push(rows[i].id);
            }
            deleteFunc(ids[0]);
            $(".funcForm").submit();
          }
        },
        cancel: {
          text: '取消',
          btnClass: 'waves-effect waves-button'
        }
      }
    });
  }
};

//删除函数
function deleteFunc(Id) {
  $.ajax({
    url: funcDelete,
    type:'POST',
    dataType:'json',
    data:{
      funcId:Id
    },
    success:function (json) {
      if(json.result == 1){
        alert('删除成功');
      }
    }
  })
};