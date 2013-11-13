function refreshPageWithSelectedRealm(url, realm) {
    var newRealm = realm.options[realm.selectedIndex].value;
    gotoURL = url + newRealm;
    self.location = gotoURL;
}

function launchURL(url, w, h, scroll, resize, title) {
    if (scroll == "1") scroll = "yes"; else scroll = "no";
    if (resize == "1") resize = "yes"; else resize = "no";

    popOff = window.open(url, "", "status,height=" + h + ",width=" + w + ",scrollbars=" + scroll + ",resizable=" + resize + ",toolbar=0,location=0");

    if (popOff != null) {
        if (popOff.opener == null) {
            remote.opener = window;
        }
        popOff.document.title = title;
        popOff.focus();
    }
}

//name - name of the cookie
//value - value of the cookie
//[expires] - expiration date of the cookie (defaults to end of current session)
//[path] - path for which the cookie is valid (defaults to path of calling document)
//[domain] - domain for which the cookie is valid (defaults to domain of calling document)
//[secure] - Boolean value indicating if the cookie transmission requires a secure transmission
//* an argument defaults when it is assigned null as a placeholder
//* a null placeholder is not required for trailing omitted arguments
function setCookie(name, value, expires, path, domain, secure) {
    var curCookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
    document.cookie = curCookie;
}

function getCookie(name, defaultValue) {
    if (document.cookie.length > 0) {
        start = document.cookie.indexOf(name + "=")

        if (start != -1) {
            start = start + name.length + 1
            end = document.cookie.indexOf(";", start)

            if (end == -1)
                end = document.cookie.length
            return unescape(document.cookie.substring(start, end))
        }
    }

    if (defaultValue == undefined) {
        return null;
    }

    return defaultValue;
}

//If the checkbox is disabled then don't allow pressing the label to check it.
function toggleCheckbox(id) {
    if (!($('#' + id).attr('disabled') == true)) {
        document.getElementById(id).checked = !document.getElementById(id).checked;
        if ($('#' + id).attr('checked')) {
            $('#' + id).parent().addClass('checked');
        }
        else {
            $('#' + id).parent().removeClass('checked');
        }
    }

    return false;
}

function uncheck(id) {
    if ($('#' + id).attr('checked'))
        toggleCheckbox(id);
}

function setRadio(id) {
    if (!$('#' + id).attr('disabled')) {
        var e = document.getElementsByName($('#' + id).attr('name'));
        for (var i = 0; i < e.length; i++) {
            e[i].checked = false;
            $('#' + e[i].id).parent().removeClass('checked');
        }


        document.getElementById(id).checked = true;
        if ($('#' + id).attr('checked')) {
            $('#' + id).parent().addClass('checked');
        }
    }

    return false;
}

function unsetRadio(id) {
    if (!$('#' + id).attr('disabled')) {
        var e = document.getElementsByName($('#' + id).attr('name'));
        for (var i = 0; i < e.length; i++) {
            e[i].checked = false;
            $('#' + e[i].id).parent().removeClass('checked');
        }

        document.getElementById(id).checked = false;
    }

    return false;
}

function browserHeight() {
    var myHeight = 0;
    if (typeof(window.innerWidth ) == 'number') {
        //Non-IE
        myHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        myHeight = document.body.clientHeight;
    }

    return myHeight;
}

function browserWidth() {
    var myWidth = 0;
    if (typeof(window.innerWidth ) == 'number') {
        //Non-IE
        myWidth = window.innerWidth;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
    }

    return myWidth;
}

function setOverlayStyle(id, modal, blurBackground) {
    $('#' + id).height($(window).height());
    $('#' + id).width($(window).width());
    $('#' + id).css('visibility', 'visible');

    if (blurBackground) {
        $('#' + id).css('background', 'url(/images/overlay.png) top right repeat');
    }
    else {
        $('#' + id).css('background', 'none');
    }

    $('#' + id).show();

}

function showPopup(id, width, height, modal, blurBackground) {
    if (modal) {
        if (blurBackground == undefined) {
            blurBackground = true;
        }

        setOverlayStyle('overlay', modal, blurBackground);
    }
    var popupStyle = document.getElementById(id).style;
    popupStyle.position = 'absolute';
    popupStyle.width = width + 'px';
    popupStyle.height = height + 'px';

    if (modal) {
        popupStyle.top = 0 + (($(window).height() - height) / 2) + 'px';
        popupStyle.left = $(window).scrollLeft() + (($(window).width() - width) / 2) + 'px';
    }
    else {
        popupStyle.top = $(window).scrollTop() + (($(window).height() - height) / 2) + 'px';
        popupStyle.left = $(window).scrollLeft() + (($(window).width() - width) / 2) + 'px';
    }
    popupStyle.height = 'auto';

    popupStyle.overflow = 'auto';
    popupStyle.visibility = 'visible';
    popupStyle.display = 'block';
}

