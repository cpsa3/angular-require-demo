﻿/*
* 功能:排序题报告 托福听力报告
* 作者:侯百京
* 日期：2014.6.10
*/


var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.matchquestion2 = businesscomponents.previewandreports.matchquestion2 || {};

businesscomponents.previewandreports.matchquestion2.Question = function () {
    businesscomponents.previewandreports.matchquestion2.Question.superClass.constructor.call(this,
     $('<div class="ReportNewAbox clearfix"><span class="NumStyle"></span><div class="AboxInner">' +
            '<div class="QboxInner RichTextEditor" gi="topic">' +
            '</div>' +
            '<div class="ReportOptionOuter" gi="answerBox">' +
            '</div>' +
            '<div class="ReportQTablebox">' +
            '<div class="R3_AnswerArea2 R3_StyleAdd" gi="answerBox2">' +
             '</div>' +
             '<div class="ReportQTableTips" gi="answerNull">误选项</div>' +
            '</div>' +
            '<div  gi="choiceSelect">' +
            '</div><div class="R3_AnswerArea" gi="choiceAnswers"></div>' +
            '<textarea class="Reportextarea" placeholder="请输入分析" gi="txtAnalysis" ></textarea>' +
            '<textarea class="Reportextarea" placeholder="请输入评语" gi="txtComment"></textarea>' +
        '</div>' + '</div>').get(0), null);

    //要求
    this._topic = $(this._element).find('[gi~="topic"]')[0];
    //答案选择框
    this._choiceSelect = $(this._element).find('[gi~="choiceSelect"]')[0];
    //学生答题框List
    this._answerBox = $(this._element).find('[gi~="answerBox"]')[0];

    //学生答题框table
    this._answerBox2 = $(this._element).find('[gi~="answerBox2"]')[0];

    //学生正确答案提示
    this._choiceAnswers = $(this._element).find('[gi~="choiceAnswers"]')[0];

    //未作答显示图标
    this._answerNull = $(this._element).find('[gi~="answerNull"]');

    //是否是预览
    this.isPreview = true;
    //分析和评语
    this._txtAnalysis = new toot.ui.TextBox($(this._element).find('[gi~="txtAnalysis"]')[0]);
    this._txtComment = new toot.ui.TextBox($(this._element).find('[gi~="txtComment"]')[0]);
    //分析和评语默认都是隐藏的
    this._txtAnalysis.setVisible(false);
    this._txtComment.setVisible(false);
    //判断这题是否正确
    this._isRight = false;
    this._data = null;
};

toot.inherit(businesscomponents.previewandreports.matchquestion2.Question, businesscomponents.ui.RnRItem);

