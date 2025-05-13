# Spreadsheet Formula Design for Author Book Formatting Guidelines

This document outlines the design for a spreadsheet that allows authors to input basic information about their book and receive a structured report on formatting guidelines from various publishing houses. The spreadsheet will utilize data from the `publishing_platforms_comparison.csv` file.

## 1. Spreadsheet Structure

The spreadsheet will consist of three main sheets:

1.  **`InputSheet`**: Where the author provides details about their book and selects a publishing platform.
2.  **`DataSheet`**: Contains the raw data imported from `publishing_platforms_comparison.csv`. This sheet can be hidden from the end-user.
3.  **`OutputReportSheet`**: Displays the tailored formatting guidelines based on the author’s selections on the `InputSheet`.

## 2. Data Source

*   The `DataSheet` will be populated by importing the `publishing_platforms_comparison.csv` file.
*   The first row of `DataSheet` will contain the headers from the CSV file.

## 3. `InputSheet` Design

This sheet will have the following input fields. Data validation (e.g., dropdown lists) should be used where appropriate.

| Cell | Label                                  | Input Type/Example                                                                      | Notes                                                                                                |
|------|----------------------------------------|-----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| B1   | Author Name:                           | Text                                                                                    |                                                                                                      |
| B2   | Book Title:                            | Text                                                                                    |                                                                                                      |
| B3   | Select Book Format:                    | Dropdown: "eBook", "Paperback", "Hardcover"                                             |                                                                                                      |
| B4   | Select Publishing Platform:            | Dropdown (populated from `DataSheet` Column A: "Company Name")                          | User selects one platform for the report.                                                            |
| B5   | Desired Trim Size (for Print):         | Text (e.g., "6x9", "5.5x8.5")                                                         | Only relevant if B3 is "Paperback" or "Hardcover". Conditional visibility/enablement recommended.    |
| B6   | Estimated Page Count (for Print):      | Number                                                                                  | Only relevant if B3 is "Paperback" or "Hardcover".                                                   |
| B7   | Interior Color (for Print):            | Dropdown: "Black & White", "Standard Color", "Premium Color"                          | Only relevant if B3 is "Paperback" or "Hardcover".                                                   |
| B8   | Paper Type (for Print):                | Dropdown: "Cream", "White"                                                              | Only relevant if B3 is "Paperback" or "Hardcover".                                                   |
| B9   | Cover Finish (for Print):              | Dropdown: "Glossy", "Matte"                                                             | Only relevant if B3 is "Paperback" or "Hardcover".                                                   |

## 4. `OutputReportSheet` Design

This sheet will dynamically generate a report based on selections in `InputSheet`. It will be structured as follows:

**Section 1: Book & Platform Details (Pulled from `InputSheet`)**
*   Author Name: `=InputSheet!B1`
*   Book Title: `=InputSheet!B2`
*   Selected Publishing Platform: `=InputSheet!B4`
*   Selected Book Format: `=InputSheet!B3`

**Section 2: Platform Overview (Pulled from `DataSheet` for the selected platform)**
*   **Formula Concept for fetching data:** `INDEX(DataSheet!A:AP, MATCH(InputSheet!B4, DataSheet!A:A, 0), MATCH(
