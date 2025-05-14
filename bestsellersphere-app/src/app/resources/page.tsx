// app/resources/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "article" | "tool" | "guide"; // Example types
  link?: string; // External link
  internalLink?: string; // Link to content within BestsellerSphere
}

// Placeholder data - in a real app, this might come from a CMS or database
const resources: Resource[] = [
  {
    id: "formatting-basics",
    title: "Mastering Manuscript Formatting: A Beginner's Guide",
    description: "Learn the fundamental principles of formatting your manuscript for both ebook and print to ensure a professional presentation.",
    type: "guide",
    internalLink: "/resources/formatting-basics" // Placeholder for a future detailed page
  },
  {
    id: "cover-design-tips",
    title: "10 Tips for a Cover That Sells Books",
    description: "Your cover is the first thing readers see. Discover key design principles and common pitfalls to avoid.",
    type: "article",
    internalLink: "/resources/cover-design-tips"
  },
  {
    id: "understanding-isbn",
    title: "ISBNs Explained: Do You Need One and How to Get It?",
    description: "Navigate the world of ISBNs. Understand their purpose, when they are required, and your options for obtaining them.",
    type: "guide",
    internalLink: "/resources/understanding-isbn"
  },
  {
    id: "keyword-research-tools",
    title: "Top 5 Free Keyword Research Tools for Authors",
    description: "Boost your book's discoverability by finding the right keywords. Explore these free tools to get started.",
    type: "tool",
    link: "#" // Placeholder, would link to an article listing tools or directly to tools
  },
  {
    id: "self-publishing-checklist",
    title: "The Ultimate Self-Publishing Checklist",
    description: "From manuscript to market, ensure you haven't missed any crucial steps with our comprehensive checklist.",
    type: "guide",
    internalLink: "/resources/self-publishing-checklist"
  }
];

export default function ResourcesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-12 lg:p-24">
      <div className="w-full max-w-4xl">
        <CardHeader className="text-center mb-8">
          <CardTitle className="text-3xl font-bold">Author Resources</CardTitle>
          <CardDescription className="text-lg mt-2">
            Guides, articles, and tools to help you on your self-publishing journey.
          </CardDescription>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Card key={resource.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                <span className="text-xs uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                  {resource.type}
                </span>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  {resource.description}
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                {resource.internalLink && (
                  <Link href={resource.internalLink} className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium">
                    Read More &rarr;
                  </Link>
                )}
                {resource.link && (
                  <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium">
                    Access Tool &rarr;
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
        {/* Placeholder for future detailed resource pages - for now, links might be dead or loop back */}
      </div>
    </main>
  );
}

