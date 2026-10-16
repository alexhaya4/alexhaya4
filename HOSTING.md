# Portfolio website

The GitHub profile continues to use `README.md`. The static website uses `index.html`, `assets/site.css` and `projects/tinyml-deployer/index.html`. The project README is a separate GitHub-readable case study.

## Publish with GitHub Pages

No Node installation or build step is required. Publish the root of `main`; `.nojekyll` preserves the static HTML.

From a terminal authenticated with GitHub CLI, check the current configuration:

```bash
gh api repos/alexhaya4/alexhaya4/pages
```

If no Pages site exists and that request returns HTTP 404, create it:

```bash
gh api --method POST repos/alexhaya4/alexhaya4/pages \
  -f build_type=legacy \
  -f 'source[branch]=main' \
  -f 'source[path]=/'
```

If Pages already exists, inspect its source and domain before changing anything. This site expects `main` and `/`. Preserve any existing custom-domain configuration, and update canonical and social-image URLs plus `sitemap.xml` if that domain is used.

Check the deployment:

```bash
gh api repos/alexhaya4/alexhaya4/pages/builds/latest --jq '{status, error}'
gh api repos/alexhaya4/alexhaya4/pages --jq .html_url
```

Once the build succeeds, verify both pages, navigation, video playback and mobile layouts in a browser:

- `https://alexhaya4.github.io/alexhaya4/`
- `https://alexhaya4.github.io/alexhaya4/projects/tinyml-deployer/`

The website is not live merely because source files were committed. Pages configuration and a successful deployment are required.

## Content and evidence

The project page identifies the beta version, source-install requirement, separate fixture graphs and pending physical-board validation. The numeric table is sourced from the copied archived reports. Keep those claims consistent with the reports when updating the page.

Media and report provenance is documented in `assets/README.md`. The copied video has no audio; the page includes a text alternative and links to the full command transcript.

## Search discovery

After deployment, verify the website URL-prefix property in Google Search Console and submit `sitemap.xml`. Ownership verification requires the account owner's verification method or token. An indexing request does not guarantee indexing or a particular ranking.
