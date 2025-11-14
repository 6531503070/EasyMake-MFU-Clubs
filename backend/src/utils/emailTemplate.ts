// src/utils/emailTemplate.ts
export function buildNotificationEmail(
  title: string,
  body?: string,
  link?: string
) {
  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 16px;">
      <h2 style="margin-bottom: 8px;">${title}</h2>
      ${body ? `<p style="margin-bottom: 16px;">${body}</p>` : ""}
      ${
        link
          ? `<p style="margin-bottom: 16px;">
               <a href="${link}" target="_blank" rel="noopener noreferrer"
                  style="display:inline-block;padding:8px 14px;border-radius:6px;background:#2563eb;color:#fff;text-decoration:none;">
                 Open details
               </a>
             </p>`
          : ""
      }
      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
      <p style="font-size:12px;color:#6b7280;">
        This email was sent by EasyMake MFU Clubs.
      </p>
    </div>
  `;
}
