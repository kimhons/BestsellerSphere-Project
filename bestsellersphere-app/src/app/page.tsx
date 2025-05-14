'use client';

import GuidelineForm from "@/components/GuidelineForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-12 lg:p-24">
      <div className="w-full">
        <GuidelineForm />
      </div>
      {/* TODO: Add sections for How It Works, Featured Guides, etc. below the form */}
    </main>
  );
}

