var $table = $('#table');
var getListFinancialInfo = pathUrl+'financial/getListFinancialInfo.do?pageSize=99999';
var getFinancialInfo = pathUrl+'financial/getFinancialInfo.do';
var auditFinancialInfo = pathUrl+'financial/auditFinancialInfo.do';

$('.modal-body div').css({display:'flex',justifyContent:'space-between'});
$('.modal-body span').css({width:'45%',display:'inline-block'});
$('.modal-body i').css({width:'100%'});

$.ajax({
  url: getListFinancialInfo,
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
          {field: 'productId', title: 'ID', sortable: true, align: 'center'},
          {field: 'type', title: '数据类型', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.type ==0){
              return '正式记录';
            }else if(row.type == 1){
              return '变更记录';
            }else{
              return '';
            }
          }},
          {field: 'name', title: '客户姓名', sortable: true, align: 'center'},
          {field: 'emplName', title: '理财顾问', sortable: true, align: 'center'},
          {field: 'productName', title: '产品名称', sortable: true, align: 'center'},
          {field: 'investmentAmount', title: '投资金额', sortable: true, align: 'center'},
          {field: 'expectedYield', title: '预期收益率', sortable: true, align: 'center',formatter:function (value, row, index) {
            return row.expectedYield+'%';
          }},
          {field: 'investmentDate', title: '投资日期', sortable: true, align: 'center',formatter:function (value, row, index) {
            return row.investmentDate.substr(0,10);
          }},
          {field: 'maturityDate', title: '到期日期', sortable: true, align: 'center',formatter:function (value, row, index) {
            return row.maturityDate.substr(0,10);
          }},
          {field: 'applyState', title: '申请单状态', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.applyState ==0){
              return '已保存待申请';
            }else if(row.applyState == 1){
              return '已申请待审核';
            }else if(row.applyState == 2){
              return '审核通过已变更';
            }else if(row.applyState == 4){
              return '审核不通过';
            }else{
              return '';
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
function finAudit(Id,Type,State) {
  $.ajax({
    url: auditFinancialInfo,
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
//理财审核
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
      $('#fin-audit .modal-title').text('正式记录详情');
    }else if(types[0] == 1){
      $('#fin-audit .modal-title').text('变更记录详情');
    }

    if(states[0] == 1){
      $('.manageChecke').css({display:'block'});
    }else{
      $('.manageChecke').css({display:'none'});
    }

    $('.auditImage b').html('');
    $('.otherFiles b').html('');
    getSingleFinan(ids[0],types[0]);
    $('#finAudit').attr('href','#fin-audit');

    var checkedState;
    $('.Added').on('click',function (event) {
      $('input[name=ckecked1]').map((index,radios)=>{
        if(radios.checked){
          checkedState = radios.value;
        };
      });

      if(checkedState == undefined){
        alert('请选择审核状态');
      }else{
        finAudit(rows[i].id,rows[i].type,checkedState);
        $(".finanForm").submit();
      }
      event.stopPropagation();
    });
  }
};
//审核选中显示数据
function getSingleFinan(Id,Type) {
  $.ajax({
    type : "POST",
    url :getFinancialInfo,
    data:{
      id:Id,
      type:Type
    },
    dataType : "json",
    success:function (json) {
      if(json.code == 200){
        var customerInfo = json.result.customerInfo;
        var financialInfo = json.result.financialInfo;
        var loanFile = json.result.loanFile;
        var otherFile = json.result.otherFile;
        var productInfo = json.result.productInfo;
        var transferBanklist = json.result.transferBanklist;

        $('.manageName').text(customerInfo.name?customerInfo.name:'');
        $('.manageMobile').text(customerInfo.mobile?customerInfo.mobile:'');
        $('.manageGender').text(customerInfo.genderName?customerInfo.genderName:'');
        $('.manageNational').text(customerInfo.national?customerInfo.national:'');
        $('.manageBirthday').text(customerInfo.birthday?customerInfo.birthday:'');
        $('.manageCertificateType').text(customerInfo.certificateTypeName?customerInfo.certificateTypeName:'');
        $('.manageCertificateNo').text(customerInfo.certificateNo?customerInfo.certificateNo:'');
        $('.manageEmail').text(customerInfo.email?customerInfo.email:'');
        $('.manageProductName').text(productInfo.productName?productInfo.productName:'');
        $('.manageProductLimit').text(productInfo.productLimit?productInfo.productLimit+productInfo.limitTypeName:'');
        $('.managePimitType').text(productInfo.limitTypeName?productInfo.limitTypeName:'');
        $('.manageExpectedYield').text(productInfo.expectedYield?productInfo.expectedYield+'%':'');
        $('.manageRepaymentType').text(productInfo.repaymentTypeName?productInfo.repaymentTypeName:'');
        $('.manageInvestmentAmount').text(financialInfo.investmentAmount?financialInfo.investmentAmount:'');
        $('.manageInvestmentDate').text(financialInfo.investmentDate?financialInfo.investmentDate:'');
        $('.manageAccountName').text(financialInfo.accountName?financialInfo.accountName:'');
        $('.manageMaturityDate').text(financialInfo.maturityDate?financialInfo.maturityDate:'');
        $('.manageAccountNo').text(financialInfo.accountNo?financialInfo.accountNo:'');
        $('.manageAccountBank').text(financialInfo.accountBank?financialInfo.accountBank:'');
        $('.manageBranchBank').text(financialInfo.branchBank?financialInfo.branchBank:'');

        $('.duandian1').html('');
        transferBanklist.map(function(item,index){
          var a = `
              <br />
              <br />
              <fieldset class="transferMsg">
                <legend>划款信息${index+1}</legend>
                <div>
                  <span>
                    <label>开户人姓名 : </label>
                    <i class="desc manageAccountName_transfer">${item.accountName}</i>
                  </span>
                  <span>
                    <label>银行卡账号 : </label>
                    <i class="desc manageAccountNo_transfer">${item.accountNo}</i>
                  </span>
                </div>
                <div>
                  <span>
                    <label>开户银行 : </label>
                    <i class="desc manageAccountBank_transfer">${item.accountBank}</i>
                  </span>
                  <span>
                    <label>开户支行 : </label>
                    <i class="desc manageBranchBank_transfer">${item.branchBank}</i>
                  </span>
                </div>
              </fieldset>
            `;
          $('.duandian1').append(a)

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

          $('.modal-body div').css({display:'flex',justifyContent:'space-between'});
          $('.modal-body span').css({width:'45%',display:'inline-block'});
          $('.modal-body i').css({width:'100%'});
        })

        //借款协议
        loanFile.map(function(item,index){
          var auditImg = `
              <img src="${item.attachmentUrlPath}" alt="">
            `;
          $('.auditImage b').append(auditImg);
          $('.auditImage').find('img').css({width:'100px',height:'100px',margin:'5px 10px',border:'1px solid #e4e4e4',cursor:'pointer'});
        })

        //其他文件
        otherFile.map(function(item,index){
          var otherFil = `
              <img src="${item.attachmentUrlPath}" alt="">
            `;
          $('.otherFiles b').append(otherFil);
          $('.otherFiles').find('img').css({width:'100px',height:'100px',margin:'5px 10px',border:'1px solid #e4e4e4',cursor:'pointer'});
        })

        //点击显示大图
        $('fieldset').find('img').on('click',function (event) {
          $('.windowImage').find('div').html(`<img src="${$(this)[0].src}" alt="">`);
          $('.windowImage').css({display:'block',opacity:1});
          var imgW = $('.windowImage div img').width()/2;
          var imgH = $('.windowImage div img').height()/2;
          $('.windowImage div').css({position:'absolute',left:'50%',top:'50%',marginLeft:-imgW+'px',marginTop:-imgH+'px'});
          event.stopPropagation();
        })

      }else{
        alert(json.msg);
      }
    }
  });
};

//理财详情
function detailAction() {
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
      $('#fin-detail .modal-title').text('正式记录详情');
    }else if(types[0] == 1){
      $('#fin-detail .modal-title').text('变更记录详情');
    }

    $('.auditImage b').html('');
    $('.otherFiles b').html('');
    getSingleFinanDetail(ids[0],types[0]);
    $('#finDetail').attr('href','#fin-detail');
  }
};
//理财详情选中显示数据
function getSingleFinanDetail(Id,Type) {
  $.ajax({
    type : "POST",
    url :getFinancialInfo,
    data:{
      id:Id,
      type:Type
    },
    dataType : "json",
    success:function (json) {
      if(json.code == 200){
        var customerInfo = json.result.customerInfo;
        var financialInfo = json.result.financialInfo;
        var loanFile = json.result.loanFile;
        var otherFile = json.result.otherFile;
        var productInfo = json.result.productInfo;
        var transferBanklist = json.result.transferBanklist;

        $('.manageName').text(customerInfo.name?customerInfo.name:'');
        $('.manageMobile').text(customerInfo.mobile?customerInfo.mobile:'');
        $('.manageGender').text(customerInfo.genderName?customerInfo.genderName:'');
        $('.manageNational').text(customerInfo.national?customerInfo.national:'');
        $('.manageBirthday').text(customerInfo.birthday?customerInfo.birthday:'');
        $('.manageCertificateType').text(customerInfo.certificateTypeName?customerInfo.certificateTypeName:'');
        $('.manageCertificateNo').text(customerInfo.certificateNo?customerInfo.certificateNo:'');
        $('.manageEmail').text(customerInfo.email?customerInfo.email:'');
        $('.manageProductName').text(productInfo.productName?productInfo.productName:'');
        $('.manageProductLimit').text(productInfo.productLimit?productInfo.productLimit+productInfo.limitTypeName:'');
        $('.managePimitType').text(productInfo.limitTypeName?productInfo.limitTypeName:'');
        $('.manageExpectedYield').text(productInfo.expectedYield?productInfo.expectedYield+'%':'');
        $('.manageRepaymentType').text(productInfo.repaymentTypeName?productInfo.repaymentTypeName:'');
        $('.manageInvestmentAmount').text(financialInfo.investmentAmount?financialInfo.investmentAmount:'');
        $('.manageInvestmentDate').text(financialInfo.investmentDate?financialInfo.investmentDate:'');
        $('.manageAccountName').text(financialInfo.accountName?financialInfo.accountName:'');
        $('.manageMaturityDate').text(financialInfo.maturityDate?financialInfo.maturityDate:'');
        $('.manageAccountNo').text(financialInfo.accountNo?financialInfo.accountNo:'');
        $('.manageAccountBank').text(financialInfo.accountBank?financialInfo.accountBank:'');
        $('.manageBranchBank').text(financialInfo.branchBank?financialInfo.branchBank:'');

        $('.duandian2').html('');
        transferBanklist.map(function(item,index){
          var b = `
              <br />
              <br />
              <fieldset class="transferMsg">
                <legend>划款信息${index+1}</legend>
                <div>
                  <span>
                    <label>开户人姓名 : </label>
                    <i class="desc manageAccountName_transfer">${item.accountName}</i>
                  </span>
                  <span>
                    <label>银行卡账号 : </label>
                    <i class="desc manageAccountNo_transfer">${item.accountNo}</i>
                  </span>
                </div>
                <div>
                  <span>
                    <label>开户银行 : </label>
                    <i class="desc manageAccountBank_transfer">${item.accountBank}</i>
                  </span>
                  <span>
                    <label>开户支行 : </label>
                    <i class="desc manageBranchBank_transfer">${item.branchBank}</i>
                  </span>
                </div>
              </fieldset>
            `;
          $('.duandian2').append(b)

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

          $('.modal-body div').css({display:'flex',justifyContent:'space-between'});
          $('.modal-body span').css({width:'45%',display:'inline-block'});
          $('.modal-body i').css({width:'100%'});
        })

        //借款协议
        loanFile.map(function(item,index){
          var auditImg = `
              <img src="${item.attachmentUrlPath}" alt="">
            `;
          $('.auditImage b').append(auditImg);
          $('.auditImage').find('img').css({width:'100px',height:'100px',margin:'5px 10px',border:'1px solid #e4e4e4',cursor:'pointer'});
        })

        //其他文件
        otherFile.map(function(item,index){
          var otherFil = `
              <img src="${item.attachmentUrlPath}" alt="">
            `;
          $('.otherFiles b').append(otherFil);
          $('.otherFiles').find('img').css({width:'100px',height:'100px',margin:'5px 10px',border:'1px solid #e4e4e4',cursor:'pointer'});
        })

        //点击显示大图
        $('fieldset').find('img').on('click',function (event) {
          $('.windowImage').find('div').html(`<img src="${$(this)[0].src}" alt="">`);
          $('.windowImage').css({display:'block',opacity:1});
          var imgW = $('.windowImage div img').width()/2;
          var imgH = $('.windowImage div img').height()/2;
          $('.windowImage div').css({position:'absolute',left:'50%',top:'50%',marginLeft:-imgW+'px',marginTop:-imgH+'px'});
          event.stopPropagation();
        })

      }else{
        alert(json.msg);
      }
    }
  });
};

$('.windowImage span').on('click',function (event) {
  $('.windowImage').css({display:'none',opacity:0});
  event.stopPropagation();
})