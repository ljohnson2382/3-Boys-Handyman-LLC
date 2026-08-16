import { Helmet } from "react-helmet-async";

const SITE_NAME = "Healthy Homes, LLC";
const SITE_URL = "https://homefixandbuild.org";
const DEFAULT_IMAGE = `${SITE_URL}/images/about-hero-exterior-home.jpg`;

// Renders per-page <title>/meta/canonical/OG/Twitter tags via react-helmet-async, plus
// optional JSON-LD structured data. Note: since this is a client-rendered SPA with no
// SSR/prerendering, tags set here only exist after JS runs — fine for Google (which
// executes JS), but link-preview bots (Facebook, Slack, iMessage, etc.) generally don't,
// so they'll always see index.html's static tags regardless of which route was shared.
// Keep index.html's tags accurate for the homepage for that reason.
const SEO = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  noindex = false,
  jsonLd
}) => {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export const SITE = { SITE_NAME, SITE_URL, DEFAULT_IMAGE };
export default SEO;
