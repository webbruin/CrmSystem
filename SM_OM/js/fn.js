var $table = $('#table');
var instList = pathUrl+'instList.do?pageSize=99999';
var instDelete = pathUrl+'instDelete.do';
var instSave = pathUrl+'instSave.do';
var getInst = pathUrl+'getInst.do';
var allInstList = pathUrl+'allInstList.do';
var enumList = pathUrl+'enumList.do';

var addInstCode = $('#addInstCode');
var addInstName = $('#addInstName');
var addInstLevel = $('#addInstLevel');
var addInstType = $('#addInstType');
var addInstStatus = $('#addInstStatus');
var addContact = $('#addContact');
var addSuperInstName = $('#addSuperInstName');
var addInstDescribe = $('#addInstDescribe');
var addInstAddr = $('#addInstAddr');
var addInstPost = $('#addInstPost');
var addStateCode = $('#addStateCode');
var addCityCode = $('#addCityCode');
var addEnInstName = $('#addEnInstName');
var addEnInstAddr = $('#addEnInstAddr');
var addInstTel = $('#addInstTel');
var addInstFax = $('#addInstFax');
var addInstEmail = $('#addInstEmail');

var modInstCode = $('#modInstCode');
var modInstName = $('#modInstName');
var modInstLevel = $('#modInstLevel');
var modInstType = $('#modInstType');
var modInstStatus = $('#modInstStatus');
var modContact = $('#modContact');
var modSuperInstName = $('#modSuperInstName');
var modInstDescribe = $('#modInstDescribe');
var modInstAddr = $('#modInstAddr');
var modInstPost = $('#modInstPost');
var modStateCode = $('#modStateCode');
var modCityCode = $('#modCityCode');
var modEnInstName = $('#modEnInstName');
var modEnInstAddr = $('#modEnInstAddr');
var modInstTel = $('#modInstTel');
var modInstFax = $('#modInstFax');
var modInstEmail = $('#modInstEmail');

$('.modal-body div').css({display:'flex',justifyContent:'space-between'});
$('.modal-body span').css({width:'45%',display:'inline-block'});
$('.modal-body input').css({width:'100%'});
$('.modal-body select').css({width:'100%'});

$.ajax({
  url: instList,
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
          {field: 'instCode', title: '机构编号', sortable: true, align: 'center'},
          {field: 'instName', title: '机构名称', sortable: true, align: 'center'},
          {field: 'instLevel', title: '机构等级', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.instLevel == '1'){
              return '一级机构';
            }else if(row.instLevel == '2'){
              return '二级机构';
            }else if(row.instLevel == '3'){
              return '三级机构';
            }else{
              return '';
            }
          }},
          {field: 'instType', title: '机构类型', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.instType == '0'){
              return '总部';
            }else if(row.instType == '1'){
              return '直销';
            }else if(row.instType == '2'){
              return '渠道';
            }else{
              return '';
            }
          }},
          {field: 'instStatus', title: '机构状态', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.instStatus == '1'){
              return '正常机构';
            }else if(row.instStatus == '2'){
              return '撤销机构';
            }else{
              return '';
            }
          }},
          {field: 'contact', title: '联系人', sortable: true, align: 'center'},
          {field: 'superInstName', title: '上级机构名称', sortable: true, align: 'center'},
        ],
        data:json.result.result.result
      });

    }
  }
});


//＋展示所有键值对
function detailFormatter(index, row) {
  var html = [];
  $.each(row, function (key, value) {
    html.push('<p><b>' + key + ':</b> ' + value + '</p>');
  });
  return html.join('');
}

//下拉枚举数据
var superInstIdData = [{text:'',id:''}];
var instLevelData = [{text:'',id:''}];
var instTypeData = [{text:'',id:''}];
var instStatusData = [{text:'',id:''}];

$.ajax({
  url: enumList,
  type:'POST',
  data:{
    pageSize:999
  },
  dataType:'json',
  success:function (json) {
    if(json.msg == 'success'){
      json.result.result.result.map(function (item,index) {
        if(item.enumTypeId == 4){
          var dengji = {text:item.enumName,id:item.enumValue};
          instLevelData.push(dengji);
          $(".select_dengji").select2({
            data: instLevelData,
            placeholder:'请选择',
            allowClear:true
          });
        }else if(item.enumTypeId == 5){
          var leixing = {text:item.enumName,id:item.enumValue};
          instTypeData.push(leixing);
          $(".select_leixing").select2({
            data: instTypeData,
            placeholder:'请选择',
            allowClear:true
          });
        }else if(item.enumTypeId == 6){
          var zhuangtai = {text:item.enumName,id:item.enumValue};
          instStatusData.push(zhuangtai);
          $(".select_zhuangtai").select2({
            data: instStatusData,
            placeholder:'请选择',
            allowClear:true
          });
        }
      })
    }
  }
});

