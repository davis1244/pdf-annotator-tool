# PDF Annotation Tool

A lightweight web application for annotating PDFs with highlights and comments.

## Features

- **Highlight Text**: Mark important text directly on the PDF.
- **Add Comments**: Attach comments to specific areas on the PDF.
- **Save Annotations**: Save all annotations for future reference (server-side saving functionality is pending implementation).

## Technologies Used

- **Frontend:**
  - **HTML5**: For structuring the web application.
  - **CSS3**: For styling and layout.
  - **JavaScript**: For interactive elements and core functionality.

- **Libraries:**
  - **PDF.js**: For rendering and interacting with PDF files. You'll need the latest version from [cdnjs](https://cdnjs.com/libraries/pdf.js).

- **Development Tools:**
  - **npm**: For package management, though not strictly needed for this project, it's good practice for managing dependencies.

## Setup

To get started with the PDF Annotation Tool, follow these steps:

### Clone the Repository

```bash
git clone [your-github-repo-url]
cd pdf-annotation-tool
```
## Install Dependencies

You'll need to ensure you have the latest version of `pdf.js` loaded from CDN or installed locally. For local installation:

```bash
npm install pdfjs-dist
```
However, for this project, we're using the CDN version, so no npm installation is strictly necessary.

## Running the Application

Since this is a basic HTML/JS project, you can run it directly from your web browser:

1. **Open `index.html` in any modern browser.**

## Server-Side Functionality (Optional)

The current implementation includes a `save` endpoint for annotations. To actually save these, you'll need:

- A server (e.g., Node.js with Express).
- A database or file system to store the annotations.

**Note:** The server-side saving functionality is not implemented yet. This README assumes basic knowledge of setting up a simple backend server.

## How to Use

1. **Upload PDF**: Use the file input to select a PDF.
2. **Highlight Text**: Click the "Highlight" button and then click on the PDF to mark text.
3. **Add Comments**: Use the "Add Comment" button, click on the PDF, enter your comment in the modal, and save.
4. **Save Annotations**: Currently, clicking the "Save Annotations" button simulates saving. Implement server-side functionality to actually save.

## Development

- **Editing**: Modify `script.js` for JavaScript functionality, `styles.css` for visuals, and `index.html` for structure.
- **Testing**: Use browsers like Chrome or Firefox for testing. Check for cross-browser compatibility if necessary.

## Future Enhancements

- Implement real server-side saving of annotations.
- Add user authentication for saving annotations.
- Implement drag functionality for highlights and comments.
- Enhance UI/UX for better user interaction.
