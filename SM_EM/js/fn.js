var $table = $('#table');
var emplList = pathUrl+'emplList.do?pageSize=99999';
var emplDelete = pathUrl+'emplDelete.do';
var emplSave = pathUrl+'emplSave.do';
var getEmpl = pathUrl+'getEmpl.do';
var allInstList = pathUrl+'allInstList.do';
var allEmplList = pathUrl+'allEmplList.do';
var enumList = pathUrl+'enumList.do';

var addEmplCode = $('#addEmplCode');
var addEmplName = $('#addEmplName');
var addEmplType = $('#addEmplType');
var addSuperEmplName = $('#addSuperEmplName');
var addGrade = $('#addGrade');
var addInstName = $('#addInstName');
var addEducation = $('#addEducation');
var addSex = $('#addSex');
var addBirthday = $('#addBirthday');
var addWorkDate = $('#addWorkDate');
var addOfficeDate = $('#addOfficeDate');
var addAddr = $('#addAddr');
var addPost = $('#addPost');
var addTel = $('#addTel');
var addMobile = $('#addMobile');
var addEmail = $('#addEmail');

var modEmplCode = $('#modEmplCode');
var modEmplName = $('#modEmplName');
var modEmplType = $('#modEmplType');
var modSuperEmplName = $('#modSuperEmplName');
var modGrade = $('#modGrade');
var modInstName = $('#modInstName');
var modEducation = $('#modEducation');
var modSex = $('#modSex');
var modBirthday = $('#modBirthday');
var modWorkDate = $('#modWorkDate');
var modOfficeDate = $('#modOfficeDate');
var modAddr = $('#modAddr');
var modPost = $('#modPost');
var modTel = $('#modTel');
var modMobile = $('#modMobile');
var modEmail = $('#modEmail');

$('.modal-body div').css({display:'flex',justifyContent:'space-between'});
$('.modal-body span').css({width:'45%',display:'inline-block'});
$('.modal-body input').css({width:'100%'});
$('.modal-body select').css({width:'100%'});

$.ajax({
  url: emplList,
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
          {field: 'emplCode', title: '员工编号', sortable: true, align: 'center'},
          {field: 'emplName', title: '员工姓名', sortable: true, align: 'center'},
          {field: 'emplType', title: '员工类型', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.emplType == '1'){
              return '系统管理员';
            }else if(row.emplType == '2'){
              return '业务主管';
            }else if(row.emplType == '3'){
              return '普通员工';
            }else{
              return '';
            }
          }},
          {field: 'superEmplName', title: '上级员工姓名', sortable: true, align: 'center'},
          {field: 'gradeName', title: '员工级别', sortable: true, align: 'center'},
          {field: 'instName', title: '所属机构名称', sortable: true, align: 'center'},
          {field: 'education', title: '教育程度', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.education == 'A'){
              return '博士';
            }else if(row.education == 'B'){
              return '硕士';
            }else if(row.education == 'C'){
              return '本科';
            }else if(row.education == 'D'){
              return '大专';
            }else if(row.education == 'E'){
              return '高中/中专';
            }else if(row.education == 'F'){
              return '初中';
            }else if(row.education == 'Z'){
              return '其他';
            }else{
              return '';
            }
          }},
          {field: 'sex', title: '员工性别', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.sex == 'M'){
              return '男';
            }else if(row.sex == 'F'){
              return '女';
            }else{
              return '';
            }
          }},
          {field: 'birthday', title: '员工生日', sortable: true, align: 'center'},
          {field: 'workDate', title: '工作日期', sortable: true, align: 'center'},
          {field: 'officeDate', title: '入职日期', sortable: true, align: 'center'},
          {field: 'addr', title: '家庭地址', sortable: true, align: 'center'},
          {field: 'post', title: '家庭邮编', sortable: true, align: 'center'},
          {field: 'tel', title: '家庭电话', sortable: true, align: 'center'},
          {field: 'mobile', title: '联系手机', sortable: true, align: 'center'},
          {field: 'email', title: '电子邮箱', sortable: true, align: 'center'},
          {field: 'ifDel', title: '状态', sortable: true, align: 'center',formatter:function (value, row, index) {
            if(row.ifDel == '0'){
              return '正常';
            }else if(row.ifDel == '1'){
              return '离职';
            }else{
              return '';
            }
          }}
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
var emplTypeData = [{text:'',id:''}];
var superEmplNameData = [{text:'',id:''}];
var gradeData = [{text:'',id:''}];
var instNameData = [{text:'',id:''}];
var educationData = [{text:'',id:''}];
var sexData = [{text:'',id:''}];

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

        if(item.enumTypeId == 20){
          var leixing = {text:item.enumName,id:item.enumValue};
          emplTypeData.push(leixing);
          $(".select_leixing").select2({
            data: emplTypeData,
            placeholder:'请选择',
            allowClear:true
          });
        }else if(item.enumTypeId == 7){
          var jibie = {text:item.enumName,id:item.enumValue};
          gradeData.push(jibie);
          $(".select_jibie").select2({
            data: gradeData,
            placeholder:'请选择',
            allowClear:true
          });
        }else if(item.enumTypeId == 2){
          var jiaoyu = {text:item.enumName,id:item.enumValue};
          educationData.push(jiaoyu);
          $(".select_jiaoyu").select2({
            data: educationData,
            placeholder:'请选择',
            allowClear:true
          });
        }else if(item.enumTypeId == 1){
          var xingbie = {text:item.enumName,id:item.enumValue};
          sexData.push(xingbie);
          $(".select_xingbie").select2({
            data: sexData,
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
        superEmplNameData.push(jigou);
        $(".select_jigou").select2({
          data: superEmplNameData,
          placeholder:'请选择',
          allowClear:true
        });
      });

    }
  }
});

