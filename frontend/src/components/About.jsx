import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";

const features = [
  {
    name: "Automated Document Classification",
    description:
      "Uses AI to categorize documents by content. NLP identifies themes and topics for better organization and retrieval.",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Enhanced Search Capabilities",
    description:
      "Vector-based search enables semantic understanding, allowing retrieval of relevant documents even without exact keyword matches.",
    icon: LockClosedIcon,
  },
  {
    name: "Metadata Generation & Extraction",
    description:
      "Extracts key information such as dates, names, and terms to generate metadata for improved indexing and search.",
    icon: ServerIcon,
  },
];

export default function About() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-indigo-600">
                Upload fast
              </h2>
              <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Smarter Document Insights
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                Unlock deeper understanding with AI-powered document analysis.
                From intelligent classification to precise metadata extraction,
                streamline your workflow and enhance productivity effortlessly.
              </p>

              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute left-1 top-1 size-5 text-indigo-600"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            alt="Product screenshot"
            src="./document.webp"
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
}
