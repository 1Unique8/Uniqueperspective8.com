# GitHub Secrets Setup

Required secrets for this repository:

| Secret Name              | Description                                      | Where to get it |
|-------------------------|--------------------------------------------------|-----------------|
| `NOTION_TOKEN`          | Notion Internal Integration Token                | Notion → My Integrations |
| `NOTION_DATABASE_ID`    | Products database ID                             | From your Products database URL |
| `WC_SITE_URL`           | Your WordPress site URL                          | e.g. `https://uniqueperspective8.com` |
| `WC_CONSUMER_KEY`       | WooCommerce REST API Consumer Key                | WooCommerce → Settings → REST API |
| `WC_CONSUMER_SECRET`    | WooCommerce REST API Consumer Secret             | Same as above |

---

**How to add secrets:**
1. Go to repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"** for each one.

Never commit these values to the repo.
