// script.js

const fileInput = document.getElementById('file-input');
const pdfContainer = document.getElementById('pdf-container');
const highlightBtn = document.getElementById('highlight-btn');
const commentBtn = document.getElementById('comment-btn');
const saveBtn = document.getElementById('save-btn');

const commentModal = document.getElementById('comment-modal');
const closeButton = document.querySelector('.close-button');
const saveCommentBtn = document.getElementById('save-comment-btn');
const commentText = document.getElementById('comment-text');

let pdfDoc = null;
let currentPage = 1;
let annotations = [];
let isHighlightMode = false;
let isCommentMode = false;

// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

// Handle File Upload
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file && file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = function(ev) {
            const typedarray = new Uint8Array(ev.target.result);
            loadPDF(typedarray);
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert('Please upload a valid PDF file.');
    }
});

// Load PDF
function loadPDF(data) {
    pdfjsLib.getDocument({data: data}).promise.then(doc => {
        pdfDoc = doc;
        pdfContainer.innerHTML = '';
        for(let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            pdfDoc.getPage(pageNum).then(page => {
                const canvas = document.createElement('canvas');
                canvas.id = `page-${pageNum}`;
                pdfContainer.appendChild(canvas);
                const context = canvas.getContext('2d');
                const viewport = page.getViewport({scale: 1.5});
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise.then(() => {
                    // Render existing annotations for this page
                    renderAnnotations(pageNum);
                });
            });
        }
    });
}

// Toggle Highlight Mode
highlightBtn.addEventListener('click', () => {
    isHighlightMode = !isHighlightMode;
    isCommentMode = false;
    highlightBtn.classList.toggle('active', isHighlightMode);
    commentBtn.classList.remove('active');
});

// Toggle Comment Mode
commentBtn.addEventListener('click', () => {
    isCommentMode = !isCommentMode;
    isHighlightMode = false;
    commentBtn.classList.toggle('active', isCommentMode);
    highlightBtn.classList.remove('active');
});

// Handle Clicks for Annotations
pdfContainer.addEventListener('click', (e) => {
    if(isHighlightMode || isCommentMode) {
        const rect = pdfContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const pageNum = getPageNumAtPosition(y);
        if(pageNum) {
            if(isHighlightMode) {
                createHighlight(pageNum, x, y);
            } else if(isCommentMode) {
                openCommentModal(pageNum, x, y);
            }
        }
    }
});

// Create Highlight
function createHighlight(pageNum, x, y) {
    const highlight = document.createElement('div');
    highlight.classList.add('highlight');
    highlight.style.position = 'absolute';
    highlight.style.left = `${x}px`;
    highlight.style.top = `${y}px`;
    highlight.style.width = '100px';
    highlight.style.height = '20px';
    pdfContainer.appendChild(highlight);

    annotations.push({
        type: 'highlight',
        page: pageNum,
        x: x,
        y: y,
        width: 100,
        height: 20
    });
}

// Open Comment Modal
let currentComment = {};
function openCommentModal(pageNum, x, y) {
    commentModal.style.display = 'block';
    currentComment = { page: pageNum, x: x, y: y };
}

// Close Modal
closeButton.addEventListener('click', () => {
    commentModal.style.display = 'none';
});

// Save Comment
saveCommentBtn.addEventListener('click', () => {
    const text = commentText.value.trim();
    if(text) {
        const comment = document.createElement('div');
        comment.classList.add('comment');
        comment.style.left = `${currentComment.x}px`;
        comment.style.top = `${currentComment.y}px`;
        comment.textContent = '💬';
        comment.title = text;
        pdfContainer.appendChild(comment);

        annotations.push({
            type: 'comment',
            page: currentComment.page,
            x: currentComment.x,
            y: currentComment.y,
            text: text
        });

        commentText.value = '';
        commentModal.style.display = 'none';
    } else {
        alert('Please enter a comment.');
    }
});

// Get Page Number based on Y position
function getPageNumAtPosition(y) {
    const pages = pdfDoc.numPages;
    for(let pageNum = 1; pageNum <= pages; pageNum++) {
        const canvas = document.getElementById(`page-${pageNum}`);
        if(canvas) {
            const rect = canvas.getBoundingClientRect();
            if(y < rect.height * pageNum) {
                return pageNum;
            }
        }
    }
    return null;
}

// Save Annotations to Server
saveBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if(!file) {
        alert('Please upload a PDF file first.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('annotations', JSON.stringify(annotations));

    fetch('/save', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
        .then(data => {
            if(data.success) {
                alert('Annotations saved successfully!');
            } else {
                alert('Failed to save annotations.');
            }
        }).catch(err => {
        console.error(err);
        alert('Error saving annotations.');
    });
});

// Render Annotations
function renderAnnotations(pageNum) {
    annotations.forEach(ann => {
        if(ann.page === pageNum) {
            if(ann.type === 'highlight') {
                const highlight = document.createElement('div');
                highlight.classList.add('highlight');
                highlight.style.left = `${ann.x}px`;
                highlight.style.top = `${ann.y}px`;
                highlight.style.width = `${ann.width}px`;
                highlight.style.height = `${ann.height}px`;
                pdfContainer.appendChild(highlight);
            } else if(ann.type === 'comment') {
                const comment = document.createElement('div');
                comment.classList.add('comment');
                comment.style.left = `${ann.x}px`;
                comment.style.top = `${ann.y}px`;
                comment.textContent = '💬';
                comment.title = ann.text;
                pdfContainer.appendChild(comment);
            }
        }
    });
}

// Close Modal when clicking outside
window.addEventListener('click', (e) => {
    if(e.target === commentModal) {
        commentModal.style.display = 'none';
    }
});
