var $table = $('#table');
var getListAllCustomerInfo = pathUrl+'customer/getListAllCustomerInfo.do?pageSize=99999';
var auditCustomerInfo = pathUrl+'customer/auditCustomerInfo.do';
var getCustomerInfo = pathUrl+'customer/getCustomerInfo.do';
var getListYumiEmployee = pathUrl+'customer/getListYumiEmployee.do';
var updateCustomerCounselorId = pathUrl+'customer/updateCustomerCounselorId.do';

$('.modal-body div').css({display:'flex',justifyContent:'space-between'});
$('.modal-body span').css({width:'45%',display:'inline-block'});
$('.modal-body i').css({width:'100%'});
$('.modal-body select').css({width:'60%'});

$.ajax({
  url: getListAllCustomerInfo,
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
          {field: 'type', title: '数据类型', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.type ==0){
              return '正式记录';
            }else if(row.type == 1){
              return '变更记录';
            }else{
              return '';
            }
          }},
          {field: 'emplName', title: '理财顾问', sortable: true, align: 'center'},
          {field: 'name', title: '客户姓名', sortable: true, align: 'center'},
          {field: 'mobile', title: '手机', sortable: true, align: 'center'},
          {field: 'genderName', title: '性别', sortable: true, align: 'center'},
          {field: 'certificateTypeName', title: '证件类型', sortable: true, align: 'center'},
          {field: 'certificateNo', title: '证件类型', sortable: true, align: 'center'},
          {field: 'applyState', title: '申请单状态', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.type ==0){
              if(row.applyState == 1){
                return '未审核';
              }else if(row.applyState == 2){
                return '已审核';
              }else{
                return '';
              }
            }else if(row.type == 1){
              if(row.applyState ==0){
                return '已保存待申请';
              }else if(row.applyState == 1){
                return '已申请待审核';
              }else if(row.applyState == 2){
                return '审核通过已变更';
              }else if(row.applyState == 3){
                return '审核不通过';
              }else{
                return '';
              }
            }
          }},
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

//审核功能
function clientAudit(Id,Type,State) {
  $.ajax({
    url: auditCustomerInfo,
    type:'POST',
    dataType:'json',
    data:{
      id:Id,
      type:Type,
      applyState:State
    },
    success:function (json) {
      if(json.code == 200){
        if(json.msg == 'success'){
          alert('审核成功');
        }else{
          alert(json.msg);
        }
      }
    }
  })
};
// 客户审核
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
    var types = new Array();
    var states = new Array();
    for (var i in rows) {
      ids.push(rows[i].id);
      types.push(rows[i].type);
      states.push(rows[i].applyState);
    };

    if(types[0] == 0){
      $('#client-audit .modal-title').text('正式记录详情');
    }else if(types[0] == 1){
      $('#client-audit .modal-title').text('变更记录详情');
    }

    if(states[0] == 1){
      $('.clientChecke').css({display:'block'});
    }else{
      $('.clientChecke').css({display:'none'});
    }
    getSingleClient(ids[0],types[0]);
    $('#clientAudit').attr('href','#client-audit');

    var radioState;
    $('.Added').on('click',function () {
      $('input[name=radio]').map((index,radios3)=>{
        if(radios3.checked){
          radioState = radios3.value;
        };
      })
      if(radioState == undefined){
        alert('请选择审核状态');
      }else{
        clientAudit(rows[i].id,rows[i].type,radioState);
        console.log(radioState);
        $(".clientForm").submit();
      }
    });
  }
};

