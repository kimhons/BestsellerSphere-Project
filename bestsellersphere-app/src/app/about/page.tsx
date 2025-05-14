// app/about/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-12 lg:p-24">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">About BestsellerSphere.com</CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Empowering Authors on Their Self-Publishing Journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-base md:text-lg leading-relaxed">
          <p>
            BestsellerSphere.com was born from a simple idea: to demystify the often complex world of self-publishing and provide authors with the clear, actionable information they need to succeed. We understand that navigating the myriad of publishing platforms, each with its own unique set of formatting guidelines and submission requirements, can be a daunting task. Our mission is to streamline this process, saving you time and effort so you can focus on what you do best – writing.
          </p>
          <p>
            Our flagship feature, the Interactive Guideline Tool, is designed to provide tailored formatting specifications for your book based on your specific project details. Whether you are publishing an ebook, paperback, or hardcover, our tool helps you quickly understand the requirements for various major publishing platforms.
          </p>
          <p>
            Beyond the guideline tool, BestsellerSphere.com aims to be a comprehensive resource hub for authors. We are continually working to expand our offerings to include:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Detailed guides and comparisons of self-publishing platforms.</li>
            <li>Tips and best practices for book design, formatting, and marketing.</li>
            <li>Interviews with successful self-published authors.</li>
            <li>A curated list of tools and services to aid your publishing process.</li>
          </ul>
          <p>
            We believe that every author deserves the chance to see their work published and reach readers. BestsellerSphere.com is here to support you every step of the way, providing clarity and confidence as you navigate the path to becoming a bestseller.
          </p>
          <p>
            Thank you for visiting, and we wish you the very best on your publishing adventure!
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

