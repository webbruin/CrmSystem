var $table = $('#table');
var menuRightList = pathUrl+'menuRightList.do?pageSize=99999';
var menuRightDelete = pathUrl+'menuRightDelete.do';
var menuRightSave = pathUrl+'menuRightSave.do';
var getMenuRight = pathUrl+'getMenuRight.do';
var allMenuList = pathUrl+'allMenuList.do';

var allInstList = pathUrl+'allInstList.do';
var allEmplList = pathUrl+'allEmplList.do';
var allRoleList = pathUrl+'allRoleList.do';

var addMenuRightName = $('#addMenuRightName');
var addMenuRightType = $('#addMenuRightType');
var addMenuRightId = $('#addMenuRightId');

var modMenuRightName = $('#modMenuRightName');
var modMenuRightType = $('#modMenuRightType');
var modMenuRightId = $('#modMenuRightId');

$('.modal-body div').css({display:'flex',justifyContent:'space-between'});
$('.modal-body span').css({width:'100%',display:'inline-block'});
$('.modal-body select').css({width:'100%'});

$.ajax({
  url: menuRightList,
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
          {field: 'menuId', title: '菜单ID', sortable: true, align: 'center'},
          {field: 'refType', title: '权限类型', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.refType == 1){
              return '机构';
            }else if(row.refType == 2){
              return '员工';
            }else if(row.refType == 3){
              return '角色';
            }else{
              return '';
            }
          }},
          {field: 'refId', title: '权限ID', sortable: true, align: 'center'},
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
var menuRightNameData = [{text:'',id:''}];
var menuRightTypeData = [{text:'',id:''}];
var menuRightIdData = [{text:'',id:''}];
var a = [{text:'',id:''}],b = [{text:'',id:''}],c = [{text:'',id:''}];

$.ajax({
  url: '/resources/data/menu.json',
  type:'POST',
  dataType:'json',
  success:function (json) {
    json.map(function (item,index) {
      if(item.title == 'menuRightType'){
        item.content.map(function (msg,addr) {
          var qxlx = {text:msg.text,id:msg.id};
          menuRightTypeData.push(qxlx);
          $(".select_qxlx").select2({
            data: menuRightTypeData,
            placeholder:'请选择',
            allowClear:true
          });
        })
      }
    });
  }
});

//全部机构
$.ajax({
  url:allInstList,
  type:'POST',
  data:{
    pageSize:999
  },
  dataType : "json",
  success:function (json) {
    if(json.msg == 'success'){
      json.result.map(function(item,index){
        var qxid = {text:item.instName,id:item.id};
        menuRightIdData.push(qxid);
        $(".select_qxid").select2({
          data: menuRightIdData,
          placeholder:'请选择',
          allowClear:true
        });
      });
    }
  }
});

$(".select_qxlx").on('select2:select',function (e) {
  $('.select_qxid').html('');
  if(e.currentTarget.value == 1){
    console.log('机构');
    $.ajax({
      url:allInstList,
      type:'POST',
      data:{
        pageSize:999
      },
      dataType : "json",
      success:function (json) {
        if(json.msg == 'success'){
          json.result.map(function(item,index){
            var qxid = {text:item.instName,id:item.id};
            a.push(qxid);
            $(".select_qxid").select2({
              data: a,
              placeholder:'请选择',
              allowClear:true
            });
          });

        }
      }
    });
  }else if(e.currentTarget.value == 2){
    console.log('员工');
    $.ajax({
      url:allEmplList,
      type:'POST',
      data:{
        pageSize:999
      },
      dataType : "json",
      success:function (json) {
        if(json.msg == 'success'){
          json.result.map(function(item,index){
            var qxid = {text:item.emplName,id:item.id};
            b.push(qxid);
            $(".select_qxid").select2({
              data: b,
              placeholder:'请选择',
              allowClear:true
            });
          });

        }
      }
    });
  }else if(e.currentTarget.value == 3){
    console.log('角色');
    $.ajax({
      url:allRoleList,
      type:'POST',
      data:{
        pageSize:999
      },
      dataType : "json",
      success:function (json) {
        if(json.msg == 'success'){
          json.result.map(function(item,index){
            var qxid = {text:item.roleName,id:item.id};
            c.push(qxid);
            $(".select_qxid").select2({
              data: c,
              placeholder:'请选择',
              allowClear:true
            });
          });

        }
      }
    });
  };
})

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
        var qxmc = {text:item.menuName,id:item.id};
        menuRightNameData.push(qxmc);
        $(".select_qxmc").select2({
          data: menuRightNameData,
          placeholder:'请选择',
          allowClear:true
        });
      });

    }
  }
});



