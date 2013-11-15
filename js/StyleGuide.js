
var FlatUiInputs = (function () {

    var toggleCheckboxList = function () {
        var doc = document;
        var selectBox = doc.getElementById('SelectAll');
        var inputBoxes = doc.querySelectorAll('input[data-toggle="checkbox"]');
        var len = inputBoxes.length;
        var checkBox;
        var parent;

        while (len--) {
            checkBox = inputBoxes[len];
            parent = $(checkBox).parent('label').get()[0];
            if (selectBox.checked) {
                parent.className = 'checkbox';
                $(checkBox).prop('checked', true);
            }
            else {
                parent.className += ' checked';
                $(checkBox).prop('checked', false);
            }
        }

        selectBox.checked = !selectBox.checked;
    };

    var getNewInput = function () {
        var doc = document;
        var divContainer = doc.createElement('div');
        var button = doc.createElement('button');
        var span = doc.createElement('span');
        var input = doc.createElement('input');

        input.id = this.id;
        input.setAttribute('type', this.getAttribute('type'));
        input.setAttribute('onchange', this.getAttribute('onchange'));
        input.setAttribute('value', this.getAttribute('value'));
        input.setAttribute('name', this.getAttribute('name'));

        divContainer.className = 'input-prepend input-datepicker';

        button.className = 'btn';

        span.className = 'fui-calendar';

        button.appendChild(span);
        divContainer.appendChild(button);
        divContainer.appendChild(input);
        return divContainer;
    };

    var updateSelect = function (id, value) {
        var select = $('#' + id);
        select.val(value);
        select.selectpicker('render');
    };


    /*
     * This function is for legacy functionality. All future events should be handled unobtrusively
     * */
    var radioOnClick = function () {

        var radioInputs = document.querySelectorAll('label.radio');
        var len = radioInputs.length;
        var input;
        var onClick;
        var inputLabel;

        while (len--) {

            inputLabel = radioInputs[len];

            input = inputLabel.querySelector('input[type="radio"]');

            if (input) {

                onClick = input.getAttribute('onclick');

                if (onClick) {
                    inputLabel.setAttribute('onclick', onClick);
                }
            }
        }
    };

    return {
        toggleCheckboxList: toggleCheckboxList,
        getNewInput: getNewInput,
        radioOnClick: radioOnClick,
        updateSelect: updateSelect
    }

})();

document.addEventListener('DOMContentLoaded', function () {

    var doc = document;
    var clickEvent = 'click';

    doc.getElementById('ModalClose').addEventListener(clickEvent, function () {
        $('#ExampleModal').modal('hide');
    }, false);

    doc.getElementById('OpenDialog').addEventListener(clickEvent, function () {
        $('#ExampleModal').modal('show');
    }, false);

    $('#ExampleModal').modal({
        show: false
    });

    //Enable Flat UI objects

    $('[data-toggle="checkbox"]').each(function () {
        $(this).checkbox();
    });

    $('[data-toggle="radio"]').each(function () {
        $(this).radio();
    });

    $("select").selectpicker({style: 'btn btn-primary', menuStyle: 'dropdown-inverse'});

    $('.table-sort').tablesorter();

    $('.tabbable').find('> ul > li > a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $('.date-pick').each(function () {
        var input = FlatUiInputs.getNewInput.call(this);
        $(this).after(input);
        var parent = this.parentNode;
        parent.removeChild(this);
        var inputField = input.querySelector('input');
        $(inputField).datepicker({
            showOtherMonths: true,
            selectOtherMonths: true,
            dateFormat: "mm/dd/yy",
            yearRange: '-1:+1'
        }).prev('.btn').on('click', function (e) {
                e && e.preventDefault();
                inputField.focus();
            });
    });

}, false);