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

    $("select").selectpicker({style: 'btn btn-info', menuStyle: 'dropdown-inverse'});

    $('.table-sort').tablesorter();

    $('.tabbable').find('> ul > li > a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

}, false);