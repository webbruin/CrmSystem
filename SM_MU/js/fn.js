var $table = $('#table');
var menuList = pathUrl+'menuList.do?pageSize=99999';
var menuDelete = pathUrl+'menuDelete.do';
var menuSave = pathUrl+'menuSave.do';
var getMenu = pathUrl+'getMenu.do';
var allMenuList = pathUrl+'allMenuList.do';

var addMenuCode = $('#addMenuCode');
var addMenuName = $('#addMenuName');
var addMenuType = $('#addMenuType');
var addMenuLevel = $('#addMenuLevel');
var addMenuParent = $('#addMenuParent');
var addMenuUrl = $('#addMenuUrl');
var addMenuImage = $('#addMenuImage');
var addMenuShortcut = $('#addMenuShortcut');
var addMenuOrder = $('#addMenuOrder');

var modMenuCode = $('#modMenuCode');
var modMenuName = $('#modMenuName');
var modMenuType = $('#modMenuType');
var modMenuLevel = $('#modMenuLevel');
var modMenuParent = $('#modMenuParent');
var modMenuUrl = $('#modMenuUrl');
var modMenuImage = $('#modMenuImage');
var modMenuShortcut = $('#modMenuShortcut');
var modMenuOrder = $('#modMenuOrder');

$('.modal-body div').css({display:'flex',justifyContent:'space-between'});
$('.modal-body span').css({width:'45%',display:'inline-block'});
$('.modal-body input').css({width:'100%'});
$('.modal-body select').css({width:'100%'});

$.ajax({
  url: menuList,
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
          {field: 'menuCode', title: '菜单编号', sortable: true, align: 'center'},
          {field: 'menuName', title: '菜单名称', sortable: true, align: 'center'},
          {field: 'menuOrder', title: '菜单序号', sortable: true, align: 'center'},
          {field: 'menuUrl', title: '菜单链接', sortable: true, align: 'center'},
          {field: 'menuType', title: '菜单类型', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.menuType == 'N'){
              return '非叶子菜单';
            }else if(row.menuType == 'L'){
              return '叶子菜单';
            }else{
              return '';
            }
          }},
          {field: 'menuParentId', title: '上级菜单', sortable: true, align: 'center'},
          {field: 'menuImage', title: '菜单图标', sortable: true, align: 'center'},
          {field: 'menuLevel', title: '菜单层级', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.menuLevel == 1){
              return '一级菜单';
            }else if(row.menuLevel == 2){
              return '二级菜单';
            }else if(row.menuLevel == 3){
              return '三级菜单';
            }else{
              return '';
            }
          }},
          {field: 'menuShortcut', title: '菜单快捷键', sortable: true, align: 'center'}
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
var menuTypeData = [{text:'',id:''}];
var menuLevelData = [{text:'',id:''}];
var modMenuParentData = [{text:'',id:''}];

$.ajax({
  url: '/resources/data/menu.json',
  type:'POST',
  dataType:'json',
  success:function (json) {
    json.map(function (item,index) {
      if(item.title == 'menuType'){
        item.content.map(function (msg,addr) {
          var lx = {text:msg.text,id:msg.id};
          menuTypeData.push(lx);
          $(".select_lx").select2({
            data: menuTypeData,
            placeholder:'请选择',
            allowClear:true
          });
        })
      }else if(item.title == 'menuLevel'){
        item.content.map(function (msg,addr) {
          var cengji = {text:msg.text,id:msg.id};
          menuLevelData.push(cengji);
          $(".select_cengji").select2({
            data: menuLevelData,
            placeholder:'请选择',
            allowClear:true
          });
        })
      }
    });
  }
});

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
        var shangji = {text:item.menuName,id:item.id};
        modMenuParentData.push(shangji);
        $(".select_shangji").select2({
          data: modMenuParentData,
          placeholder:'请选择',
          allowClear:true
        });
      });

    }
  }
});

//新增函数
function addMenu() {
  $.ajax({
    url: menuSave,
    type:'POST',
    dataType:'json',
    data:{
      menuCode:addMenuCode.val(),
      menuName:addMenuName.val(),
      menuOrder:addMenuOrder.val(),
      menuUrl:addMenuUrl.val(),
      menuType:addMenuType.val(),
      menuParentId:addMenuParent.val(),
      menuImage:addMenuImage.val(),
      menuLevel:addMenuLevel.val(),
      menuShortcut:addMenuShortcut.val()
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
    addMenuCode.val()==''||
    addMenuName.val()==''||
    addMenuOrder.val()==''||
    addMenuUrl.val()==''||
    addMenuType.val()==''||
    addMenuParent.val()==''||
    addMenuLevel.val()==''
  ){
    alert('必填项不能为空')
  }else{
    addMenu();
    $(".menuForm").submit();
  }
});

//修改函数
function modMenu(Id) {
  $.ajax({
    url: menuSave,
    type:'POST',
    dataType:'json',
    data:{
      id:Id,
      menuCode:modMenuCode.val(),
      menuName:modMenuName.val(),
      menuOrder:modMenuOrder.val(),
      menuUrl:modMenuUrl.val(),
      menuType:modMenuType.val(),
      menuParentId:modMenuParent.val(),
      menuImage:modMenuImage.val(),
      menuLevel:modMenuLevel.val(),
      menuShortcut:modMenuShortcut.val()
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
    getSingleMenu(ids[0]);
    $('#modMenu').attr('href','#mod-menu');

    $('.Modify').on('click',function () {
      if(
        modMenuCode.val()==''||
        modMenuName.val()==''||
        modMenuOrder.val()==''||
        modMenuUrl.val()==''||
        modMenuType.val()==''||
        modMenuParent.val()==''||
        modMenuLevel.val()==''
      ){
        alert('必填项不能为空')
      }else{
        modMenu(ids[0]);
        $(".menuForm").submit();
      }

    });
  }
};

//默认修改前数据
function getSingleMenu(Id) {
  $.ajax({
    type : "POST",
    url :getMenu,
    data:{
      menuId:Id
    },
    dataType : "json",
    success:function (json) {
      if(json.code == 200){
        modMenuCode.val(json.result.menuCode);
        modMenuName.val(json.result.menuName);
        modMenuOrder.val(json.result.menuOrder);
        modMenuUrl.val(json.result.menuUrl);
        modMenuType.val(json.result.menuType);
        modMenuParent.val(json.result.menuParentId);
        modMenuImage.val(json.result.menuImage);
        modMenuLevel.val(json.result.menuLevel);
        modMenuShortcut.val(json.result.menuShortcut);

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
      content: '确认删除该菜单吗？',
      buttons: {
        confirm: {
          text: '确认',
          btnClass: 'waves-effect waves-button',
          action: function () {
            var ids = new Array();
            for (var i in rows) {
              ids.push(rows[i].id);
            }
            deleteMenu(ids[0]);
            $(".menuForm").submit();
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
function deleteMenu(Id) {
  $.ajax({
    url: menuDelete,
    type:'POST',
    dataType:'json',
    data:{
      menuId:Id
    },
    success:function (json) {
      if(json.code == 200){

        if(json.result == 1){
          alert('删除成功');
        }else if(json.result == 0){
          alert('删除失败(该菜单存在下级子菜单)');
        }
      }
    }
  })
};