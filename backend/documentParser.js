/**
 * Lightweight, zero-native-dependency document parser for TXT, DOCX, and text streams,
 * with optional pdf-parse and mammoth fallbacks.
 */
let pdfParse = null;
try {
  pdfParse = require('pdf-parse');
} catch (e) {
  // Graceful pure-JS fallback
}

let mammoth = null;
try {
  mammoth = require('mammoth');
} catch (e) {
  // Graceful pure-JS fallback
}

/**
 * Extracts plain text from buffer depending on mimetype and extension
 */
async function extractTextFromBuffer(buffer, originalname, mimetype) {
  const ext = (originalname.split('.').pop() || '').toLowerCase();

  try {
    if (ext === 'pdf' || mimetype === 'application/pdf') {
      if (pdfParse) {
        const data = await pdfParse(buffer);
        return data.text ? data.text.trim() : '';
      } else {
        // Fallback: extract ASCII printable strings from PDF stream
        const rawStr = buffer.toString('binary');
        const matches = rawStr.match(/[A-Za-z0-9\s.,;:'"()\-–—\/]{4,}/g);
        return matches ? matches.join(' ').trim() : 'Document uploaded (preview unavailable without pdf-parse).';
      }
    } else if (ext === 'docx' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      if (mammoth) {
        const result = await mammoth.extractRawText({ buffer });
        return result.value ? result.value.trim() : '';
      } else {
        return buffer.toString('utf-8').replace(/[^\x20-\x7E\t\n\r]/g, ' ').trim();
      }
    } else {
      // Direct text / markdown / plaintext
      return buffer.toString('utf-8').trim();
    }
  } catch (error) {
    console.error(`Document parsing error for ${originalname}:`, error);
    // Graceful fallback to utf8 string
    return buffer.toString('utf-8').trim();
  }
}

module.exports = {
  extractTextFromBuffer
};
