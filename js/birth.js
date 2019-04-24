/**
 * 门票录入页面：出生日期限制 组件
 * 功能：1. 设置值 2. 获取值 3.多个日期添加 4.可增加删除修改 5.日期有效校验
 * @author 李检舟
 * @date 2019-4-22
 */
layui.define(['form', 'laytpl', 'jquery'], function (exports) {
    var form = layui.form, $ = layui.$, laytpl = layui.laytpl, that = null,
        tpl = ['<div style="margin-bottom:0;" class="layui-form-item"><div class="layui-inline">',
            '	<div class="layui-input-inline" style="width: 60px;padding-right:2px;"><select lay-filter="monthx" class="monthx1">{{d.optmonth}}</select></div>',
            '	<div class="layui-form-mid">月</div>',
            '	<div class="layui-input-inline" style="width: 60px;"><select lay-filter="dayx" class="dayx1">{{d.optday}}</select></div>',
            '	<div class="layui-form-mid">日</div>',
            '	<div class="layui-form-mid" style="color:#999;">—</div>',
            '	<div class="layui-input-inline" style="width: 60px;"><select lay-filter="monthx" class="monthx2">{{d.optmonth2}}</select></div>',
            '	<div class="layui-form-mid">月</div>',
            '	<div class="layui-input-inline" style="width: 60px;"><select lay-filter="dayx" class="dayx2">{{d.optday2}}</select></div>',
            '	<div class="layui-form-mid">日</div>',
            '	{{#  if(d.add == 0){ }}',
            '	    <div class="layui-form-mid actionAdd" style="cursor:pointer;"><i class="layui-icon layui-icon-add-1 layui-bg-green"></i></div>',
            '	{{#  }else{ }}',
            '	<div class="layui-form-mid actionDel" style="cursor:pointer;"><i class="layui-icon layui-icon-close layui-bg-red"></i></div>',
            '	{{#  } }}',
            '</div></div>'].join('');

    // 月最大天数
    function daysInMonth(month) {
        var maxDay = 0;
        switch (month) {
            case 1 :
            case 3 :
            case 5 :
            case 7 :
            case 8 :
            case 10 :
            case 12 :
                maxDay = 31;
                break;
            case 2 :
                maxDay = 29;
                break;
            case 4 :
            case 6 :
            case 9 :
            case 11 :
            default:
                maxDay = 30;
                break;
        }

        return maxDay;
    };

    // 生成选项
    function options(max, selected) {
        var html = "";
        for (var i = 1; i <= max; i++) {
            var s = selected == i ? "selected" : "";
            html += "<option value=" + i + " " + s + ">" + i + "</option>";
        }
        return html;
    };

    var e = {
        render: function (id, data) {// 生成页面
            var add = that ? (that.added ? 1 : 0) : 0;
            var blank = {
                'add': add,
                'optmonth': options(12, 1),
                'optday': options(31, 1),
                'optmonth2': options(12, 1),
                'optday2': options(31, 1)
            }, htmls = '', count = data ? data.data.length : 0;

            that = this;
            that.id = id;
            that.added = 1;

            if (!count) {
                htmls = laytpl(tpl).render(blank);
            } else {
                for (var i = 0; i < count; i++) {
                    var o = data.data[i], startMonth = o.startMonth, startDay = o.startDay, endMonth = o.endMonth, endDay = o.endDay;
                    var maxStartDay = daysInMonth(startMonth), maxEndDay = daysInMonth(endMonth), json = {
                        'add': i == 0 ? 0 : 1,
                        'optmonth': options(12, startMonth),
                        'optday': options(maxStartDay, startDay),
                        'optmonth2': options(12, endMonth),
                        'optday2': options(maxEndDay, endDay)
                    };
                    htmls += laytpl(tpl).render(json);
                }
            }
            $('#' + id).append(htmls);
            form.render('select');

            $('.actionAdd').off('click').on('click', function () {
                that.render(that.id);
                form.render('select');
            });

            $('.actionDel').off('click').on('click', function () {
                //console.log(this);
                $(this).parent().parent().remove();
            });

            //响应动态天数事件
            form.on('select(monthx)', function (data) {
                var month = data.value, day = 30;
                if (month == 2) {
                    day = 29;
                } else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                    day = 31;
                }
                var opt = options(day, 1);

                //console.log(data.othis.parent().next().next().find('.startd'))
                data.othis.parent().next().next().find('.dayx').html('').html(opt);
                form.render('select');

            });
        },

        val: function () {// 返回值
            var mm1 = $('.monthx1'), dd1 = $('.dayx1'), mm2 = $('.monthx2'), dd2 = $('.dayx2');
            var count = mm1.size(), data = {
                data: []
            };

            //遍历取值
            for (var i = 0; i < count; i++) {
                var obj = {};
                obj.startMonth = $(mm1[i]).val();
                obj.startDay = $(dd1[i]).val();
                obj.endMonth = $(mm2[i]).val();
                obj.endDay = $(dd2[i]).val();
                data.data.push(obj);
            }

            var valid = true, dd = data.data;
            //交换排序
            for (var i = 0; i < count; i++) {
                var min = dd[i];
                var minIndex = i;
                for (var j = i + 1; j < count; j++) {
                    if (min.startMonth > dd[j].startMonth) {
                        min = dd[j];
                        minIndex = j;
                    }
                }

                /*将最小值插入到unfixed，并且把它所在的原有项替换成*/
                dd.splice(i, 0, min);
                dd.splice(minIndex + 1, 1);
                console.log(JSON.stringify(dd));
            }
            //同组内：结束日期>开始日期
            for (var i = 0; i < count; i++) {
                var m = parseFloat(dd[i].startMonth + '.' + dd[i].startDay), n = parseFloat(dd[i].endMonth + '.' + dd[i].endDay);
                if (n - m < 0) {
                    console.log(n+" - "+m+" 日期有矛盾：结束日期不能小于开始日期");
                    valid = false;
                    break;
                }
            }
            //相邻组间：开始日期>上一结束日期
            for (var i = 0; i < count - 1; i++) {
                var m = parseFloat(dd[i + 1].startMonth + '.' + dd[i + 1].startDay), n = parseFloat(dd[i].endMonth + '.' + dd[i].endDay);

                if (m - n < 0) {
                    console.log(m+" - "+n+" 日期有重合：不同组之间不能有重合");
                    valid = false;
                    break;
                }
            }
            if (!valid) {
                alert('数据不合法')
            }

            return data;
        }

    };

    exports('birth', e);
});
