# AMIRA — prebuilt website for hosting

This branch contains the static website generated from `main`. It is ready for Apache/LiteSpeed hosting. Set the domain document root to this branch's `dist/` directory, where `index.html`, `_astro/`, and `assets/` are direct children.

No npm install or Astro build is needed on the hosting account. Node.js is used by GitHub Actions to build the source on `main`.

## First installation on Rumahweb

Use a separate directory for this prebuilt branch so an earlier source checkout and partial build are preserved:

```sh
cd ~/public_html/repositories
git clone --branch hosting --single-branch https://github.com/naufalzahirr/amira_landingpages.git amira_live
```

Then set the document root for `amiraedu.com` in cPanel to:

```text
public_html/repositories/amira_live/dist
```

This path is relative to the hosting account's home directory. cPanel may display it as `/public_html/repositories/amira_live/dist`. If the field requires a full filesystem path, use `/home/<account>/public_html/repositories/amira_live/dist`, replacing `<account>` with the cPanel account name.

Changing the document root is a manual hosting action. This workflow does not change the server, DNS, or cPanel configuration.

## Updates

Edit and push the source to `main`. Wait for **Build hosting branch** to finish successfully in GitHub Actions, then run this in cPanel Terminal:

```sh
git -C ~/public_html/repositories/amira_live pull --ff-only
```

The `dist/build-source.txt` file records the source commit used for the published build. The `hosting` branch is generated; make source edits on `main`.

If cPanel Git Version Control manages this checkout, select branch `hosting` and use **Update from Remote** after the GitHub build succeeds. No `.cpanel.yml` copy step is required when the domain already serves this checkout's `dist/` directory.

If the suggested directory already exists, inspect it before choosing a fresh directory name; adjust the document root to match that checkout's `dist/` directory.
