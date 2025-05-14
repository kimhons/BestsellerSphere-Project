
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define interfaces for form state and guideline data
interface FormData {
  bookTitle: string;
  authorName: string;
  bookType: string;
  formats: string[];
  bookSize: string;
  pageCount: string; // Keep as string for input, parse to number later
  paperType: string;
  bleed: string;
  coverFinish: string;
  platforms: string[];
}

interface PlatformData {
  [key: string]: string; // Allow any string keys for CSV columns
}

interface GeneratedGuideline {
  platformName: string;
  // Add specific fields based on your CSV structure and output needs
  ebookManuscriptFormat?: string;
  ebookCoverDimensions?: string;
  ebookCoverResolution?: string;
  // ... other fields for paperback, hardcover etc.
  notes?: string;
  printTrimSize?: string;
  printSpineWidth?: string;
  printCoverDimensions?: string;
  printInteriorFormat?: string;
  printMargins?: string;
  printBleed?: string;
}

export default function GuidelineForm() {
  const [formData, setFormData] = useState<FormData>({
    bookTitle: '',
    authorName: '',
    bookType: '',
    formats: [],
    bookSize: '',
    pageCount: '',
    paperType: '',
    bleed: 'unsure',
    coverFinish: '',
    platforms: [],
  });

  const [allPlatformData, setAllPlatformData] = useState<PlatformData[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
  const [generatedGuidelines, setGeneratedGuidelines] = useState<GeneratedGuideline[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch platform data when component mounts
    const fetchPlatformData = async () => {
      try {
        const response = await fetch('/api/get-platform-data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllPlatformData(data.platformData); // Assuming API returns { platformData: [...] }
        // Extract unique platform names for the checklist
        const platformNames = Array.from(new Set(data.platformData.map((p: PlatformData) => p["Company Name"]))).filter(Boolean) as string[];
        setAvailablePlatforms(platformNames);
      } catch (e) {
        console.error("Failed to fetch platform data:", e);
        setError("Could not load publishing platform data. Please try again later.");
      }
    };
    fetchPlatformData();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      }
      return { ...prev, [field]: currentValues.filter(item => item !== value) };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedGuidelines(null);

    // Basic validation (can be expanded)
    if (formData.formats.length === 0) {
      setError("Please select at least one format (eBook, Paperback, Hardcover).");
      setIsLoading(false);
      return;
    }
    if (formData.platforms.length === 0) {
      setError("Please select at least one publishing platform.");
      setIsLoading(false);
      return;
    }
    if ((formData.formats.includes('Paperback') || formData.formats.includes('Hardcover')) && !formData.pageCount) {
        setError("Please enter page count for print formats.");
        setIsLoading(false);
        return;
    }

    // Simulate API call or direct data processing
    // In a real app, this might be another API call to a backend that processes the form data against the full dataset
    try {
      const guidelines: GeneratedGuideline[] = [];
      const selectedPlatformsData = allPlatformData.filter(p => formData.platforms.includes(p["Platform Name"]));

      selectedPlatformsData.forEach(platform => {
        const guideline: GeneratedGuideline = { platformName: platform["Platform Name"] };
        
        if (formData.formats.includes('eBook')) {
          guideline.ebookManuscriptFormat = platform["eBook - Manuscript Format (EPUB, MOBI, DOCX etc.)"] || 'Not specified';
          guideline.ebookCoverDimensions = platform["eBook - Cover Image Dimensions (pixels)"] || 'Not specified';
          guideline.ebookCoverResolution = platform["eBook - Cover Image Resolution (DPI)"] || 'Not specified';
        }

        if (formData.formats.includes('Paperback') || formData.formats.includes('Hardcover')) {
            const formatPrefix = formData.formats.includes('Paperback') ? 'Paperback' : 'Hardcover';
            guideline.printTrimSize = platform[`${formatPrefix} - Trim Size Options (inches)`] || 'Not specified';
            // Basic spine width placeholder - actual calculation is complex
            const pageCountNum = parseInt(formData.pageCount);
            if (pageCountNum > 0) {
                // Example: KDP white paper: (pages * 0.002252") KDP cream paper: (pages * 0.0025")
                // This is highly simplified and platform-dependent.
                const paperFactor = formData.paperType === 'cream' ? 0.0025 : 0.002252;
                guideline.printSpineWidth = (pageCountNum * paperFactor).toFixed(3) + ' inches (approx, varies by platform/paper)';
            } else {
                guideline.printSpineWidth = 'Page count needed';
            }
            guideline.printCoverDimensions = platform[`${formatPrefix} - Cover File Format (PDF, JPG, etc.)`] || 'Not specified'; // This is format, not dimensions
            guideline.printInteriorFormat = platform[`${formatPrefix} - Interior File Format (PDF preferred)`] || 'Not specified';
            guideline.printMargins = platform[`${formatPrefix} - Margins (Inside, Outside, Top, Bottom - inches)`] || 'Not specified';
            guideline.printBleed = platform[`${formatPrefix} - Bleed (inches or mm)`] || 'Not specified';
        }

        guideline.notes = platform["Important Notes/Differences"] || 'None';
        guidelines.push(guideline);
      });

      setGeneratedGuidelines(guidelines);
    } catch (e) {
      console.error("Error generating guidelines:", e);
      setError("An error occurred while generating guidelines. Please check your input.");
    }

    setIsLoading(false);
  };

  const bookTypes = [
    "Fiction", "Non-Fiction", "Children's Book", "Cookbook", "Poetry", "Academic", "Other"
  ];
  const allFormats = ["eBook", "Paperback", "Hardcover"];
  const bookSizes = [
    "5 x 8 inches (12.7 x 20.32 cm)", "5.5 x 8.5 inches (13.97 x 21.59 cm)", 
    "6 x 9 inches (15.24 x 22.86 cm)", "8.5 x 11 inches (21.59 x 27.94 cm)", "Custom"
  ];
  const paperTypes = ["Cream", "White"];
  const coverFinishes = ["Glossy", "Matte"];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Book Publishing Guideline Generator</CardTitle>
        <CardDescription className="text-center">
          Fill in your book details to get tailored publishing specifications across various platforms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Form Sections */}
          <section>
            <h3 class="text-xl font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bookTitle">Book Title (Optional)</Label>
                <Input id="bookTitle" placeholder="e.g., The Great Novel" value={formData.bookTitle} onChange={e => handleInputChange('bookTitle', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorName">Author Name (Optional)</Label>
                <Input id="authorName" placeholder="e.g., Jane Doe" value={formData.authorName} onChange={e => handleInputChange('authorName', e.target.value)} />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <Label htmlFor="bookType">Book Type</Label>
              <Select value={formData.bookType} onValueChange={value => handleInputChange('bookType', value)}>
                <SelectTrigger id="bookType"><SelectValue placeholder="Select book type" /></SelectTrigger>
                <SelectContent>
                  {bookTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </section>

          <Separator />

          <section>
            <h3 class="text-xl font-semibold mb-4">Format & Print Details</h3>
            <div className="space-y-2 mb-6">
              <Label>Format(s) Required*</Label>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {allFormats.map(format => (
                  <div key={format} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`format-${format}`}
                      checked={formData.formats.includes(format)}
                      onCheckedChange={checked => handleCheckboxChange('formats', format, !!checked)}
                    />
                    <Label htmlFor={`format-${format}`}>{format}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            {(formData.formats.includes('Paperback') || formData.formats.includes('Hardcover')) && (
              <div className="space-y-6 p-4 border rounded-md bg-slate-50 dark:bg-slate-800">
                <p className="text-md font-medium text-slate-700 dark:text-slate-300">Print Specific Options:</p>
                <div className="space-y-2">
                  <Label htmlFor="bookSize">Book Size (for Print)</Label>
                  <Select value={formData.bookSize} onValueChange={value => handleInputChange('bookSize', value)}>
                    <SelectTrigger id="bookSize"><SelectValue placeholder="Select print book size" /></SelectTrigger>
                    <SelectContent>
                      {bookSizes.map(size => <SelectItem key={size} value={size}>{size}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pageCount">Page Count (for Print)*</Label>
                    <Input id="pageCount" type="number" placeholder="e.g., 250" value={formData.pageCount} onChange={e => handleInputChange('pageCount', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paperType">Paper Type (for Print)</Label>
                    <Select value={formData.paperType} onValueChange={value => handleInputChange('paperType', value)}>
                      <SelectTrigger id="paperType"><SelectValue placeholder="Select paper type" /></SelectTrigger>
                      <SelectContent>
                        {paperTypes.map(type => <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Bleed Requirements (for Print)</Label>
                    <RadioGroup value={formData.bleed} onValueChange={value => handleInputChange('bleed', value)} className="flex space-x-4 pt-2">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="bleed-yes" /><Label htmlFor="bleed-yes">Yes</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="bleed-no" /><Label htmlFor="bleed-no">No</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="unsure" id="bleed-unsure" /><Label htmlFor="bleed-unsure">Unsure</Label></div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coverFinish">Cover Finish (for Print)</Label>
                    <Select value={formData.coverFinish} onValueChange={value => handleInputChange('coverFinish', value)}>
                      <SelectTrigger id="coverFinish"><SelectValue placeholder="Select cover finish" /></SelectTrigger>
                      <SelectContent>
                        {coverFinishes.map(finish => <SelectItem key={finish} value={finish.toLowerCase()}>{finish}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </section>

          <Separator />

          <section>
            <h3 class="text-xl font-semibold mb-4">Target Publishing Platforms*</h3>
            {availablePlatforms.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 max-h-72 overflow-y-auto p-4 border rounded-md">
                {availablePlatforms.map(platform => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`platform-${platform}`}
                      checked={formData.platforms.includes(platform)}
                      onCheckedChange={checked => handleCheckboxChange('platforms', platform, !!checked)}
                    />
                    <Label htmlFor={`platform-${platform}`}>{platform}</Label>
                  </div>
                ))}
              </div>
            ) : (
              <p>Loading platforms...</p>
            )}
          </section>
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <CardFooter className="px-0 pt-8">
            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate My Guidelines'}
            </Button>
          </CardFooter>
        </form>

        {generatedGuidelines && generatedGuidelines.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Custom Publishing Guidelines</h2>
            {generatedGuidelines.map((guideline, index) => (
              <Card key={index} className="mb-6">
                <CardHeader>
                  <CardTitle>{guideline.platformName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.formats.includes('eBook') && (
                    <div>
                      <h4 className="font-semibold text-md mb-1">eBook Specifications:</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 pl-2">
                        {guideline.ebookManuscriptFormat && <li><strong>Manuscript Format:</strong> {guideline.ebookManuscriptFormat}</li>}
                        {guideline.ebookCoverDimensions && <li><strong>Cover Dimensions:</strong> {guideline.ebookCoverDimensions}</li>}
                        {guideline.ebookCoverResolution && <li><strong>Cover Resolution:</strong> {guideline.ebookCoverResolution}</li>}
                      </ul>
                    </div>
                  )}
                  {(formData.formats.includes('Paperback') || formData.formats.includes('Hardcover')) && (
                    <div>
                      <h4 className="font-semibold text-md mb-1">Print Specifications ({formData.formats.filter(f => f !== 'eBook').join('/')}):</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 pl-2">
                        {guideline.printTrimSize && <li><strong>Trim Size:</strong> {guideline.printTrimSize}</li>}
                        {guideline.printSpineWidth && <li><strong>Approx. Spine Width:</strong> {guideline.printSpineWidth}</li>}
                        {guideline.printCoverDimensions && <li><strong>Cover File Format:</strong> {guideline.printCoverDimensions}</li>}
                        {guideline.printInteriorFormat && <li><strong>Interior File Format:</strong> {guideline.printInteriorFormat}</li>}
                        {guideline.printMargins && <li><strong>Margins:</strong> {guideline.printMargins}</li>}
                        {guideline.printBleed && <li><strong>Bleed:</strong> {guideline.printBleed}</li>}
                      </ul>
                    </div>
                  )}
                  {guideline.notes && guideline.notes !== 'None' && (
                     <div>
                        <h4 className="font-semibold text-md mb-1">Important Notes:</h4>
                        <p className="text-sm">{guideline.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </CardContent>
    </Card>
  );
}

