export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center px-6 md:px-12 lg:px-20">
      {/* Hero Section */}
      <header className="text-center my-12">
        <h1 className="text-4xl font-extrabold mb-4">About PaveAI</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          PaveAI is a cutting-edge platform designed to leverage artificial
          intelligence for improving road infrastructure and urban planning. By
          offering actionable insights to governments, insurance providers, and
          urban planners, we aim to make roads safer and cities smarter.
        </p>
      </header>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Road Quality Analysis
          </h2>
          <p className="text-gray-600">
            Employ advanced AI models to assess road conditions, providing
            actionable insights for efficient planning and maintenance.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Government Solutions
          </h2>
          <p className="text-gray-600">
            Assist governments in prioritizing infrastructure improvements to
            enhance safety and optimize resource allocation.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Insurance Insights
          </h2>
          <p className="text-gray-600">
            Enable insurance providers to better evaluate road conditions and
            associated risks, leading to more accurate policies.
          </p>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="mt-16 w-full max-w-7xl text-center">
        <h2 className="text-3xl font-bold mb-8">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Team Member Cards */}
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <h3 className="text-xl font-semibold text-primary mb-2">Thomas</h3>
            <p className="text-gray-600">Photo/Description</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <h3 className="text-xl font-semibold text-primary mb-2">Edan</h3>
            <p className="text-gray-600">Photo/Description</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <h3 className="text-xl font-semibold text-primary mb-2">Ethan</h3>
            <p className="text-gray-600">Photo/Description</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <h3 className="text-xl font-semibold text-primary mb-2">Anthony</h3>
            <p className="text-gray-600">Photo/Description</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <h3 className="text-xl font-semibold text-primary mb-2">Scott</h3>
            <p className="text-gray-600">Photo/Description</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <h3 className="text-xl font-semibold text-primary mb-2">Kiarash</h3>
            <p className="text-gray-600">Photo/Description</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <footer className="mt-16 text-center">
        <a
          href="/get-started"
          className="px-8 py-3 bg-primary text-white font-medium text-lg rounded-lg hover:bg-primary-dark transition duration-200 shadow-md"
        >
          Get Started with PaveAI
        </a>
      </footer>
    </div>
  );
}