//全部员工
$.ajax({
  url:allEmplList,
  type:'POST',
  dataType : "json",
  success:function (json) {
    if(json.msg == 'success'){
      json.result.map(function(item,index){
        var yuangong = {text:item.emplName,id:item.id};
        instNameData.push(yuangong);
        $(".select_yuangong").select2({
          data: instNameData,
          placeholder:'请选择',
          allowClear:true
        });
      });

    }
  }
});

//新增函数
function addEmpl() {
  $.ajax({
    url: emplSave,
    type:'POST',
    dataType:'json',
    data:{
      emplCode:addEmplCode.val(),
      emplName:addEmplName.val(),
      emplType:addEmplType.val(),
      superEmplId:addSuperEmplName.val(),
      grade:addGrade.val(),
      instId:addInstName.val(),
      education:addEducation.val(),
      sex:addSex.val(),
      birthday:addBirthday.val(),
      workDate:addWorkDate.val(),
      officeDate:addOfficeDate.val(),
      addr:addAddr.val(),
      post:addPost.val(),
      tel:addTel.val(),
      mobile:addMobile.val(),
      email:addEmail.val()
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
    addEmplCode.val()==''||
    addEmplName.val()==''||
    addEmplType.val()==''||
    addGrade.val()==''||
    addInstName.val()==''||
    addMobile.val()==''
  ){
    alert('必填项不能为空')
  }else{
    addEmpl();
    $(".emplForm").submit();
  }
});

//修改函数
function modEmpl(Id) {
  $.ajax({
    url: emplSave,
    type:'POST',
    dataType:'json',
    data:{
      id:Id,
      emplCode:modEmplCode.val(),
      emplName:modEmplName.val(),
      emplType:modEmplType.val(),
      superEmplId:modSuperEmplName.val(),
      grade:modGrade.val(),
      instId:modInstName.val(),
      education:modEducation.val(),
      sex:modSex.val(),
      birthday:modBirthday.val(),
      workDate:modWorkDate.val(),
      officeDate:modOfficeDate.val(),
      addr:modAddr.val(),
      post:modPost.val(),
      tel:modTel.val(),
      mobile:modMobile.val(),
      email:modEmail.val()
    },
    success:function (json) {
      if(json.code == 200){
        alert(json.result);
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
    getSingleEmpl(ids[0]);
    $('#modEmpl').attr('href','#mod-empl');

    $('.Modify').on('click',function () {
      if(
        modEmplCode.val()==''||
        modEmplName.val()==''||
        modEmplType.val()==''||
        modGrade.val()==''||
        modInstName.val()==''||
        modMobile.val()==''
      ){
        alert('必填项不能为空')
      }else{
        modEmpl(ids[0]);
        $(".emplForm").submit();
      }
    });
  }
};

//默认修改前数据
function getSingleEmpl(Id) {
  $.ajax({
    type : "POST",
    url :getEmpl,
    data:{
      emplId:Id
    },
    dataType : "json",
    success:function (json) {
      if(json.code == 200){
        modEmplCode.val(json.result.emplCode);
        modEmplName.val(json.result.emplName);
        modEmplType.val(json.result.emplType);
        modSuperEmplName.val(json.result.superEmplId);
        modGrade.val(json.result.grade);
        modInstName.val(json.result.instId);
        modEducation.val(json.result.education);
        modSex.val(json.result.sex);
        modBirthday.val(`${json.result.birthday.substr(0,10)}`);
        modWorkDate.val(`${json.result.workDate.substr(0,10)}`);
        modOfficeDate.val(`${json.result.officeDate.substr(0,10)}`);
        modAddr.val(json.result.addr);
        modPost.val(json.result.post);
        modTel.val(json.result.tel);
        modMobile.val(json.result.mobile);
        modEmail.val(json.result.email);
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
            deleteEmpl(ids[0]);
            $(".emplForm").submit();
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
function deleteEmpl(Id) {
  $.ajax({
    url: emplDelete,
    type:'POST',
    dataType:'json',
    data:{
      emplId:Id
    },
    success:function (json) {
      if(json.code == 200){
        if(json.result == 0){
          alert('该员工还有关联的员工,客户或理财,不能离职');
        }else if(json.result == 1){
          alert('离职成功');
        }
      }
    }
  })
};