//审核选中显示数据
function getSingleClient(Id,Type) {
  $.ajax({
    type : "POST",
    url :getCustomerInfo,
    data:{
      id:Id,
      type:Type
    },
    dataType : "json",
    success:function (json) {
      if(json.code == 200){
        var customerInfo = json.result.customerInfo;
        var yumiEmployee = json.result.yumiEmployee;

        $('.clientName').text(customerInfo.name?customerInfo.name:'');
        $('.clientProMobile').text(customerInfo.mobile?customerInfo.mobile:'');
        $('.clientGender').text(customerInfo.genderName?customerInfo.genderName:'');
        $('.clientNational').text(customerInfo.national?customerInfo.national:'');
        $('.clientBirthday').text(customerInfo.birthday?customerInfo.birthday:'');
        $('.clientCertificateType').text(customerInfo.certificateTypeName?customerInfo.certificateTypeName:'');
        $('.clientCertificateType').text(customerInfo.certificateNo?customerInfo.certificateNo:'');
        $('.clientEducation').text(customerInfo.educationName?customerInfo.educationName:'');
        $('.clientHobby').text(customerInfo.hobby?customerInfo.hobby:'');
        $('.clientAddress').text(customerInfo.address?customerInfo.address:'');
        $('.clientWorkingState').text(customerInfo.workingStateName?customerInfo.workingStateName:'');
        $('.clientIndustryCategory').text(customerInfo.industryCategoryName?customerInfo.industryCategoryName:'');
        $('.clientFamilyIncome').text(customerInfo.familyIncomeName?customerInfo.familyIncomeName:'');
        $('.clientUsableInvest').text(customerInfo.usableInvestName?customerInfo.usableInvestName:'');
        $('.clientEmplName').text(yumiEmployee.emplName?yumiEmployee.emplName:'');
      }else{
        alert(json.msg);
      }
    }
  });
};



//下拉枚举数据
var counselorData = [{text:'',id:''}];
//全部菜单
$.ajax({
  url:getListYumiEmployee,
  type:'POST',
  data:{
    pageSize:999
  },
  dataType : "json",
  success:function (json) {
    if(json.msg == 'success'){
      json.result.result.map(function(item,index){
        var gwxz = {text:item.emplName,id:item.id};
        counselorData.push(gwxz);
        $(".select_gwxz").select2({
          data: counselorData,
          placeholder:'请选择',
          allowClear:true
        });
      });

    }
  }
});

//变更顾问功能
function changeFinCons(Id,counsId) {
  $.ajax({
    url: updateCustomerCounselorId,
    type:'POST',
    dataType:'json',
    data:{
      id:Id,
      counselorId:counsId
    },
    success:function (json) {
      if(json.code == 200){
        if(json.msg == 'success'){
          alert('变更成功');
        }else{
          alert(json.msg);
        }
      }
    }
  })
};
// 变更理财顾问
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
    var ids = new Array();
    var types = new Array();
    var states = new Array();
    for (var i in rows) {
      ids.push(rows[i].id);
      types.push(rows[i].type);
      states.push(rows[i].applyState);
    };

    if(types[0] == 0){
      $('#change-fin-cons .modal-title').text('正式记录详情');
    }else if(types[0] == 1){
      $('#change-fin-cons .modal-title').text('变更记录详情');
    }

    if(states[0] == 2){
      $('.counsSelect').css({display:'block'});
    }else{
      $('.counsSelect').css({display:'none'});
    }
    getSingleChangeAdv(ids[0],types[0]);
    $('#changeFinCons').attr('href','#change-fin-cons');

    $('.Modify').on('click',function () {
      changeFinCons(ids[0],$('.customerInf').val());
      $(".clientForm").submit();
    });
  }
};
//变更顾问选中显示数据
function getSingleChangeAdv(Id,Type) {
  $.ajax({
    type : "POST",
    url :getCustomerInfo,
    data:{
      id:Id,
      type:Type
    },
    dataType : "json",
    success:function (json) {
      if(json.code == 200){
        var yumiEmployee = json.result.yumiEmployee;

        $('.counsEmplName').text(yumiEmployee.emplName?yumiEmployee.emplName:'');
        $('.counsEmplCode').text(yumiEmployee.emplCode?yumiEmployee.emplCode:'');
        $('.counsMobile').text(yumiEmployee.mobile?yumiEmployee.mobile:'');
        $('.customerInf').val(yumiEmployee.id);
      }else{
        alert(json.msg);
      }
    }
  });
};