toot.extendClass(businesscomponents.previewandreports.matchquestion2.Question, {
    setModelAndUpdateUI: function (data) {
        this._answerNull.hide();
        this.setRequestModel(models.components.matchquestion.Question.parse(data.getChannelQ()));
        var obj = data.getChannelA();
        //        var obj =
        //                {
        //                    _myAnswer: data.getChannelA()
        //                };
        this.setResponseModel(models.components.matchquestion.QuestionResponse.parse(obj));

        this.updateUIByModel(data);
        this._data = data;
    },
    updateUIByModel: function (data) {
        this._data = data;
        this.isPreview = data.getRenderingType() == models.previewandreports.RenderingType.Preview;
        this._topic.innerHTML = this.getRequestModel().getTopic();
        this._choiceSelect.innerHTML = businesscomponents.previewandreports.matchquestion2.ChoiceSelect.Html(this.getRequestModel().getChoices());
        if (this.getRequestModel().getForm().getType() == 10) {
            this._answerBox2.innerHTML = "";
            $(this._answerBox2).hide();
            this._answerBox.innerHTML = businesscomponents.previewandreports.matchquestion2.AnswerBox.Html(this.getRequestModel().getForm(), this.isPreview);
        }
        else {
            this._answerBox.innerHTML = "";
            $(this._answerBox).hide();
            if (!this.isPreview) {
                this._answerNull.show();
            }
            this._answerBox2.innerHTML = businesscomponents.previewandreports.matchquestion2.AnswerBox.Html(this.getRequestModel().getForm());
        }
        //报告页面绑定答案
        if (data.getRenderingType() == models.previewandreports.RenderingType.WebReprot || data.getRenderingType() == models.previewandreports.RenderingType.PdfReport || data.getRenderingType() == models.previewandreports.RenderingType.DisplayFinish) {
            this._initialise();
        }
        if (data.getRenderingType() == models.previewandreports.RenderingType.StudentAnalysis) {
            //显示评语
            this._txtAnalysis.setVisible(true);
            this.renderAnalysis(data);

            this._initialise();
        }
        if (data.getRenderingType() == models.previewandreports.RenderingType.StudentView) {
            //显示评语
            this._txtAnalysis.setVisible(true);
            this._txtComment.setVisible(true);
            this.renderAnalysis(data);

            this._initialise();
        }
        if (data.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView) {
            this._txtAnalysis.setVisible(true);
            this._txtComment.setVisible(true);
            this.renderAnalysis(data);

            this._initialise();
        }

    },
    //获取分组后的答案
    //[{index:1;answerIndex:[1,2,3]},{index:2;answerindex:[2,3,1]}] 返回数组下标从1开始
    _getAnswerGroups: function (type, from) {
        var from = this.getRequestModel().getForm();
        var answerGroups = [];
        var answerItem = {};
        var num = 0;
        var hasAnswer = true;  //上一个是否答案
        //搭配题
        if (type == 10) {
            for (var j = 0; j < from.getItems().length; j++) {
                //题目
                if (from.getItems()[j].getType() == 30) {
                    //上一题不是答案，则代表需要重新分组
                    if (!hasAnswer) {
                        answerItem = {};
                        //下标+1;答案位置清空
                        answerItem.index = answerGroups.length;
                        answerItem.answerIndex = [];
                        answerGroups.push(answerItem);
                    }
                    else {
                        answerItem.index = answerGroups.length;
                    }
                    var answer = from.getItems()[j].getAnswer()
                    if (!answerItem.answerIndex) {
                        answerItem.answerIndex = [];
                    }
                    answerItem.answerIndex.push(answer + 1);
                    hasAnswer = true;
                    num++;
                }
                else {
                    hasAnswer = false;
                }
            }

            if (num == 0) {
                answerGroups = [];
            }
        }
        //表格题
        else if (type == 20) {
            for (var i = 0; i < from.getRows().length; i++) {
                var row = from.getRows()[i];
                for (var j = 0; j < row.getCells().length; j++) {
                    var cell = row.getCells()[j];
                    //题目
                    if (cell != null && cell.getType() == 30) {
                        //分组
                        var group = cell.getGroup();
                        //答案
                        var answer = cell.getAnswer();
                        var isGroupExist = false;
                        var tAnswerGroup;
                        for (var n = 0; n < answerGroups.length; n++) {
                            answerGroup = answerGroups[n];
                            if (answerGroup.index == group) {
                                isGroupExist = true;
                                tAnswerGroup = answerGroup;
                                break;
                            }
                        }
                        //分组是否存在
                        if (isGroupExist) {
                            //存在,则把当前位置存储到答案集合里
                            tAnswerGroup.answerIndex.push((answer + 1));
                        }
                        else {
                            answerItem = {};
                            //不存在,创建一个新集合
                            answerItem.index = group;
                            answerItem.answerIndex = [];
                            answerItem.answerIndex.push((answer + 1));
                            answerGroups.push(answerItem);
                        }
                        num++;
                    }
                }

                if (num == 0) {
                    answerGroups = [];
                }
            }
        }


        answerGroups.sort(function compare(a, b) {
            return a.index - b.index;
        });
        return answerGroups;
    },
    _initialise: function () {
        var _this = this;
        var answerGroups;
        var rtCountArr = []; //正确题量,总题量数组 [[r=1;t=2],[r=3;t=3]]
        //如果答案为空自动补全

        answerGroups = this._getAnswerGroups(this.getRequestModel().getForm().getType(), this.getRequestModel().getForm());
        if (!this.getResponseModel()) {
            var a = new models.components.matchquestion.QuestionResponse();
            var b = [];

            for (var i = 0; i < answerGroups.length; i++) {
                var c = [];
                for (var j = 0; j < answerGroups[i].answerIndex.length; j++) {
                    c.push(-1);
                }
                b.push(c);
            }
            a.setMyAnswer(b);
            this.setResponseModel(a);
        }
        //概括题
        if (this.getResponseModel() && this.getRequestModel().getForm().getType() == 10) {
            //答案数组      
            var index = 0;
            var qCount = 0; //题目数量
            var qRightCount = 0;    //答对数量
            var qIndex = 0; //getMyAnswer数组包含t，answergroups不包含t，所以加一个计数器，否则answergroup[i]取不到值

            for (var i = 0; i < this.getResponseModel().getMyAnswer().length; i++) {
                var rtCount = {}; //正确题量/总题量 {r=1;t=2}
                rtCount.rightCount = 0;
                rtCount.totalCount = 0;
                for (var j = 0; j < this.getResponseModel().getMyAnswer()[i].length; j++) {
                    var isRight = false;
                    var rightIndex;
                    var currentAnswer = parseInt(this.getResponseModel().getMyAnswer()[i][j]);

                    if (answerGroups[qIndex]) {
                        for (var n = 0; n < answerGroups[qIndex].answerIndex.length; n++) {
                            if (answerGroups[qIndex].answerIndex[n] == currentAnswer + 1) {
                                isRight = true;
                                rtCount.rightCount++;
                                break;
                            }
                        }
                    }

                    if (currentAnswer != -1) {
                        var currentAnswerHtml = $($(this._element).find('[gi~="aChoice"]')[currentAnswer]).html();

                        if (isRight) {
                            qRightCount++;
                            $($(this._element).find('[gi~="optionbox5"]')[index]).html('<span class="RightFillbox1"><span>' + (currentAnswer + 1) + '</span></span>');
                        }
                        else {
                            $($(this._element).find('[gi~="optionbox5"]')[index]).html('<span class="WrongFillbox1"><span>' + (currentAnswer + 1) + '</span></span>');
                        }
                        qCount++;
                    }
                    else {
                        $($(this._element).find('[gi~="optionbox5"]')[index]).html('<span class="NothingFillbox1"><span>未作答</span></span>');
                    }
                    index++;
                    rtCount.totalCount++;
                }

                if (this.getResponseModel().getMyAnswer()[i].length > 0) {
                    qIndex++;
                    rtCountArr.push(rtCount);
                }
            }
        }
        //表格题
        else if (this.getResponseModel() && this.getRequestModel().getForm().getType() == 20) {
            //答案数组
            answerGroups = this._getAnswerGroups(this.getRequestModel().getForm().getType(), this.getRequestModel().getForm());
            var qCount = 0; //题目数量
            var qRightCount = 0;    //答对数量
            //[3,1,4,5]组的
            var groupList = [];
            $(this._element).find('[gi~="optionbox5"]').each(function () {
                var group = $(this).attr("group");
                var isHas = true;
                for (var i = 0; i < groupList.length; i++) {
                    if (groupList[i] == group) {
                        isHas = false;
                    }
                }
                if (isHas) {
                    groupList.push(group);
                }
            })
            groupList.sort();
            for (var i = 0; i < groupList.length; i++) {
                var data = this.getResponseModel().getMyAnswer()[i];
                if (!data) {
                    data = [];
                    for (var i2 = 0; i2 < answerGroups[i].answerIndex.length; i2++) {
                        data.push(-1);
                    }
                }

                var rtCount = {}; //正确题量/总题量 {r=1;t=2}
                rtCount.rightCount = 0;
                rtCount.totalCount = 0;

                $(this._element).find('[group~="' + groupList[i] + '"]').each(function (j) {
                    if (data[j] != -1) {
                        var isRight = false;
                        if (answerGroups[i]) {
                            for (var n = 0; n < answerGroups[i].answerIndex.length; n++) {
                                if (answerGroups[i].answerIndex[n] == parseInt(data[j]) + 1) {
                                    isRight = true;
                                    rtCount.rightCount++;
                                    break;
                                }
                            }
                        }

                        if (isRight) {
                            qRightCount++;
                            $(this).html('<span class="RightFillbox1"><span>' + (parseInt(data[j]) + 1) + '</span></span>');
                        }
                        else {
                            $(this).html('<span class="WrongFillbox1"><span>' + (parseInt(data[j]) + 1) + '</span></span>');
                        }
                    }
                    else {
                        $(this).html('<span class="NothingFillbox1"><span>未作答</span></span>');
                    }
                    rtCount.totalCount++;
                    qCount++;
                })

                rtCountArr.push(rtCount);
            }
        }

        if (answerGroups.length > 0) {
            for (var i = 0; i < answerGroups.length; i++) {
                var groupNum = "第" + (i + 1) + "组";
                if (answerGroups.length == 1) {
                    groupNum = "";
                }
                if (rtCountArr[i]) {
                    var html = '';
                    if (rtCountArr[i].totalCount == rtCountArr[i].rightCount && rtCountArr[i].rightCount > 0) {
                        if (this._data.getRenderingType() == models.previewandreports.RenderingType.StudentAnalysis) {
                            html = '<div class=rightTipsbox>回答正确</div>';
                        } 
                        else {
                            html += '<div class=rightTipsbox>' + groupNum + ' 正确答案：<span>';
                            html += answerGroups[i].answerIndex.join(',') + "";
                            html += '</span></div>';    
                        }
                       
                        //全错
                        $(this._choiceAnswers).append(html);
                        this._isRight = true;
                    }
                    else if (rtCountArr[i].rightCount == 0) {
                        if (this._data.getRenderingType() == models.previewandreports.RenderingType.StudentAnalysis) {
                            html = '<div class="errorTipsbox2">回答错误<div>';
                        }
                        else {
                            html += '<div class="errorTipsbox2">' + groupNum + ' 正确答案：<span>';
                            html += answerGroups[i].answerIndex.join(', ') + "";
                            html += "</span></div>";  
                        }
                       
                        $(this._choiceAnswers).append(html);
                    }
                    else {
                        if (this._data.getRenderingType() == models.previewandreports.RenderingType.StudentAnalysis) {
                            html = '<div class="TipsboxStyle3">回答错误</div>';
                        }
                        else {
                            html += '<div class="TipsboxStyle3">' + groupNum + ' 正确答案：<span>';
                            html += answerGroups[i].answerIndex.join(', ') + "";
                            html += "</span></div>";   
                        }
                       
                        $(this._choiceAnswers).append(html);
                    }
                }
                else {
                    var html = '';
                    if (this._data.getRenderingType() == models.previewandreports.RenderingType.StudentAnalysis) {
                            html += '<div class="errorTipsbox2">回答错误</div>';
                    }
                    else {
                            html += '<div class="errorTipsbox2">' + groupNum + ' 正确答案：<span>';
                            html += answerGroups[i].answerIndex.join(', ') + "";
                            html += "</span></div>"; 
                    }
                    
                   
                    $(this._choiceAnswers).append(html);
                }
            }
        }
        else {
             var html = '';
             if (this._data.getRenderingType() == models.previewandreports.RenderingType.StudentAnalysis) {
                     html = '<div class="errorTipsbox2">回答错误</div>'; 
            }
            else {
                     html += '<div class="errorTipsbox2">正确答案：<span>未配置';
                     html += "</span></div>";
            }
           
           
            $(this._choiceAnswers).append(html);
        }
    },
    renderAnalysis: function (data) {
        if ((data.getRenderingType() == models.previewandreports.RenderingType.StudentView || data.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView)) {
            this._txtAnalysis.setValue(data.getChannelSA() == "" ? "无" : data.getChannelSA());
            $(this._txtAnalysis.getElement()).addClass("ReporStudentextarea");
            $(this._txtAnalysis.getElement()).attr("disabled", true);
            if (data.getRenderingType() == models.previewandreports.RenderingType.TeacherAnalysisView) {
                this._txtComment.setValue(data.getChannelTA());
            }
            else {
                if (!data.getChannelTA()) {
                    this._txtComment.setVisible(false);
                }
                else {
                    this._txtComment.setValue(data.getChannelTA());
                    $(this._txtComment.getElement()).addClass("ReporStudentextarea");
                    $(this._txtComment.getElement()).attr("disabled", true);
                }
            }
        }
    },
    //验证
    Validate: function () {
        if (this._data.getRenderingType() == models.previewandreports.RenderingType.StudentAnalysis) {

            if (!this._isRight) {
                if (this.getAnalysis().trim() == "") {

                    return false;
                }
            }
        }
        return true;
    },
    getAnalysis: function () {
        return this._txtAnalysis.getValue();
    },
    //获取评语内容
    getComment: function () {
        return this._txtComment.getValue();
    },
    updateModelByUI: function () {
        //        var model = this._data || new models.previewandreports.RenderingItem()
        //        model.setChannelSA(this.getAnalysis());
        //        model.setChannelTA(this.getComment());
        //        return model;
    },
    getModel: function () {
        var model = this._data || new models.previewandreports.RenderingItem()
        model.setChannelSA(this.getAnalysis());
        model.setChannelTA(this.getComment());
        return model;
    }
})

