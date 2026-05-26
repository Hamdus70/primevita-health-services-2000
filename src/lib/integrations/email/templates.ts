export function getAuthOtpTemplate(code: string) {
  return `
    <h1>NovaCare Authentication</h1>
    <p>Your one-time password is: <strong>${code}</strong></p>
    <p>This code will expire in 10 minutes.</p>
  `;
}

export function getTempPasswordTemplate(password: string) {
  return `
    <h1>NovaCare Staff Account</h1>
    <p>Your temporary password is: <strong>${password}</strong></p>
    <p>Please log in and change your password immediately.</p>
  `;
}

export function getGenericNotificationTemplate(title: string, message: string) {
  return `
    <h1>${title}</h1>
    <p>${message}</p>
  `;
}