//新增函数
function addMenuRight() {
  $.ajax({
    url: menuRightSave,
    type:'POST',
    dataType:'json',
    data:{
      menuId:addMenuRightName.val(),
      refType:addMenuRightType.val(),
      refId:addMenuRightId.val()
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
    addMenuRightName.val()==''||
    addMenuRightType.val()==''||
    addMenuRightId.val()==''
  ){
    alert('必填项不能为空')
  }else{
    addMenuRight();
    $(".menuRightForm").submit();
  }
});

//修改函数
function modMenuRight(Id) {
  $.ajax({
    url: menuRightSave,
    type:'POST',
    dataType:'json',
    data:{
      id:Id,
      menuId:modMenuRightName.val(),
      refType:modMenuRightType.val(),
      refId:modMenuRightId.val()
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
    getSingleMenuRight(ids[0]);
    $('#modMenuRight').attr('href','#mod-menu-right');

    $('.Modify').on('click',function () {
      if(
        modMenuRightName.val()==''||
        modMenuRightType.val()==''||
        modMenuRightId.val()==''
      ){
        alert('必填项不能为空')
      }else{
        modMenuRight(ids[0]);
        $(".menuRightForm").submit();
      }
    });
  }
};

//默认修改前数据
function getSingleMenuRight(Id) {
  $.ajax({
    type : "POST",
    url :getMenuRight,
    data:{
      menuRightId:Id
    },
    dataType : "json",
    success:function (json) {
      if(json.code == 200){
        $('.select_qxid').html('');
        modMenuRightName.val(json.result.menuId);
        modMenuRightType.val(json.result.refType);
        if(json.result.refType == 1){
          $.ajax({
            url:allInstList,
            type:'POST',
            data:{
              pageSize:999
            },
            dataType : "json",
            success:function (json) {
              if(json.msg == 'success'){
                json.result.map(function(item,index){
                  var qxid = {text:item.instName,id:item.id};
                  a.push(qxid);
                  $(".select_qxid").select2({
                    data: a,
                    placeholder:'请选择',
                    allowClear:true
                  });
                });

              }
            }
          });
        }else if(json.result.refType == 2){
          $.ajax({
            url:allEmplList,
            type:'POST',
            data:{
              pageSize:999
            },
            dataType : "json",
            success:function (json) {
              if(json.msg == 'success'){
                json.result.map(function(item,index){
                  var qxid = {text:item.emplName,id:item.id};
                  b.push(qxid);
                  $(".select_qxid").select2({
                    data: b,
                    placeholder:'请选择',
                    allowClear:true
                  });
                });

              }
            }
          });
        }else if(json.result.refType == 3){
          $.ajax({
            url:allRoleList,
            type:'POST',
            data:{
              pageSize:999
            },
            dataType : "json",
            success:function (json) {
              if(json.msg == 'success'){
                json.result.map(function(item,index){
                  var qxid = {text:item.roleName,id:item.id};
                  c.push(qxid);
                  $(".select_qxid").select2({
                    data: c,
                    placeholder:'请选择',
                    allowClear:true
                  });
                });

              }
            }
          });
        }
        modMenuRightId.val(json.result.refId);

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
      content: '确认删除该权限吗？',
      buttons: {
        confirm: {
          text: '确认',
          btnClass: 'waves-effect waves-button',
          action: function () {
            var ids = new Array();
            for (var i in rows) {
              ids.push(rows[i].id);
            }
            deleteMenuRight(ids[0]);
            $(".menuRightForm").submit();
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
function deleteMenuRight(Id) {
  $.ajax({
    url: menuRightDelete,
    type:'POST',
    dataType:'json',
    data:{
      menuRightId:Id
    },
    success:function (json) {
      if(json.code == 200){
        alert('删除成功');
      }
    }
  })
};