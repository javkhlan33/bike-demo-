/**
 * Client-safe Cloudinary availability check (cloud name only).
 * Never expose API secret to the browser.
 */
export function isCloudinaryConfiguredClient(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
}
