/**
  本js文件为门票产品的录入服务
**/
layui.define(['layer', 'jquery', 'element',  'laytpl', 'formSelects', 'laydate', 'table', 'form'], function(exports) {
	var layer = layui.layer,
		$ = layui.jquery,
		element = layui.element,
		formSelects = layui.formSelects,
		laydate = layui.laydate,
		table = layui.table,
		form = layui.form;
		laytpl=layui.laytpl;
		
		// 在供应商产品编号后面的文本框中显示从数据库中生成的产品编号
		var productSN="abc"
		 $("#inputTxtProductSN").val(productSN);
		
		

// 点击选择常用企业按钮时弹出一个弹出层
	$('#btnCooperativeCompany').on('click', function() {
		layer.open({
			type: 1,
			title: '常用合作企业',
			area: ['500px', '300px'],
			btn: ['确定', '取消'],
			content: '常用合作企业'
		});
	});
	
	//点击渠道控制单选按钮，控制单选框样式 
	form.on('radio(cooperateShared)', function(data) {
		if (data.value == 1) {
			$("#btnCooperativeCompany").addClass("layui-btn-disabled");
			$("#btnCooperativeCompany").attr("disabled", "disabled");
			formSelects.disabled('selectChannelCtr');
			formSelects.value('selectChannelCtr', []);
		} else {
			$("#btnCooperativeCompany").removeClass("layui-btn-disabled");
			$("#btnCooperativeCompany").removeAttr("disabled", "disabled");
			formSelects.undisabled('selectChannelCtr');
		}
	})

	

	exports('productTicket', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});
