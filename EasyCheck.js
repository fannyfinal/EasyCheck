// jQuery EasyCheck Plugin
//
// Version 2.3.0
//
// Copy By RAY
// inthinkcolor@gmail.com
// 2012
//
// http://plugins.jquery.com/EasyCheck/
//
(function(window) {
  var // 添加Form类验证
  addChkForm = function(chkrule, fromChkInfo) {
    var chkElements = chkrule.chkAttr ? "[" + chkrule.chkName + "]" :"[class~='" + chkrule.chkName + "']";
    $(fromChkInfo.eleArea + chkElements).each(function(index, element) {
      if (!fromChkInfo.errorEleArray[$(element).attr("name")]) {
        // 已出错提示元素不再验证
        var flag = chkrule.chkFunction(element);
        if (!flag) {
          // 验证未通过
          fromChkInfo.errorEleArray[$(element).attr("name")] = "E";
          // 加入未通过数组
          fromChkInfo.chkFlag = false;
        }
      } else {
        fromChkInfo.chkFlag = false;
      }
    });
  }, errorManger = function(param) {
    var s = "";
    if (param.formId) {
      s = "[id='" + param.formId + "'] ";
    }
    $(s + "[id^='error_']").each(function() {
      var oName = $(this).attr("id").replace("error_", "");
      var n = $(s + "[name='" + oName + "']");
      if (EasyCheck.ecss != "no") {
        if (!(n.attr("ecss") && n.attr("ecss") != "yes")) {
          // 禁用错误提示时文本框改变样式——easycheck_errorInput
          n.removeClass("easycheck_errorInput");
          n.addClass(EasyCheck.okcss);
        }
      }
      $(s + "[id^='error_']").hide();
    });
    if (param.restore) {
      $(s + "[id^='ok_']").each(function() {
        $(this).hide();
      });
      // 清楚后显示默认提示
      $(s + "[id^='default_']").each(function() {
        $(this).show();
      });
    }
  }, checkVc = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      var res = false;
      $.ajaxSetup({
        async:false
      });
      $.post($(o).attr("vc"), $(o).attr("name") + "=" + val + "&n=" + new Date(), function(d) {
        res = d.replace(/\r\n/g, "");
      }, "text");
      return res == "true";
    }, EasyCheck.msg["vc"]);
  }, checkRegExp = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      var reg = new RegExp("^(?:" + $(o).attr("reg") + ")$");
      return !($.trim(val) != "" && !reg.test(val));
    }, EasyCheck.msg["regexp"]);
  }, // 验证扩展名，多个扩展名使用英文逗号分隔
  checkExtension = function(o, e) {
    ex = $(o).attr("extension");
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      var extensionList = ex != "" ? ex.replace(/,/g, "|") :"png|jpe?g|gif";
      return !($.trim(val) != "" && !val.match(new RegExp(".(" + extensionList + ")$", "i")));
    }, EasyCheck.formatMsg(EasyCheck.msg["extension"], ex));
  }, checkRequired = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      return $.trim(val) != "";
    }, EasyCheck.msg["required"]);
  }, checkEmail = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      return !($.trim(val) != "" && !EasyCheck.Validator.email.test(val));
    }, EasyCheck.msg["email"]);
  }, checkUrl = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      return !($.trim(val) != "" && !EasyCheck.Validator.url.test(val));
    }, EasyCheck.msg["url"]);
  }, checkNumber = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      return !($.trim(val) != "" && !EasyCheck.Validator.number.test(val));
    }, EasyCheck.msg["number"]);
  }, checkInteger = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      return !($.trim(val) != "" && !EasyCheck.Validator.integer.test(val));
    }, EasyCheck.msg["integer"]);
  }, checkEqualto = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      return val == $("[id='" + $(o).attr("equalto") + "']").val();
    }, EasyCheck.msg["equalto"]);
  }, checkEquallength = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      return !(val.length != $(o).attr("equallength"));
    }, EasyCheck.formatMsg(EasyCheck.msg["equallength"], $(o).attr("equallength")));
  }, checkRangeLength = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      return !($.trim(val).length < $(o).attr("minlength") || $.trim(val).length > $(o).attr("maxlength"));
    }, EasyCheck.formatMsg(EasyCheck.msg["minlength][maxlength"], $(o).attr("minlength"), $(o).attr("maxlength")));
  }, checkMinlength = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      return !($.trim(val).length < $(o).attr("minlength"));
    }, EasyCheck.formatMsg(EasyCheck.msg["minlength"], $(o).attr("minlength")));
  }, checkMaxlength = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      return !($.trim(val).length > $(o).attr("maxlength"));
    }, EasyCheck.formatMsg(EasyCheck.msg["maxlength"], $(o).attr("maxlength")));
  }, checkRange = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      return !(parseFloat($.trim(val)) < parseFloat($(o).attr("min")) || parseFloat($.trim(val)) > parseFloat($(o).attr("max")) || isNaN(val));
    }, EasyCheck.formatMsg(EasyCheck.msg["min][max"], $(o).attr("min"), $(o).attr("max")));
  }, checkMin = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      return !(parseFloat($.trim(val)) < parseFloat($(o).attr("min")) || isNaN(val));
    }, EasyCheck.formatMsg(EasyCheck.msg["min"], $(o).attr("min")));
  }, checkMax = function(o, e) {
    return EasyCheck.addChkMethod(o, e, function(o) {
      var val = $(o).val();
      return !(parseFloat($.trim(val)) > parseFloat($(o).attr("max")) || isNaN(val));
    }, EasyCheck.formatMsg(EasyCheck.msg["min"], $(o).attr("min")));
  };
  var EasyCheck = {
    chkList:"",
    // 验证列表
    msg:{
      required:"不能为空",
      email:"邮箱格式不正确",
      url:"网址有误",
      number:"必须为数字",
      integer:"必须为整数",
      equalto:"输入不一致",
      equallength:"长度必须为{0}位",
      "minlength][maxlength":"长度必须在{0}到{1}之间",
      minlength:"长度不能小于{0}",
      maxlength:"长度不能大于{0}",
      "min][max":"值必须在{0}和{1}之间",
      min:"不能小于{0}",
      max:"不能大于{0}",
      regexp:"格式有误",
      extension:"文件后缀只能为{0}",
      vc:"输入有误"
    },
    Validator:{
      email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      url:/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
      number:/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
      integer:/^\d+$/,
      English:/^[A-Za-z]+$/,
      Chinese:/^[\u0391-\uFFE5]+$/,
      Zip:/^[1-9]\d{5}$/,
      Currency:/^\d+(\.\d+)?$/,
      Require:/.+/,
      ipv4:/^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i,
      ipv6:/^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/
    },
    easyCheckIgnore:{},
    // 指定忽略验证的规则，设置后同时忽略失去焦点事件和键盘弹起事件的验证（只对提交表单验证）
    easyCheckBlurIgnore:{},
    // 焦点事件忽略进行验证的列表，（只对键盘弹起和表单验证），适合只在提交表单时验证的对象，如验证码
    easyCheckKeyupIgnore:{},
    // 指定键盘弹起事件忽略验证的规则（只对失去焦点和表单验证）
    easyCheckEleIgnore:{},
    // 键盘弹起和失去焦点时忽略验证的DOM元素名称（只对提交表单有效）
    easyCheckSubmitDisable:true,
    // 默认开启客户端防重复提交功能
    removeDisableBtn:[],
    // Firefox下恢复禁用的按钮
    removeDisableForm:[],
    // firefox下恢复禁用按钮的表单
    removeDisable:false,
    // 是否移除页面表单中所有禁用的submit按钮，默认为不移除
    ecss:"yes",
    // 是否使用easycheck_errorInput验证未通过文本框样式，默认为是
    okcss:"easycheck_okInput",
    loadChk:true,
    // 页面加载完后是否立即开启验证规则（否则仅在提交表单时验证，如果设置为false，blurChk和keyupChk无效），默认为true
    blurChk:true,
    // 开启失去焦点时验证，false禁用，默认为true
    keyupChk:true,
    // 开启键盘弹起时验证，false禁用，默认为true
    formatMsg:function() {
      var ary = [];
      for (var i = 1; i < arguments.length; i++) {
        ary.push(arguments[i]);
      }
      return arguments[0].replace(/\{(\d+)\}/g, function(m, i) {
        return ary[i];
      });
    },
    //仅清除错误提示
    clearAllError:function(formId) {
      errorManger({
        formId:formId
      });
    },
    //清除错误提示，并清除正确提示，显示默认提示
    restoreAll:function(formId) {
      errorManger({
        formId:formId,
        restore:true
      });
    },
    showError:function(o, msg) {
      // 错误提示
      if (typeof o == "string") {
        o = $("#" + o);
      }
      var eo = $("[id='ok_" + $(o).attr("name") + "']");
      if (eo) {
        // 存在ok提示
        eo.hide();
      }
      eo = $("[id='error_" + $(o).attr("name") + "']");
      if (eo.size() == 0) {
        $(o).after("\r\n<div id='error_" + $(o).attr("name") + "'></div>");
        // 创建消息div
        eo = $("[id='error_" + $(o).attr("name") + "']");
      }
      eo.removeClass();
      eo.addClass("easycheck_errorInfo");
      // eo.css("display","inline");
      if (EasyCheck.ecss != "no") {
        if (!($(o).attr("ecss") && $(o).attr("ecss") != "yes")) {
          // 禁用错误提示时文本框改变样式——easycheck_errorInput
          $(o).removeClass(EasyCheck.okcss);
          $(o).addClass("easycheck_errorInput");
        }
      }
      var prefix = eo.attr("prefix");
      // 信息前缀
      if (prefix) {
        eo.html(prefix + msg);
      } else {
        prefix = "";
        eo.html(msg);
      }
      var info = eo.attr("info");
      // 自定义提示信息内容
      if (info) {
        eo.html(prefix + info);
      }
      eo.show();
    },
    clearError:function(o, msg) {
      // OK提示
      if (typeof o == "string") {
        o = $("#" + o);
      }
      var eo = $("[id='error_" + $(o).attr("name") + "']");
      if (eo) {
        eo.removeClass();
        if (EasyCheck.ecss != "no") {
          if (!($(o).attr("ecss") && $(o).attr("ecss") != "yes")) {
            // 禁用错误提示时文本框改变样式——easycheck_errorInput
            $(o).removeClass("easycheck_errorInput");
            $(o).addClass(EasyCheck.okcss);
          }
        }
        eo.addClass("easycheck_okInfo");
        if (msg) {
          eo.html(msg);
        } else {
          eo.html("");
        }
        eo.hide();
      }
    },
    // 验证规则对象
    // 定义的类或属性名称，定义的验证处理函数，[是否是属性验证,true代表是]
    ChkRule:function(chkName, chkFunction, chkAttr) {
      this.chkName = chkName;
      this.chkFunction = chkFunction;
      this.chkAttr = chkAttr;
    },
    // 自定义新验证插件函数，调用EasyCheck.addChkMethod(o,e,chkCode,msg)实现向系统注册新验证插件
    // o 触发事件的元素
    // e 事件对象
    // chkCode 验证回调函数
    // msg 提示消息
    addChkMethod:function(o, e, chkCode, msg) {
      var de = $("[id='default_" + $(o).attr("name") + "']");
      if (de) {
        // 默认提示隐藏
        de.hide();
      }
      if (!chkCode(o)) {
        // 验证未通过
        var de = $("[id='default_" + $(o).attr("name") + "']");
        if (de) {
          // 默认提示显示
          de.hide();
        }
        EasyCheck.showError(o, msg);
        if (e) {
          e.stopImmediatePropagation();
        }
        return false;
      } else {
        // 验证通过
        EasyCheck.clearError(o);
        var defaultDiv = $("[id='default_" + $(o).attr("name") + "']");
        if (defaultDiv) {
          // 默认提示显示
          defaultDiv.hide();
        }
        var okDiv = $("[id='ok_" + $(o).attr("name") + "']");
        if (okDiv) {
          // 存在ok提示
          okDiv.addClass("easycheck_okInfo");
          okDiv.show();
        }
        return true;
      }
    },
    /*
		 * submit时，表单验证注册
		 */
    checkForm:function(eleArea) {
      var fromChkInfo = {
        eleArea:"[id='" + $(eleArea).attr("id") + "'] ",
        // 验证的Form区域
        chkFlag:true,
        // 验证成功与否
        errorEleArray:new Array()
      };
      // 注册的类或属性名称，注册的处理函数，表单对象信息
      /* 注册Form类验证 */
      for (var i = 0; i < EasyCheck.chkList.length; i++) {
        var chkrule = EasyCheck.chkList[i];
        addChkForm(chkrule, fromChkInfo);
      }
      if (fromChkInfo.chkFlag == true && EasyCheck["easyCheckSubmitDisable"] == true) {
        $(":submit", $(fromChkInfo.eleArea)).attr("disabled", "true");
      } else {
        $(":submit", $(fromChkInfo.eleArea)).removeAttr("disabled");
      }
      return fromChkInfo.chkFlag;
    }
  };
  /*
	 * 验证规则对象列表 有新的验证函数需要在此进行注册
	 */
  EasyCheck.chkList = [ new EasyCheck.ChkRule("required", checkRequired), new EasyCheck.ChkRule("email", checkEmail), new EasyCheck.ChkRule("url", checkUrl), new EasyCheck.ChkRule("number", checkNumber), new EasyCheck.ChkRule("integer", checkInteger), new EasyCheck.ChkRule("equalto", checkEqualto, true), new EasyCheck.ChkRule("equallength", checkEquallength, true), new EasyCheck.ChkRule("minlength][maxlength", checkRangeLength, true), new EasyCheck.ChkRule("minlength", checkMinlength, true), new EasyCheck.ChkRule("maxlength", checkMaxlength, true), new EasyCheck.ChkRule("min][max", checkRange, true), new EasyCheck.ChkRule("min", checkMin, true), new EasyCheck.ChkRule("max", checkMax, true), new EasyCheck.ChkRule("reg", checkRegExp, true), new EasyCheck.ChkRule("extension", checkExtension, true), new EasyCheck.ChkRule("vc", checkVc, true) ];
  /*
	 * 忽略注册的规则列表
	 */
  EasyCheck.easyCheckIgnore["vc"] = true;
  // vc验证码规则，键盘弹起和失去焦点时不验证，只在表单提交时验证
  // EasyCheck.easyCheckBlurIgnore["vc"]=true;
  // EasyCheck.easyCheckKeyupIgnore["vc"]=true;
  EasyCheck.easyCheckEleIgnore["uservc"] = true;
  // 如果元素名称为uservc，则只在提交表单时验证
  window.EasyCheck = EasyCheck;
})(window);

