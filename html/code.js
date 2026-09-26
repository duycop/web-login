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

    // 1. Tải trang: Gửi ck lên /api/check_logined kiểm tra session
    const ck = getCookie('ck');
    if (ck) {
        $.ajax({
            url: '/api/check_logined',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ ck: ck }),
            success: function(response) {
                if (response && response.ok === 1) {
		    window.location.href = 'mat.html';
                } else {
                    $('#login-card').removeClass('d-none');
                }
            },
            error: function() {
                $('#login-card').removeClass('d-none');
            }
        });
    } else {
        $('#login-card').removeClass('d-none');
    }

    // 2. Submit form Login: POST uid và pwd
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        $('#error-alert').addClass('d-none');

        const dataToSend = {
            uid: $('#username').val(),
            pwd: $('#password').val()
        };

        $.ajax({
            url: '/api/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dataToSend),
            success: function(response) {
                if (response && response.ok === 1) {
                    if (response.ck) {
                        setCookie('ck', response.ck, 7); // Lưu cookie 7 ngày
                    }
                    window.location.href = 'mat.html';
                } else {
                    $('#error-alert').text(response.msg || 'có gì đó sai sai!').removeClass('d-none');
                }
            },
            error: function() {
                $('#error-alert').text('Không thể kết nối đến API backend!').removeClass('d-none');
            }
        });
    });
});
