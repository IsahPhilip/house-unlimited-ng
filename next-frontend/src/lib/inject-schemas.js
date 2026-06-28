const fs = require('fs');

module.exports = {
  injectAfterLine(filePath, afterText, insertText) {
    let content = fs.readFileSync(filePath, 'utf8');
    const index = content.indexOf(afterText);
    if (index === -1) throw new Error('Marker not found: ' + afterText);
    const insertIndex = index + afterText.length;
    content = content.slice(0, insertIndex) + insertText + content.slice(insertIndex);
    fs.writeFileSync(filePath, content, 'utf8');
  },

  replaceText(filePath, oldText, newText) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes(oldText)) throw new Error('OldText not found');
    content = content.replace(oldText, newText);
    fs.writeFileSync(filePath, content, 'utf8');
  },
};
