import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse'; // Using papaparse for robust CSV parsing

interface PlatformData {
  [key: string]: string;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'data', 'publishing_platforms_comparison.csv');
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // Parse CSV data using papaparse
    const parseResult = Papa.parse<PlatformData>(fileContents, {
      header: true, // Uses the first row as headers
      skipEmptyLines: true,
      transformHeader: header => header.trim(), // Trim header names
      transform: value => value.trim(), // Trim all values
    });

    if (parseResult.errors.length > 0) {
      console.error('CSV Parsing errors:', parseResult.errors);
      throw new Error('Failed to parse CSV data due to parsing errors.');
    }

    const platformData = parseResult.data;

    return NextResponse.json({ platformData });

  } catch (error) {
    console.error('Failed to read or parse CSV file:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error fetching platform data', error: errorMessage }, { status: 500 });
  }
}

