import { createHmac, timingSafeEqual } from "node:crypto";

export type RsvpTokenPayload = {
    eventId: number;
    email: string;
    exp: number; // epoch ms
};

function base64UrlEncode(input: string | Buffer): string {
    return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string): string {
    return Buffer.from(input, "base64url").toString("utf8");
}

export function signRsvpToken(payload: RsvpTokenPayload, secret: string): string {
    const body = base64UrlEncode(JSON.stringify(payload));
    const signature = createHmac("sha256", secret).update(body).digest("base64url");
    return `${body}.${signature}`;
}

export function verifyRsvpToken(token: string, secret: string): RsvpTokenPayload | null {
    const parts = token.split(".");
    if (parts.length !== 2) {
        return null;
    }
    const [body, signature] = parts;
    const expected = createHmac("sha256", secret).update(body).digest("base64url");
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (signatureBuffer.length !== expectedBuffer.length) {
        return null;
    }
    if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
        return null;
    }
    try {
        const payload = JSON.parse(base64UrlDecode(body)) as RsvpTokenPayload;
        if (!payload || typeof payload.eventId !== "number" || typeof payload.email !== "string") {
            return null;
        }
        if (typeof payload.exp !== "number" || Number.isNaN(payload.exp)) {
            return null;
        }
        if (Date.now() > payload.exp) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}
