var $table = $('#table');
var enumList = pathUrl+'enumList.do?pageSize=99999';
var enumDelete = pathUrl+'enumDelete.do';
var enumSave = pathUrl+'enumSave.do';
var getEnum = pathUrl+'getEnum.do';

var allEnumTypeList = pathUrl+'allEnumTypeList.do';

var addEnumCode = $('#addEnumCode');
var addEnumName = $('#addEnumName');
var addEnumType = $('#addEnumType');
var addEnumVal = $('#addEnumVal');

var modEnumCode = $('#modEnumCode');
var modEnumName = $('#modEnumName');
var modEnumType = $('#modEnumType');
var modEnumVal = $('#modEnumVal');

$('.modal-body div').css({display:'flex',justifyContent:'space-between'});
$('.modal-body span').css({width:'100%',display:'inline-block'});
$('.modal-body input').css({width:'100%'});
$('.modal-body select').css({width:'100%'});

$.ajax({
  url: enumList,
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
          {field: 'enumCode', title: '枚举编号', sortable: true, align: 'center'},
          {field: 'enumName', title: '枚举名称', sortable: true, align: 'center'},
          {field: 'enumTypeName', title: '枚举类型', sortable: true, align: 'center'},
          {field: 'enumValue', title: '枚举值', sortable: true, align: 'center'},
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
}

//下拉枚举数据
var enumTypeData = [{text:'',id:''}];

//全部枚举类型
$.ajax({
  url:allEnumTypeList,
  type:'POST',
  data:{
    pageSize:999
  },
  dataType : "json",
  success:function (json) {
    if(json.msg == 'success'){
      json.result.map(function(item,index){
        var mjlx = {text:item.enumTypeName,id:item.id};
        enumTypeData.push(mjlx);
        $(".select_mjlx").select2({
          data: enumTypeData,
          placeholder:'请选择',
          allowClear:true
        });
      });

    }
  }
});

//新增函数
function addEnum() {
  $.ajax({
    url: enumSave,
    type:'POST',
    dataType:'json',
    data:{
      enumCode:addEnumCode.val(),
      enumName:addEnumName.val(),
      enumTypeId:addEnumType.val(),
      enumValue:addEnumVal.val()
    },
    success:function (json) {
      if(json.code == 200){
        alert('添加成功');
      }
    }
  })
};
//新增
$('.Added').on('click',function () {
  if(
    addEnumCode.val()==''||
    addEnumName.val()==''||
    addEnumType.val()==''||
    addEnumVal.val()==''
  ){
    alert('必填项不能为空')
  }else{
    addEnum();
    $(".enumForm").submit();
  }
});

//修改函数
function modEnum(Id) {
  $.ajax({
    url: enumSave,
    type:'POST',
    dataType:'json',
    data:{
      id:Id,
      enumCode:modEnumCode.val(),
      enumName:modEnumName.val(),
      enumTypeId:modEnumType.val(),
      enumValue:modEnumVal.val()
    },
    success:function (json) {
      if(json.code == 200){
        alert('修改成功');
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
    getSingleEnum(ids[0]);
    $('#modEnum').attr('href','#mod-menu-right');

    $('.Modify').on('click',function () {
      if(
        modEnumCode.val()==''||
        modEnumName.val()==''||
        modEnumType.val()==''||
        modEnumVal.val()==''
      ){
        alert('必填项不能为空')
      }else{
        modEnum(ids[0]);
        $(".enumForm").submit();
      }
    });
  }
};

//默认修改前数据
function getSingleEnum(Id) {
  $.ajax({
    type : "POST",
    url :getEnum,
    data:{
      enumId:Id
    },
    dataType : "json",
    success:function (json) {
      if(json.code == 200){
        modEnumCode.val(json.result.enumCode);
        modEnumName.val(json.result.enumName);
        modEnumType.val(json.result.enumTypeId);
        modEnumVal.val(json.result.enumValue);
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
      content: '确认删除该枚举管理吗？',
      buttons: {
        confirm: {
          text: '确认',
          btnClass: 'waves-effect waves-button',
          action: function () {
            var ids = new Array();
            for (var i in rows) {
              ids.push(rows[i].id);
            }
            deleteEnum(ids[0]);
            $(".enumForm").submit();
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
function deleteEnum(Id) {
  $.ajax({
    url: enumDelete,
    type:'POST',
    dataType:'json',
    data:{
      enumId:Id
    },
    success:function (json) {
      if(json.code == 200){
        alert('删除成功');
      }
    }
  })
};