$(function() {
  function chk(o, e, chkFunction) {
    // 回调验证函数
    chkFunction(o, e);
  }
  // 添加类验证和属性验证
  function addChk(chkrule) {
    var chkElements = chkrule.chkAttr ? "[" + chkrule.chkName + "]" :"[class~='" + chkrule.chkName + "']";
    $(chkElements).on("blur", function(e) {
      if (!EasyCheck.easyCheckBlurIgnore[chkrule.chkName] && !EasyCheck.easyCheckEleIgnore[e.target.name]) {
        EasyCheck.blurChk ? chk(this, e, chkrule.chkFunction) :"";
      }
    }).on("focus", function(e) {
      EasyCheck.clearError(this);
      var okDiv = $("[id='ok_" + $(this).attr("name") + "']");
      if (okDiv.length > 0) {
        // 存在OK提示
        if (okDiv.filter(":hidden").length > 0) {
          // 隐藏中，未成功
          // 如果不存在提示信息则显示默认
          var defaultDiv = $("[id='default_" + $(this).attr("name") + "']");
          if (defaultDiv) {
            defaultDiv.show();
          }
        }
      } else {
        // 如果不存在提示信息则显示默认
        var defaultDiv = $("[id='default_" + $(this).attr("name") + "']");
        if (defaultDiv) {
          defaultDiv.show();
        }
      }
    }).on("keyup", function(e) {
      if (!EasyCheck.easyCheckKeyupIgnore[chkrule.chkName] && !EasyCheck.easyCheckEleIgnore[e.target.name]) {
        EasyCheck.keyupChk ? chk(this, e, chkrule.chkFunction) :"";
      }
    });
  }
  // 页面全局验证注册
  function easyCheck() {
    // 注册的类或属性名称，注册的处理函数
    // 注册系统类验证和属性验证
    for (var i = 0; i < EasyCheck.chkList.length; i++) {
      var chkrule = EasyCheck.chkList[i];
      if (!EasyCheck.easyCheckIgnore[chkrule.chkName]) {
        addChk(chkrule);
      }
    }
  }
  EasyCheck.loadChk ? "" :(EasyCheck.blurChk = false, EasyCheck.keyupChk = false);
  easyCheck();
  for (var i = 0; i < EasyCheck.removeDisableBtn.length; i++) {
    $("#" + EasyCheck.removeDisableBtn[i]).removeAttr("disabled");
  }
  if (EasyCheck.removeDisable == true) {
    $("form :submit").removeAttr("disabled");
  } else {
    for (var i = 0; i < EasyCheck.removeDisableForm.length; i++) {
      $(":submit", $("#" + EasyCheck.removeDisableForm[i])).removeAttr("disabled");
    }
  }
  $("[id*='ok_']").hide();
});