//全部机构
$.ajax({
  url:allInstList,
  type:'POST',
  dataType : "json",
  success:function (json) {
    if(json.msg == 'success'){
      json.result.map(function(item,index){
        var jigou = {text:item.instName,id:item.id};
        superInstIdData.push(jigou);
        $(".select_jigou").select2({
          data: superInstIdData,
          placeholder:'请选择',
          allowClear:true
        });
      });

    }
  }
});

//新增函数
function addInst() {
  $.ajax({
    url: instSave,
    type:'POST',
    dataType:'json',
    data:{
      instCode:addInstCode.val(),
      instName:addInstName.val(),
      superInstId:addSuperInstName.val(),
      instLevel:addInstLevel.val(),
      instType:addInstType.val(),
      instStatus:addInstStatus.val(),
      instDescribe:addInstDescribe.val(),
      instAddr:addInstAddr.val(),
      instPost:addInstPost.val(),
      stateCode:addStateCode.val(),
      cityCode:addCityCode.val(),
      enInstName:addEnInstName.val(),
      enInstAddr:addEnInstAddr.val(),
      instTel:addInstTel.val(),
      instFax:addInstFax.val(),
      instEmail:addInstEmail.val(),
      contact:addContact.val()
    },
    success:function (json) {
      if(json.code == 200){
        if(json.result == 0){
          alert(json.msg);

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
    addInstCode.val()==''||
    addInstName.val()==''||
    addInstLevel.val()==''||
    addInstType.val()==''||
    addInstStatus.val()==''
  ){
    alert('必填项不能为空')
  }else{
    addInst();
    $(".instForm").submit();
  }
});

//修改函数
function modInst(Id) {
  $.ajax({
    url: instSave,
    type:'POST',
    dataType:'json',
    data:{
      id:Id,
      instCode:modInstCode.val(),
      instName:modInstName.val(),
      superInstId:modSuperInstName.val(),
      instLevel:modInstLevel.val(),
      instType:modInstType.val(),
      instStatus:modInstStatus.val(),
      instDescribe:modInstDescribe.val(),
      instAddr:modInstAddr.val(),
      instPost:modInstPost.val(),
      stateCode:modStateCode.val(),
      cityCode:modCityCode.val(),
      enInstName:modEnInstName.val(),
      enInstAddr:modEnInstAddr.val(),
      instTel:modInstTel.val(),
      instFax:modInstFax.val(),
      instEmail:modInstEmail.val(),
      contact:modContact.val()
    },
    success:function (json) {
      if(json.code == 200){
        if(json.result == 0){
          alert(json.msg);
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
    getSingleInst(ids[0]);
    $('#modInst').attr('href','#mod-inst');

    $('.Modify').on('click',function () {
      if(
        modInstCode.val()==''||
        modInstName.val()==''||
        modInstLevel.val()==''||
        modInstType.val()==''||
        modInstStatus.val()==''
      ){
        alert('必填项不能为空')
      }else{
        modInst(ids[0]);
        $(".instForm").submit();
      }

    });
  }
}

//默认修改前数据
function getSingleInst(Id) {
  $.ajax({
    type : "POST",
    url :getInst,
    data:{
      instId:Id
    },
    dataType : "json",
    success:function (json) {
      if(json.code == 200){
        modInstCode.val(json.result.instCode);
        modInstName.val(json.result.instName);
        modSuperInstName.val(json.result.superInstId);
        modInstLevel.val(json.result.instLevel);
        modInstType.val(json.result.instType);
        modInstStatus.val(json.result.instStatus);
        modInstDescribe.val(json.result.instDescribe);
        modInstAddr.val(json.result.instAddr);
        modInstPost.val(json.result.instPost);
        modStateCode.val(json.result.stateCode);
        modCityCode.val(json.result.cityCode);
        modEnInstName.val(json.result.enInstName);
        modEnInstAddr.val(json.result.enInstAddr);
        modInstTel.val(json.result.instTel);
        modInstFax.val(json.result.instFax);
        modInstEmail.val(json.result.instEmail);
        modContact.val(json.result.contact);
      }else{
        alert(json.msg);
      }
    }
  });
}

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
      content: '确认删除该机构吗？',
      buttons: {
        confirm: {
          text: '确认',
          btnClass: 'waves-effect waves-button',
          action: function () {
            var ids = new Array();
            for (var i in rows) {
              ids.push(rows[i].id);
            }
            deleteInst(ids[0]);
            $(".instForm").submit();
          }
        },
        cancel: {
          text: '取消',
          btnClass: 'waves-effect waves-button'
        }
      }
    });
  }
}
//删除函数
function deleteInst(Id) {
  $.ajax({
    url: instDelete,
    type:'POST',
    dataType:'json',
    data:{
      instId:Id
    },
    success:function (json) {
      if(json.code == 200){
        alert(json.result);
      }
    }
  })
}