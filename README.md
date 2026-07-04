# Hugo Resume

A simple CV/resume generator built with Hugo.

Resume content is defined in YAML and rendered as a static HTML page. A small Puppeteer export script can also render the resume to a single-page PDF.

<img src="assets/images/example-resume.png" alt="Example resume" width="50%">

## Prerequisites

- [Hugo](https://gohugo.io/installation/)
- [Node.js and npm](https://nodejs.org/)

## Usage

Clone the repository and install the PDF export dependency:

```bash
git clone https://github.com/yourusername/hugo-resume.git
cd hugo-resume
npm install
````

Resume content is defined in `data/resume.yml`. Edit this file with your own experience, education, skills, projects and contact information.

### Theme selection

Themes are located in `themes/` directory. Change the active theme by updating `hugo.toml`:

```toml
theme = "plain"
```

Available themes:

- `plain` - Clean, minimal light theme with blue accents
- `colorful` - Dark teal theme with gradient background pattern

### Cover letters via posts

Cover letters are standard Hugo content pages under `content/posts/`.

Each markdown file creates a page automatically at `/posts/<slug>/` using the posts layout.

### Build website

```bash
hugo
```

### PDF Generation

Start the Hugo development server:

```bash
hugo serve
```

The resume will be available at `http://localhost:1313/`.

To export the resume as a PDF, leave the Hugo development server running and, **in a separate terminal**, run:

```bash
npm run pdf
```

Generated PDFs are written to `assets/out/`:

- `resume.pdf` for the root homepage
- `<post-slug>.pdf` for each post page found under `public/posts/*/index.html`

The export script uses Puppeteer to measure the rendered page height and produce a single-page PDF matching the web version.
