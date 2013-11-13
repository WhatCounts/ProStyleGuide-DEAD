function launchURLInternal(url, w, h, scroll, resize, title, status) {
    if (scroll == "1") scroll = "yes"; else scroll = "no";
    if (resize == "1") resize = "yes"; else resize = "no";
    if (status == "1") status = "yes"; else status = "no";
    popOff = window.open(url, "", "status=" + status + ",height=" + h + ",width=" + w + ",scrollbars=" + scroll + ",resizable=" + resize + ",toolbar=0,location=0");
    if (popOff != null) {
        if (popOff.opener == null)
            remote.opener = window;

        popOff.focus();
    }
}

function launchURL(url, w, h, scroll, resize, title) {
    launchURLInternal(url, w, h, scroll, resize, title, 1);
}

function launchURLNoStatus(url, w, h, scroll, resize, title) {
    launchURLInternal(url, w, h, scroll, resize, title, 0);
}

$(function () {
    oddEven('add');   // found in utils.js
    sort2WayImage();  // found in utils.js
});