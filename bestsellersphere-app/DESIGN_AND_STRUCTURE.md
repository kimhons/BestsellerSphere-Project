# Interactive Guideline Tool: Design Specifications

## 1. Purpose

The Interactive Guideline Tool on BestsellerSphere.com will allow authors to input basic information about their book and receive a structured report detailing the formatting guidelines for various publishing platforms. This aims to simplify the process of preparing a book for publication across multiple channels.

## 2. User Inputs

The tool will require the following inputs from the user via a web form:

*   **Book Type:** Dropdown (e.g., Ebook, Paperback, Hardcover)
*   **Trim Size (for print books):** Dropdown or text input (e.g., 6"x9", 5.5"x8.5"). This will likely need to be dynamic based on common sizes or allow custom input. The CSV data will determine available options.
*   **Interior Type (for print books):** Dropdown (e.g., Black & White, Standard Color, Premium Color). The CSV data will determine available options.
*   **Paper Type (for print books):** Dropdown (e.g., Cream, White). The CSV data will determine available options.
*   **Page Count (approximate):** Number input. This might influence spine width calculations for print covers.
*   **Cover Type (for print books):** Dropdown (e.g., Paperback Glossy, Paperback Matte, Hardcover Dust Jacket, Hardcover Case Laminate). The CSV data will determine available options.
*   **Optional: Specific Platforms:** Checkboxes or multi-select dropdown to allow users to select specific platforms they are interested in, or show all by default.

## 3. Data Source

The primary data source will be the `publishing_platforms_comparison.csv` file located at `/home/ubuntu/BestsellerSphere-Project_repo/bestsellersphere-app/src/lib/data/publishing_platforms_comparison.csv`.

This CSV contains columns such as:
*   `Platform Name`
*   `Book Type (Ebook, Paperback, Hardcover)`
*   `Trim Sizes Supported (Print)`
*   `Min/Max Page Count (Print)`
*   `Interior File Format (Ebook/Print)`
*   `Cover File Format (Ebook/Print)`
*   `Color Options (Interior/Cover)`
*   `Spine Calculation Formula/Tool (Print)`
*   `Resolution/DPI (Images/Cover)`
*   `Bleed Requirements (Print)`
*   `Margins/Gutter (Print)`
*   `Font Embedding Rules`
*   `Max File Size (Ebook/Print)`
*   *And other relevant fields from the existing CSV.*

## 4. Processing Logic

1.  **Data Loading:** The Next.js application will read and parse the `publishing_platforms_comparison.csv` file. This data might be loaded client-side for interactivity or pre-processed at build time if static generation is used for parts of the site.
2.  **Filtering:** Based on the user's input (Book Type, Trim Size, etc.), the application will filter the rows in the CSV to find matching guidelines.
    *   For "Ebook", it will filter for rows where `Book Type` is "Ebook".
    *   For "Paperback" or "Hardcover", it will filter by `Book Type` and then attempt to match `Trim Size`, `Interior Type`, etc.
    *   If specific platforms are selected, the results will be further filtered to include only those platforms.
3.  **Guideline Extraction:** For each matching platform, the tool will extract relevant guideline information from the corresponding columns.
4.  **Dynamic Calculations (Future Enhancement):** For print books, if spine calculation formulas are available and reliable, the tool could estimate spine width based on page count and paper type. This is a more advanced feature.

## 5. Output/Display

The results will be displayed on the same page below the input form. The display should be clear, organized, and easy to read.

*   **Format:** A series of cards or a structured table, with each card/section representing a publishing platform that matches the criteria.
*   **Content per Platform:**
    *   Platform Name
    *   **Book Formatting Guidelines:**
        *   Interior File Format(s)
        *   Recommended Resolution/DPI for Images
        *   Font Embedding Rules
        *   Max Interior File Size
        *   (For Print) Supported Trim Size (confirming user input or showing options)
        *   (For Print) Min/Max Page Count
        *   (For Print) Margins/Gutter recommendations
        *   (For Print) Bleed requirements
    *   **Cover Design Guidelines:**
        *   Cover File Format(s)
        *   Recommended Resolution/DPI for Cover
        *   Color Profile (e.g., CMYK, RGB)
        *   (For Print) Spine Text recommendations (if applicable)
        *   (For Print) Barcode placement (if specified)
        *   Max Cover File Size
*   **Clear Indication:** If no platforms match the exact criteria, a message should inform the user, perhaps suggesting broader criteria.
*   **Links to Full Specs:** Each platform's section could include a link to a more detailed page about that platform (to be developed in a later phase, potentially using the existing markdown research).

## 6. UI/UX Considerations

*   **Input Form:**
    *   Use clear labels for all input fields.
    *   Employ dropdowns with pre-filled common options (e.g., for trim sizes, book types) to minimize errors and guide the user. These options should ideally be dynamically populated from the unique values in the CSV where appropriate.
    *   Provide helpful tooltips or placeholder text for less obvious fields.
    *   The form should be responsive and easy to use on mobile devices.
*   **Results Display:**
    *   Visually separate information for each platform.
    *   Use consistent formatting for guidelines (e.g., bolding key terms, using bullet points for lists of requirements).
    *   Ensure the results section is also responsive.
    *   A "Clear Form" or "Start Over" button would be useful.
    *   Loading state: Indicate when the tool is processing the request.

## 7. Technical Considerations

*   **Framework:** Next.js (React)
*   **Components:**
    *   `GuidelineForm.tsx`: For user inputs.
    *   `GuidelineResults.tsx`: To display the filtered guidelines.
    *   Individual presentational components for cards, tables, etc.
*   **State Management:** React state (e.g., `useState`, `useReducer`) will manage form inputs and results. For more complex state, Context API or a lightweight state management library could be considered if needed, but start simple.
*   **Data Fetching/Parsing:**
    *   The CSV data will be included in the project. A utility function will be needed to parse it (e.g., using a library like `papaparse` if client-side, or processed at build time/server-side).
    *   The parsing and filtering logic will be a core part of the tool's implementation.
*   **Styling:** Tailwind CSS (as per the project setup).
*   **No Backend/Database (initially):** The tool will operate client-side using the bundled CSV data. No database interactions are planned for this initial version of the tool.

## 8. Future Enhancements

*   Direct links to platform-specific setup pages.
*   User accounts to save book profiles.
*   More sophisticated spine width calculator.
*   Integration with cover template generators (if feasible).
*   Allowing users to upload their CSV (for advanced users or different datasets).

This design document will be saved as `DESIGN_AND_STRUCTURE.md` in the `bestsellersphere-app` directory for future reference.
