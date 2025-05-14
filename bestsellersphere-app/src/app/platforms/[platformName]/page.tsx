// app/platforms/[platformName]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface PlatformData {
  [key: string]: string; // All values from CSV are strings
}

// Helper function to format display keys (e.g., from "eBook - Max File Size" to "Max File Size")
const formatDisplayKey = (key: string) => {
  return key
    .replace(/^eBook - /i, "")
    .replace(/^Paperback - /i, "")
    .replace(/^Hardcover - /i, "")
    .replace(/\(.*?\)/g, "") // Remove content in parentheses
    .trim();
};

export default function PlatformDetailPage() {
  const params = useParams();
  const platformName = params.platformName ? decodeURIComponent(params.platformName as string) : null;
  const [platformDetails, setPlatformDetails] = useState<PlatformData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!platformName) {
      setError("Platform name not found in URL.");
      setIsLoading(false);
      return;
    }

    const fetchPlatformData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/get-platform-data");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const allPlatforms = data.platformData as PlatformData[];
        const foundPlatform = allPlatforms.find(p => p["Platform Name"] === platformName);

        if (foundPlatform) {
          setPlatformDetails(foundPlatform);
        } else {
          setError(`Details for platform "${platformName}" not found.`);
        }
      } catch (e) {
        console.error("Failed to fetch platform data:", e);
        setError("Could not load publishing platform data. Please try again later.");
      }
      setIsLoading(false);
    };

    fetchPlatformData();
  }, [platformName]);

  if (isLoading) {
    return <main className="flex min-h-screen flex-col items-center justify-center p-4"><p>Loading platform details...</p></main>;
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="w-full max-w-lg">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </main>
    );
  }

  if (!platformDetails) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <p>No details available for this platform.</p>
      </main>
    );
  }

  // Categorize details for better display
  const generalDetails: PlatformData = {};
  const ebookDetails: PlatformData = {};
  const paperbackDetails: PlatformData = {};
  const hardcoverDetails: PlatformData = {};
  const otherDetails: PlatformData = {};

  for (const key in platformDetails) {
    if (key.toLowerCase().startsWith("ebook -")) {
      ebookDetails[key] = platformDetails[key];
    } else if (key.toLowerCase().startsWith("paperback -")) {
      paperbackDetails[key] = platformDetails[key];
    } else if (key.toLowerCase().startsWith("hardcover -")) {
      hardcoverDetails[key] = platformDetails[key];
    } else if (key === "Platform Name" || key === "Platform Type" || key === "Services Offered" || key === "eBook - Royalty Rate (General)" || key === "Paperback - Royalty Rate (General)" || key === "Hardcover - Royalty Rate (General)" || key === "Important Notes / Unique Features" || key === "eBook - Key Regions/Markets" || key === "Print - ISBN Requirements" || key === "Print - Proof Copies" || key === "Print - Distribution Channels (General)") {
      generalDetails[key] = platformDetails[key];
    } else {
      otherDetails[key] = platformDetails[key]; // Catch-all for less common or uncategorized fields
    }
  }

  const renderDetailsSection = (title: string, details: PlatformData) => {
    const entries = Object.entries(details).filter(([_, value]) => value && value.trim() !== "" && value.trim().toLowerCase() !== "n/a" && value.trim().toLowerCase() !== "no");
    if (entries.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-300">{title}</h3>
        <ul className="space-y-2">
          {entries.map(([key, value]) => (
            <li key={key} className="flex flex-col sm:flex-row sm:items-start">
              <strong className="w-full sm:w-1/3 md:w-1/4 font-medium text-slate-600 dark:text-slate-400">{formatDisplayKey(key)}:</strong>
              <span className="w-full sm:w-2/3 md:w-3/4 text-slate-800 dark:text-slate-200">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-12 lg:p-24">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{platformDetails["Platform Name"]}</CardTitle>
          {platformDetails["Platform Type"] && 
            <CardDescription className="text-lg mt-1">
              {platformDetails["Platform Type"]}
            </CardDescription>
          }
        </CardHeader>
        <CardContent className="space-y-6">
          {renderDetailsSection("General Information", generalDetails)}
          {Object.keys(ebookDetails).length > 0 && <Separator className="my-6" />}
          {renderDetailsSection("eBook Specifications", ebookDetails)}
          {Object.keys(paperbackDetails).length > 0 && <Separator className="my-6" />}
          {renderDetailsSection("Paperback Specifications", paperbackDetails)}
          {Object.keys(hardcoverDetails).length > 0 && <Separator className="my-6" />}
          {renderDetailsSection("Hardcover Specifications", hardcoverDetails)}
          {Object.keys(otherDetails).length > 0 && <Separator className="my-6" />}
          {renderDetailsSection("Other Details", otherDetails)}
        </CardContent>
      </Card>
    </main>
  );
}

