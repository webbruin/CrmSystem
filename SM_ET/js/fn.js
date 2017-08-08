var $table = $('#table');
var enumTypeList = pathUrl+'enumTypeList.do?pageSize=99999';
var enumTypeDelete = pathUrl+'enumTypeDelete.do';
var enumTypeSave = pathUrl+'enumTypeSave.do';
var getEnumType = pathUrl+'getEnumType.do';

var addEnumTypeCode = $('#addEnumTypeCode');
var addEnumTypeName = $('#addEnumTypeName');

var modEnumTypeCode = $('#modEnumTypeCode');
var modEnumTypeName = $('#modEnumTypeName');

$('.modal-body div').css({display:'flex',justifyContent:'space-between'});
$('.modal-body span').css({width:'100%',display:'inline-block'});
$('.modal-body input').css({width:'100%'});
$('.modal-body select').css({width:'100%'});

$.ajax({
  url: enumTypeList,
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
          {field: 'enumTypeCode', title: '枚举类型编号', sortable: true, align: 'center'},
          {field: 'enumTypeName', title: '枚举类型名称', sortable: true, align: 'center'},
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

//新增函数
function addType() {
  $.ajax({
    url: enumTypeSave,
    type:'POST',
    dataType:'json',
    data:{
      enumTypeCode:addEnumTypeCode.val(),
      enumTypeName:addEnumTypeName.val()
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
    addEnumTypeCode.val()==''||
    addEnumTypeName.val()==''
  ){
    alert('必填项不能为空')
  }else{
    addType();
    $(".typeForm").submit();
  }
});

//修改函数
function modType(Id) {
  $.ajax({
    url: enumTypeSave,
    type:'POST',
    dataType:'json',
    data:{
      id:Id,
      enumTypeCode:modEnumTypeCode.val(),
      enumTypeName:modEnumTypeName.val()
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
    getSingleEnumType(ids[0]);
    $('#modType').attr('href','#mod-type');

    $('.Modify').on('click',function () {
      if(
        modEnumTypeCode.val()==''||
        modEnumTypeName.val()==''
      ){
        alert('必填项不能为空')
      }else{
        modType(ids[0]);
        $(".typeForm").submit();
      }
    });
  }
};

//默认修改前数据
function getSingleEnumType(Id) {
  $.ajax({
    type : "POST",
    url :getEnumType,
    data:{
      enumTypeId:Id
    },
    dataType : "json",
    success:function (json) {
      if(json.code == 200){
        modEnumTypeCode.val(json.result.enumTypeCode);
        modEnumTypeName.val(json.result.enumTypeName);
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
      content: '确认删除该枚举类型吗？',
      buttons: {
        confirm: {
          text: '确认',
          btnClass: 'waves-effect waves-button',
          action: function () {
            var ids = new Array();
            for (var i in rows) {
              ids.push(rows[i].id);
            }
            deleteEnumType(ids[0]);
            $(".typeForm").submit();
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
function deleteEnumType(Id) {
  $.ajax({
    url: enumTypeDelete,
    type:'POST',
    dataType:'json',
    data:{
      enumTypeId:Id
    },
    success:function (json) {
      if(json.code == 200){
        alert('删除成功');
      }
    }
  })
};