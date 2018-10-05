/**
 * This Regex tests if the notification message contains an OTP
 * @type {RegExp}
 */
const CHECK_OTP_REGEX = /This is your .* login one-time password/;
/**
 * This Regex is used to capture the OTP in a group
 * @type {RegExp}
 */
const EXTRACT_OTP_REGEX = /(\d{6}) .+/;
/**
 * Defines which group in the above regex contains the OTP
 */
const EXTRACT_GROUP_NO = 1;

function patchNotification() {
    const OldNotify = window.Notification;
    const NewNotify = function OtpInterceptorNotification(title, opt) {
        handleNotification(title, opt);
        return new OldNotify(title, opt);
    };
    NewNotify.requestPermission = OldNotify.requestPermission.bind(OldNotify);
    Object.defineProperty(NewNotify, 'permission', {
        get: () => OldNotify.permission,
    });

    window.Notification = NewNotify;
}

function handleNotification(title, opts) {
    const body = opts && opts.body;
    const hasBody = !!body;
    const isOtpMessage = hasBody && CHECK_OTP_REGEX.test(body);

    if (!isOtpMessage) return;

    const match = EXTRACT_OTP_REGEX.exec(body);
    const otp = match && match[EXTRACT_GROUP_NO];

    if (!otp) {
        console.error('Could not extract OTP from message');
        return;
    }

    const copySuccess = copyToClipboard(otp);

    if (copySuccess) {
        setTimeout(() => {
            const message = `Pasted OTP to clipboard: ${otp}`;
            window.Notification('OTP Interceptor', { body: message });
            console.info(message);
        });
    }
}

function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        return true;
    } catch (err) {
        console.error('Unable to copy to clipboard', err);
        return false;
    } finally {
        document.body.removeChild(textArea);
    }
}

patchNotification();
