
export async function completePasswordReset(token: string, newPassword: string) {
    return { success: true };
}

export async function requestPasswordReset(email: string) {
    return { success: true };
}

export async function verifyResetOtp(email: string, otp: string) {
    return { success: true };
}
