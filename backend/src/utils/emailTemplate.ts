export function buildNotificationEmail(title: string, body?: string, link?: string) {
  return `
    <div style="font-family: sans-serif;">
      <h2>${title}</h2>
      <p>${body ?? ""}</p>
      ${
        link
          ? `<p><a href="${link}" target="_blank" rel="noopener noreferrer">Open details</a></p>`
          : ""
      }
      <hr />
      <small>EasyMake MFU Notification</small>
    </div>
  `;
}
