// lib/email-template.ts
export function magicLinkEmail({ url, host }: { url: string; host: string }) {
    return {
        subject: `Вхід на ${host}`,
        html: `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid #2a2a2a;">
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:40px 48px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">CityChe</h1>
              <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Єдине вікно для взаємодії з Черкасами</p>
            </td>
          </tr>
          <tr>
            <td style="padding:48px;">
              <h2 style="margin:0 0 16px;color:#f5f5f5;font-size:22px;font-weight:600;">Увійдіть до свого акаунту</h2>
              <p style="margin:0 0 32px;color:#a3a3a3;font-size:15px;line-height:1.6;">
                Натисніть кнопку нижче — вона діє <strong style="color:#f5f5f5;">24 години</strong> і лише для одного входу.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="background:#3b82f6;border-radius:10px;">
                    <a href="${url}" style="display:inline-block;padding:14px 40px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                      Увійти в CityChe →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;color:#737373;font-size:13px;">Якщо кнопка не працює:</p>
              <p style="margin:0;word-break:break-all;">
                <a href="${url}" style="color:#60a5fa;font-size:12px;">${url}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #2a2a2a;">
              <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;">
                Якщо ти не запитував цей лист — просто ігноруй його.<br/>
                © ${new Date().getFullYear()} CityChe, Черкаси
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim(),
        text: `Увійти на ${host}: ${url}\n\nПосилання діє 24 години.`,
    }
}