function hidePopup(id) {
    var overlay = document.getElementById('overlay');
    if (overlay) {
        overlay = overlay.style;
        var popupStyle = document.getElementById(id).style;
        popupStyle.visibility = 'hidden';
        popupStyle.display = 'none';
        popupStyle.height = '';
        overlay.visibility = 'hidden';
        overlay.display = 'none';
        $('#qm0').removeClass('modal_background');
    }

}

function addDragHandle(dragHandle) {
    $(dragHandle).mousedown(function (e) {
        var d = $(this).parent();
        var dx = d.position().left;
        var dy = d.position().top;
        var xgap = e.pageX - dx;
        var ygap = e.pageY - dy;
        if (!$.browser.msie) {
            e.preventDefault();
        }
        $(document).mousemove(function (e) {
            var x = e.pageX - xgap;
            var y = e.pageY - ygap;
            if ($.browser.msie) {
                // IE only here
                e.preventDefault();
                //IE's
                if (e.pageX >= 0 && e.pageY >= 0)
                    d.css({
                        left: x,
                        top: y
                    });
                return false;
            }
            // FF only here
            if (e.pageX >= 0 && e.pageY >= 0)
                d.css({
                    left: x,
                    top: y
                });
            return true;
        });
    }).mouseup(function (e) {
            $(document).unbind('mousedown');
            $(document).unbind('mousemove');
        });
}

function setDefaultButton(id, applyToId) {

    var applyTo = '';
    if (applyToId == undefined) {
        applyTo = document;
    }
    else {
        applyTo = '#' + applyToId;
    }

    $(applyTo).keydown(function (event) {
        if ((event.which && event.which == 13) ||
            (event.keyCode && event.keyCode == 13)) {
            event.cancelBubble = true;
            $('#' + id).click();
            return false;
        }
        return true;
    });
}

function showLoader(id) {
    $('#' + id).attr('src', '/images/ajax_loader_circle.gif');
}

function hideLoader(id, origImg) {
    $('#' + id).attr('src', origImg);
}

function oddEven(type) {
    if ($('table.tabular').length != 0) {
        if ('remove' == type) {
            $('table.tabular tbody tr:visible:even').removeClass('evenRow');
            $('table.tabular tbody tr:visible:odd').removeClass('oddRow');
        }
        else if ('add' == type) {
            $('table.tabular tbody tr:visible:even').addClass('evenRow');
            $('table.tabular tbody tr:visible:odd').addClass('oddRow');
        }

        //$('table.tabular tbody tr').each(function() {
        //$(this).children(':first').css('border-left', 'none');
        //$(this).children(':last').css('border-right', 'none');
        //});
    }
    if ($('table.tabular_2').length != 0) {
        //When a single row actually spans 2 rows
        $('table.tabular_2 tbody tr').each(function (index) {
            if (index % 4 == 0 || index % 4 == 1) {
                $(this).addClass('evenRow');
            } else {
                $(this).addClass('oddRow');
            }
        });

    }
}

function sort2WayImage() {
    //Have it set backwards (those with images get 0 so first click brings all to top.
    $("thead tr td.two-way-img-sort").each(function () {
        var myIndex = ($(this).closest("td").prevAll("td").length) + 1;
        $("tbody tr td:nth-child(" + myIndex + ")").each(function (index) {
            if ($(this).find('img').length > 0) {
                $(this).attr("sorttable_customkey", "0");
            } else {
                $(this).attr("sorttable_customkey", "1");
            }
        });
    });
}

