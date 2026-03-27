

## Fix Social Share Image (Remove Lovable Branding)

The Lovable logo appearing when you share is caused by the `og:image` meta tag on line 20-21 of `index.html`. It points to a Lovable-hosted image (`storage.googleapis.com/gpt-engineer-file-uploads/...`) which includes their branding overlay.

### Solution

**`index.html`** — Replace the `og:image` and `twitter:image` URLs with one of your own dish photos already in the project (e.g., one of the uploaded tresrotterdam images in `public/`).

Steps:
1. Copy one of your best dish photos to `public/og-image.jpg` (to use as the share preview)
2. Update lines 20-21 in `index.html` to point to `/og-image.jpg` with the published domain: `https://season-shift-studio.lovable.app/og-image.jpg`

After publishing, platforms like WhatsApp, iMessage, LinkedIn etc. will show your dish photo instead of the Lovable-branded image.

Note: After updating, you'll need to click **Publish → Update** for the change to go live. Cached previews on messaging apps may take some time to refresh.

