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
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:40px 48px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">CityChe</h1>
              <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Єдине вікно для взаємодії з Черкасами</p>
            </td>
          </tr>
          <tr>
            <td style="padding:48px;">
              <h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;font-weight:600;">Увійдіть до свого акаунту</h2>
              <p style="margin:0 0 32px;color:#64748b;font-size:15px;line-height:1.6;">
                Натисніть кнопку нижче — вона діє <strong style="color:#0f172a;">24 години</strong> і лише для одного входу.
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
              <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;">Якщо кнопка не працює:</p>
              <p style="margin:0;word-break:break-all;">
                <a href="${url}" style="color:#3b82f6;font-size:12px;">${url}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
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

export function inviteAdminEmail({ url, host, invitedBy }: { url: string; host: string; invitedBy?: string }) {
    return {
        subject: `Запрошення до команди адміністраторів ${host}`,
        html: `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:40px 48px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">CityChe</h1>
              <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Єдине вікно для взаємодії з Черкасами</p>
            </td>
          </tr>

          <!-- Badge -->
          <tr>
            <td style="padding:0 48px;">
              <table cellpadding="0" cellspacing="0" style="margin:-18px auto 0;position:relative;z-index:1;">
                <tr>
                  <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:999px;padding:8px 20px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                    <p style="margin:0;color:#3b82f6;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">
                      ✦ &nbsp;Запрошення адміністратора
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 32px;">
              <h2 style="margin:0 0 12px;color:#0f172a;font-size:22px;font-weight:600;line-height:1.3;">
                Тебе запрошено до команди
              </h2>
              <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.7;">
                ${invitedBy
            ? `<strong style="color:#0f172a;">${invitedBy}</strong> запрошує тебе стати адміністратором порталу CityChe — міського інформаційного ресурсу Черкас.`
            : `Тебе запрошено стати адміністратором порталу CityChe — міського інформаційного ресурсу Черкас.`
        }
              </p>

              <!-- Perks -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 32px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 14px;color:#94a3b8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;">Що ти отримуєш</p>
                    <table cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding:7px 0;color:#334155;font-size:14px;">
                          <span style="color:#3b82f6;margin-right:10px;">▸</span>Доступ до адмін-панелі порталу
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0;color:#334155;font-size:14px;border-top:1px solid #e2e8f0;">
                          <span style="color:#3b82f6;margin-right:10px;">▸</span>Керування категоріями та ресурсами
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:7px 0;color:#334155;font-size:14px;border-top:1px solid #e2e8f0;">
                          <span style="color:#3b82f6;margin-right:10px;">▸</span>Модерація звернень від мешканців
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#2563eb,#3b82f6);border-radius:10px;box-shadow:0 4px 16px rgba(59,130,246,0.3);">
                    <a href="${url}" style="display:inline-block;padding:15px 44px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.01em;">
                      Прийняти запрошення →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry note -->
              <table cellpadding="0" cellspacing="0" width="100%" style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
                <tr>
                  <td style="padding:14px 20px;">
                    <p style="margin:0;color:#92400e;font-size:13px;line-height:1.5;">
                      <strong>⏳ Посилання діє 48 годин</strong> і призначено лише для тебе. Не передавай його іншим.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fallback link -->
          <tr>
            <td style="padding:0 48px 32px;">
              <p style="margin:0 0 6px;color:#94a3b8;font-size:12px;">Якщо кнопка не працює, скопіюй посилання:</p>
              <p style="margin:0;word-break:break-all;">
                <a href="${url}" style="color:#3b82f6;font-size:12px;">${url}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                Якщо ти не очікував цього листа — просто ігноруй його, нічого не станеться.<br/>
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
        text: `Тебе запрошено до команди адміністраторів CityChe.\n\nПрийняти запрошення: ${url}\n\nПосилання діє 48 годин.`,
    }
}