function showPagination(totalRecords, rowsPerPage, formName, pageParam) {
    if (totalRecords <= rowsPerPage) {
        return "";
    }

    var maxLinks = 5;

    var curPage = parseInt($('#page').val());
    var prevPage = 0;

    if (curPage > 0) {
        prevPage = curPage - 1;
    }

    var totalPages = totalRecords / rowsPerPage;

    if ((totalRecords % rowsPerPage) != 0) {
        totalPages = parseInt(totalPages);
    }

    totalPages++;

    var str;
    if (curPage > 0) {
        // first page

        str = "<a href=\"javascript:void(0);\" onclick=\"$('#" + pageParam + "').val(0);document." + formName + ".submit();return false;\">";
        str += "&lt;&lt;</a>&nbsp;&nbsp;";
        document.writeln(str);

        // previous page
        str = "<a href=\"javascript:void(0);\" onclick=\"$('#" + pageParam + "').val(" + prevPage + ");document." + formName + ".submit();return false;\">";
        str += "&lt;</a>&nbsp;&nbsp;";
        document.writeln(str);
    }

    var ix;
    var numPagesDisplayed = 0;
    var classStr;

    if ((curPage + maxLinks) < totalPages) {
        for (ix = curPage; ix < totalPages; ix++) {
            if (ix == curPage) {
                classStr = " class=\"currentPage\"";
            }
            else {
                classStr = '';
            }

            str = "<a href=\"javascript:void(0);\"" + classStr + " onclick=\"$('#" + pageParam + "').val(" + (curPage + numPagesDisplayed) + ");document." + formName + ".submit();return false;\">";
            str += (ix + 1) + "</a>&nbsp;&nbsp;";
            document.writeln(str);
            numPagesDisplayed++;

            if (numPagesDisplayed == maxLinks) {
                break;
            }
        }
    }
    else {
        // special case for when we're at the end of the page list
        // or when the total number of pages is greater than the maximum number of links
        if (maxLinks > totalPages) {
            maxLinks = totalPages;
        }

        for (ix = (totalPages - maxLinks); ix < totalPages; ix++) {
            if (ix == curPage) {
                classStr = " class=\"currentPage\"";
            }
            else {
                classStr = '';
            }
            str = "<a href=\"javascript:void(0);\"" + classStr + " onclick=\"$('#" + pageParam + "').val(" + ix + ");document." + formName + ".submit();return false;\">";
            str += (ix + 1) + "</a>&nbsp;&nbsp;";
            document.writeln(str);
            numPagesDisplayed++;

            if (numPagesDisplayed == maxLinks) {
                break;
            }
        }
    }

    if (curPage < (totalPages - 1)) {
        // next page
        str = "<a href=\"javascript:void(0);\" onclick=\"$('#" + pageParam + "').val(" + (curPage + 1) + ");document." + formName + ".submit();return false;\">";
        str += "&gt;</a>&nbsp;&nbsp;";
        document.writeln(str);

        // last page
        str = "<a href=\"javascript:void(0);\" onclick=\"$('#" + pageParam + "').val(" + (totalPages - 1) + ");document." + formName + ".submit();return false;\">";
        str += "&gt;&gt;</a>";
        document.writeln(str);
    }

    document.writeln('<!--\nTotal records: ' + totalRecords + '\nRows per page: ' + rowsPerPage + '\nTotal pages: ' + totalPages + '\nCurrent page: ' + curPage + "\n-->");
}

function selectAll(container_form, allbox) {
    //alert(allbox.checked);
    for (var i = 0; i < container_form.elements.length; i++) {
        var e = container_form.elements[i];
        if ((e != allbox) && (e.type == 'checkbox') && (e.id.indexOf("") == 0) && !e.disabled) {
            e.checked = allbox.checked;
            allbox.checked ? $(e).parent().addClass('checked') : $(e).parent().removeClass('checked');
        }
    }
}

function toggleSelectAll(container_form, elementId, nameStartsWith) {
    var allbox = document.getElementById(elementId);

    for (var i = 0; i < container_form.elements.length; i++) {
        var e = container_form.elements[i];
        if ((e != allbox) && (e.type == 'checkbox') && (e.id.indexOf(nameStartsWith) == 0) && !e.disabled) {
            e.checked = allbox.checked;
            allbox.checked ? $(e).parent().addClass('checked') : $(e).parent().removeClass('checked');
        }
    }
}

function disableSubmitButton(id) {
    $('#' + id).attr("disabled", "disabled");
}

function enableSubmitButton(id) {
    $('#' + id).removeAttr("disabled", "disabled");
}

function oneWayCheck(clicked, follower) {
    if ($('#' + clicked).is(':checked')) {
        $('#' + follower).attr('checked', true);
    }
}

function oneWayUnCheck(clicked, follower) {
    if (!$('#' + clicked).is(':checked')) {
        $('#' + follower).attr('checked', false);
    }
}

