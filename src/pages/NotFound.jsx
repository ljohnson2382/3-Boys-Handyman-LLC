import SEO from "../components/SEO";

const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen text-center">
    <SEO title="Page Not Found" description="The page you're looking for doesn't exist." path="/404" noindex />
    <h1 className="text-4xl font-bold text-orange">404 - Page Not Found</h1>
  </div>
);

export default NotFound;
