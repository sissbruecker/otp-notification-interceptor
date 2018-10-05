# OTP Notification Interceptor

This script intercepts browser notifications, looks for an OTP (one time password) and copies the password to the clipboard.
It could be used in a custom browser extension or in an Electron wrapper for a website. 

I personally use it with Android Messages wrapped in an Electron container using [nativefier](https://github.com/jiahaog/nativefier).
It just saves me some time to open Android Messages, copy the password manually and then go back to the website where I need to paste it.

If you want to try it yourself you need to customize the regular expressions at the top of the script.

Disclaimer:
- This is not production software
- It is your responsibility to keep your OTPs safe, make sure to review the script to see what it does
- It monkey patches window.Notification so things might break