//答案选择框
businesscomponents.previewandreports.matchquestion2.ChoiceSelect = {};
businesscomponents.previewandreports.matchquestion2.ChoiceSelect.Html = function (choicesList) {
    var html = '';
    for (var i = 0; i < choicesList.length; i++) {
        var choicesAnswerValue = i;
        html += '<div class="ReportOption2 clearfix">' +
            	'<em class="NumStyle">' + (choicesAnswerValue + 1) + '</em>' +
                '<span class="TextStyle">' + choicesList[i].getContent() + '</span>' +
             '</div>';
    }
    return html;
}

//学生答案框
businesscomponents.previewandreports.matchquestion2.AnswerBox = {};
businesscomponents.previewandreports.matchquestion2.AnswerBox.Html = function (form, isPreview) {
    //list
    if (form.getType() == 10) {
        var html = businesscomponents.previewandreports.matchquestion2.AnswerBox.ListHtml(form.getItems(), isPreview);
        return html;
    }
    //table
    else {
        var html = businesscomponents.previewandreports.matchquestion2.AnswerBox.TableHtml(form);
        return html;
    }
}

//学生答题部分，为table类型
businesscomponents.previewandreports.matchquestion2.AnswerBox.TableHtml = function (tableForm) {
    var html = '';
    var headerData = tableForm._header;
    var rowsData = tableForm._rows;
    var headerHtml = '<thead><tr>';
    var thWidth = (100 / headerData._cells.length) + '%';
    for (var i = 0; i < headerData._cells.length; i++) {
        if (headerData._cells[i] == null) {
            headerHtml += '<th width="' + thWidth + '"></th>';
        }
        else {
            headerHtml += '<th width="' + thWidth + '">' + headerData._cells[i]._text + '</th>';
        }
    }
    headerHtml += '</tr></thead>';

    var bodyHtml = '<tbody>';

    for (var i = 0; i < rowsData.length; i++) {
        bodyHtml += '<tr>';
        for (var j = 0; j < rowsData[i]._cells.length; j++) {
            if (rowsData[i]._cells[j] == null) {
                bodyHtml += '<td><div class="optionbox6"></div></td>';
            }
            else {
                if (rowsData[i]._cells[j]._type == 30) {
                    bodyHtml += '<td><div class="ReportOption1" gi="optionbox5" stuAnswer="-1" group="' + rowsData[i]._cells[j]._group + '">&nbsp;</div></td>';
                }
                else {
                    bodyHtml += '<td><div class="ReportOption3">' + toot.ui.textToHTML(rowsData[i]._cells[j]._text) + '</div></td>';
                }
            }
        }
        bodyHtml += '</tr>';
    }

    html = '<table>' + headerHtml + bodyHtml + '</table>';

    return html;
}

//学生答题部分，为list类型
businesscomponents.previewandreports.matchquestion2.AnswerBox.ListHtml = function (listItem, isPreview) {
    //listItem结构为[T,A,A,A,T,A]
    var html = '';
    var textNum = 0;
    for (var i = 0; i < listItem.length; i++) {
        if (listItem[i].getType() == 20) {
            textNum++;
            html += '<div class="ReportOption3" gi="optionbox6" >' + listItem[i].getText() + '</div>';
        }
        else {
            html += '<div class="ReportOption1" gi="optionbox5" stuAnswer="-1" group="group' + textNum + '">&nbsp;</div>';
        }
    }
    if (!isPreview) {
        html += '<div class="ReportQTableTips">误选项</div>';
    }
    return html;
}

//学生答题部分，为list类型
businesscomponents.previewandreports.matchquestion2.AnswerBox.ListQuestionNum = function (listItem) {
    //listItem结构为[T,A,A,A,T,A]
    var html = '';
    var textNum = 0;
    for (var i = 0; i < listItem.length; i++) {
        if (listItem[i].getType() == 20) {
            textNum++;
        }
    }
    return textNum;
}