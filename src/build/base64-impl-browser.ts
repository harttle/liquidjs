
export function base64Encode (str: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)))
}

export function base64Decode (str: string): string {
  return new TextDecoder().decode(
    Uint8Array.from(atob(str), c => c.charCodeAt(0))
  )
}
