var $table = $('#table');
var getListProductInfo = pathUrl+'product/getListProductInfo.do?pageSize=99999';
var saveProductInfo = pathUrl+'product/saveProductInfo.do';
var saveProductInfo = pathUrl+'product/saveProductInfo.do';
var getProductInfo = pathUrl+'product/getProductInfo.do';

var addProdName = $('#addProdName');
var addProdLimit = $('#addProdLimit');
var addLimitType = $('#addLimitType');
var addExpectedYield = $('#addExpectedYield');
var addRepaymentType = $('#addRepaymentType');

var modProdName = $('#modProdName');
var modProdLimit = $('#modProdLimit');
var modLimitType = $('#modLimitType');
var modExpectedYield = $('#modExpectedYield');
var modRepaymentType = $('#modRepaymentType');

$('.modal-body div').css({display:'flex',justifyContent:'space-between'});
$('.modal-body span').css({width:'100%',display:'inline-block'});
$('.modal-body input').css({width:'100%'});
$('.modal-body select').css({width:'100%'});

$.ajax({
  url: getListProductInfo,
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
          {field: 'productName', title: '产品名称', sortable: true, align: 'center'},
          {field: 'productLimit', title: '产品期限', sortable: true, align: 'center'},
          {field: 'limitTypeName', title: '期限类型', sortable: true, align: 'center'},
          {field: 'expectedYield', title: '预期收益率', sortable: true, align: 'center',formatter:function (value, row, index) {
            return row.expectedYield+'%';
          }},
          {field: 'repaymentTypeName', title: '还款方式', sortable: true, align: 'center'},
          {field: 'createTime', title: '创建时间', sortable: true, align: 'center',formatter:function (value, row, index) {
            return row.createTime.substr(0,10);
          }}
        ],
        data:json.result.result
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
var limitTypeData = [{text:'',id:''}];
var repaymentTypeData = [{text:'',id:''}];

$.ajax({
  url: '/resources/data/business.json',
  type:'POST',
  dataType:'json',
  success:function (json) {
    json.map(function (item,index) {
      if(item.title == 'limitType'){
        item.content.map(function (msg,addr) {
          var cplx = {text:msg.text,id:msg.id};
          limitTypeData.push(cplx);
          $(".select_cplx").select2({
            data: limitTypeData,
            placeholder:'请选择',
            allowClear:true
          });
        })
      }else if(item.title == 'repaymentType'){
        item.content.map(function (msg,addr) {
          var hkfs = {text:msg.text,id:msg.id};
          repaymentTypeData.push(hkfs);
          $(".select_hkfs").select2({
            data: repaymentTypeData,
            placeholder:'请选择',
            allowClear:true
          });
        })
      }
    });
  }
});

//新增函数
function addProd() {
  $.ajax({
    url: saveProductInfo,
    type:'POST',
    dataType:'json',
    data:{
      productName:addProdName.val(),
      productLimit:addProdLimit.val(),
      limitType:addLimitType.val(),
      expectedYield:addExpectedYield.val(),
      repaymentType:addRepaymentType.val()
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
    addProdName.val()==''||
    addProdLimit.val()==''||
    addLimitType.val()==''||
    addExpectedYield.val()==''||
    addRepaymentType.val()==''
  ){
    alert('必填项不能为空')
  }else{
    addProd();
    $(".prodForm").submit();
  }
});

//修改函数
function modProd(Id) {
  $.ajax({
    url: saveProductInfo,
    type:'POST',
    dataType:'json',
    data:{
      id:Id,
      productName:modProdName.val(),
      productLimit:modProdLimit.val(),
      limitType:modLimitType.val(),
      expectedYield:modExpectedYield.val(),
      repaymentType:modRepaymentType.val()
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
    getSingleProd(ids[0]);
    $('#modProd').attr('href','#mod-prod');

    $('.Modify').on('click',function () {
      if(
        modProdName.val()==''||
        modProdLimit.val()==''||
        modLimitType.val()==''||
        modExpectedYield.val()==''||
        modRepaymentType.val()==''
      ){
        alert('必填项不能为空')
      }else{
        modProd(ids[0]);
        $(".prodForm").submit();
      }
    });
  }
};

//默认修改前数据
function getSingleProd(Id) {
  $.ajax({
    type : "POST",
    url :getProductInfo,
    data:{
      id:Id
    },
    dataType : "json",
    success:function (json) {
      if(json.code == 200){
        modProdName.val(json.result.productName);
        modProdLimit.val(json.result.productLimit);
        modLimitType.val(json.result.limitType);
        modExpectedYield.val(json.result.expectedYield);
        modRepaymentType.val(json.result.repaymentType);
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
      content: '确认删除该产品吗？',
      buttons: {
        confirm: {
          text: '确认',
          btnClass: 'waves-effect waves-button',
          action: function () {
            var ids = new Array();
            for (var i in rows) {
              ids.push(rows[i].id);
            }
            deleteProd(ids[0]);
            $(".prodForm").submit();
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
function deleteProd(Id) {
  $.ajax({
    url: saveProductInfo,
    type:'POST',
    dataType:'json',
    data:{
      id:Id
    },
    success:function (json) {
      if(json.code == 200){
        alert('删除成功');
      }
    }
  })
};