$(document).ready(function() {
    // Hàm hỗ trợ làm việc với Cookie
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

function decodeHTML(htmlStr) {
    const doc = new DOMParser().parseFromString(htmlStr, 'text/html');
    return doc.body.textContent;
}

    // 1. Tải trang: Gửi ck lên /api/check_logined kiểm tra session
    const ck = getCookie('ck');
    if (ck) {
        $.ajax({
            url: '/api/mat',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ ck: ck }),
            success: function(response) {
		$('#kq').html(decodeHTML(response));
            },
            error: function() {
                $('#kq').html('loi gi do');
            }
        });
    } else {
        $('#kq').html('ban chua login');
    }

});
