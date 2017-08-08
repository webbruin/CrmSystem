var $table = $('#table');
var roleList = pathUrl+'roleList.do?pageSize=99999';
var roleDelete = pathUrl+'roleDelete.do';
var roleSave = pathUrl+'roleSave.do';
var getRole = pathUrl+'getRole.do';

var allInstList = pathUrl+'allInstList.do';
var allEmplList = pathUrl+'allEmplList.do';
var enumList = pathUrl+'enumList.do';

var addRoleCode = $('#addRoleCode');
var addRoleName = $('#addRoleName');
var addRoleDesc = $('#addRoleDesc');

var modRoleCode = $('#modRoleCode');
var modRoleName = $('#modRoleName');
var modRoleDesc = $('#modRoleDesc');



$.ajax({
  url: roleList,
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
          {field: 'roleCode', title: '角色编号', sortable: true, align: 'center'},
          {field: 'roleName', title: '角色名称', sortable: true, align: 'center'},
          {field: 'roleDesc', title: '角色描述', sortable: true, align: 'center'}
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
function addRole() {
  $.ajax({
    url: roleSave,
    type:'POST',
    dataType:'json',
    data:{
      roleCode:addRoleCode.val(),
      roleName:addRoleName.val(),
      roleDesc:addRoleDesc.val()
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
  addRole();
  $(".roleForm").submit();
});

//修改函数
function modRole(Id) {
  $.ajax({
    url: roleSave,
    type:'POST',
    dataType:'json',
    data:{
      id:Id,
      roleCode:modRoleCode.val(),
      roleName:modRoleName.val(),
      roleDesc:modRoleDesc.val()
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
    getSingleRole(ids[0]);
    $('#modRole').attr('href','#mod-role');

    $('.Modify').on('click',function () {
      modRole(ids[0]);
      $(".roleForm").submit();
    });
  }
};

//默认修改前数据
function getSingleRole(Id) {
  $.ajax({
    type : "POST",
    url :getRole,
    data:{
      roleId:Id
    },
    dataType : "json",
    success:function (json) {
      if(json.code == 200){
        modRoleCode.val(json.result.roleCode);
        modRoleName.val(json.result.roleName);
        modRoleDesc.val(json.result.roleDesc);
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
      content: '确认删除该角色吗？',
      buttons: {
        confirm: {
          text: '确认',
          btnClass: 'waves-effect waves-button',
          action: function () {
            var ids = new Array();
            for (var i in rows) {
              ids.push(rows[i].id);
            }
            deleteRole(ids[0]);
            $(".roleForm").submit();
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
function deleteRole(Id) {
  $.ajax({
    url: roleDelete,
    type:'POST',
    dataType:'json',
    data:{
      roleId:Id
    },
    success:function (json) {
      if(json.result == 1){
        alert('删除成功');
      }
    }
  })
};