function prettyNumber(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function properCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function wait(ms) {
    ms += new Date().getTime();
    while (new Date() < ms) {
    }
}

function wcPromptInit() {
    var prompt = document.getElementById('editor-prompt');

    if (!prompt) {
        var overlay = document.getElementById('overlay');

        if (overlay)
            $('#overlay').append('<div id="editor-prompt"></div>');
        else
            $('body').append('<div id="overlay"><div id="editor-prompt"></div></div>');
    }

    $('#editor-prompt').append('<div class="popupHeader">\n\
			<h2 id="wcprompt-title"></h2>\n\
		</div>\n\
		<div class="popupContainer">\n\
			<p id="wcprompt-message"></p>\n\
			<p id="wcprompt-buttons" class="right" style="padding-top:1em;">\n\
			</p>\n\
		</div>\n\
	');
}

function wcPrompt(prompt, title, opts) {
    $('#wcprompt-message').html(prompt);

    if (title)
        $('#wcprompt-title').text(title);
    else
        $('#wcprompt-title').text('Prompt');

    for (var ix = 0; ix < opts.buttons.order.length; ix++) {
        if (opts.buttons.order[ix] == 'yes') {
            if (opts.buttons.yes) {
                $('#wcprompt-buttons').append('<input type="button" class="btn btn-info" id="wcprompt-button-yes" class="wcprompt-button" value="Yes" />');

                $('#wcprompt-button-yes').click(function () {
                    wcPromptReset();
                    opts.buttons.yes.apply(this);
                });
            }
        }
        else if (opts.buttons.order[ix] == 'no') {
            if (opts.buttons.no) {
                $('#wcprompt-buttons').append('<input type="button" class="btn btn-info" id="wcprompt-button-no" class="wcprompt-button" value="No" />');

                $('#wcprompt-button-no').click(function () {
                    wcPromptReset();
                    opts.buttons.no.apply(this);
                });
            }
        }
        else if (opts.buttons.order[ix] == 'ok') {
            if (opts.buttons.ok) {
                $('#wcprompt-buttons').append('<input type="button" class="btn btn-info" id="wcprompt-button-ok" class="wcprompt-button" value="OK" />');

                $('#wcprompt-button-ok').click(function () {
                    wcPromptReset();
                    opts.buttons.ok.apply(this);
                });
            }
        }
        else if (opts.buttons.order[ix] == 'cancel') {
            if (opts.buttons.cancel) {
                $('#wcprompt-buttons').append('<input type="button" class="btn btn-info" id="wcprompt-button-cancel" class="wcprompt-button" value="Cancel" />');

                $('#wcprompt-button-cancel').click(function () {
                    wcPromptReset();
                    opts.buttons.cancel.apply(this);
                });
            }
        }
    }

    var width = (opts.width ? opts.width : 400);
    var height = (opts.height ? opts.height : 132);

    showPopup('editor-prompt', width, height, true);

    if (opts.ondisplay)
        opts.ondisplay.apply(this);

    // lastly, set the focus to the first field with the prompt-input class
    window.setTimeout(function () {
        var focusSet = false;
        $('.prompt-input').each(function () {
            if ($(this).hasClass('default') && !focusSet) {
                $(this).focus();
                focusSet = true;
                return;
            }
        });

        if (!focusSet) {
            var ix = 0;
            $('.prompt-input').each(function () {
                if (ix == 0)
                    $(this).focus();

                ix++;
            });
        }
    }, 1);

}

function wcPromptReset() {
    $('#wcprompt-title').text('');
    $('#wcprompt-buttons').empty('');
    hidePopup('editor-prompt');
}

/*
 * Prototype functions
 */

String.prototype.startsWith = function (text) {
    return (this.indexOf(text) === 0);
}

String.prototype.endsWith = function (text) {
    return (this.match(text + "$") == text);
}

if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

$.fn.getCursorPosition = function () {
    var el = $(this).get(0);
    var start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;

        if ($.browser.opera) {
            if (start > 0) {
                var str = el.value.substring(0, start);
                start -= (str.split('\n').length - 1);
            }
        }
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                // 06/11/12 JLC The following line is supposed to account for IEs \r\n,
                // but doesn't work.
                //start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    // console.info('get cursor position ' + start);   
    return start;
}

function adjustOffset(el, offset) {
    /* From http://stackoverflow.com/a/8928945/611741 */
    var val = el.value, newOffset = offset;
    if (val.indexOf("\r\n") > -1) {
        var matches = val.replace(/\r\n/g, "\n").slice(0, offset).match(/\n/g);
        newOffset += matches ? matches.length : 0;
    }
    return newOffset;
}

$.fn.setCursorPosition = function (position) {
    /* From http://stackoverflow.com/a/7180862/611741 */
    if (this.length == 0) return this;
    return $(this).setSelectionWC(position, position);
}

$.fn.setSelectionWC = function (selectionStart, selectionEnd) {
    /* From http://stackoverflow.com/a/7180862/611741 
     modified to fit http://stackoverflow.com/a/8928945/611741 */
    if (this.length == 0) return this;
    input = this[0];
    // console.info('set cursor position ' + selectionStart);

    if (input.createTextRange) {
        // console.info('is IE ' + $.browser.version);
        input.focus();
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    } else if (input.setSelectionRange) {
        // console.info('is not IE');
        input.focus();
        selectionStart = adjustOffset(input, selectionStart);
        selectionEnd = adjustOffset(input, selectionEnd);
        input.setSelectionRange(selectionStart, selectionEnd);
    }

    return this;
}

$.fn.focusEnd = function () {
    /* From http://stackoverflow.com/a/7180862/611741 */
    this.setCursorPosition(this.val().length);
}
 