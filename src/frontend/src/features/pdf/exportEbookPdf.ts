import type { Story } from '../../backend';
import { getStoryAssets, getCoverAsset } from '../../content/storyAssets';

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

export async function exportEbookPdf(stories: Story[]): Promise<void> {
  try {
    // Create a hidden container for the PDF content
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 210mm;
      background: white;
      font-family: Arial, sans-serif;
      color: black;
    `;
    document.body.appendChild(container);

    // Cover page
    const coverSection = document.createElement('div');
    coverSection.style.cssText = `
      page-break-after: always;
      width: 100%;
      height: 297mm;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(to bottom, #fef3c7, #fed7aa);
    `;
    
    try {
      const coverImg = await loadImage(getCoverAsset());
      const coverImgEl = document.createElement('img');
      coverImgEl.src = coverImg.src;
      coverImgEl.style.cssText = 'max-width: 100%; max-height: 100%; object-fit: contain;';
      coverSection.appendChild(coverImgEl);
    } catch (err) {
      const coverTitle = document.createElement('h1');
      coverTitle.textContent = 'Little Light Bible Stories';
      coverTitle.style.cssText = 'font-size: 48px; color: #92400e; text-align: center;';
      coverSection.appendChild(coverTitle);
    }
    container.appendChild(coverSection);

    // Add each story
    for (let i = 0; i < stories.length; i++) {
      const story = stories[i];
      const storyNumber = Number(story.id) + 1;
      const assets = getStoryAssets(storyNumber);

      // Story page
      const storySection = document.createElement('div');
      storySection.style.cssText = `
        page-break-after: always;
        padding: 20mm;
        background: white;
      `;

      // Story header
      const header = document.createElement('div');
      header.style.cssText = 'margin-bottom: 20px; position: relative;';
      
      const badge = document.createElement('div');
      badge.textContent = storyNumber.toString();
      badge.style.cssText = `
        position: absolute;
        right: 0;
        top: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #fbbf24, #f97316);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
      `;
      header.appendChild(badge);

      const title = document.createElement('h2');
      title.textContent = story.title;
      title.style.cssText = `
        font-size: 24px;
        color: #92400e;
        margin: 0;
        padding-right: 50px;
        font-weight: bold;
      `;
      header.appendChild(title);
      storySection.appendChild(header);

      // Story illustration
      try {
        const illustrationImg = await loadImage(assets.illustration);
        const imgEl = document.createElement('img');
        imgEl.src = illustrationImg.src;
        imgEl.style.cssText = `
          width: 100%;
          height: auto;
          margin: 20px 0;
          border: 4px solid #fbbf24;
          border-radius: 8px;
        `;
        storySection.appendChild(imgEl);
      } catch (err) {
        console.warn(`Failed to load illustration for story ${storyNumber}`);
      }

      // Story text
      const textDiv = document.createElement('div');
      textDiv.textContent = story.content;
      textDiv.style.cssText = `
        font-size: 14px;
        line-height: 1.8;
        color: #000;
        margin: 20px 0;
        white-space: pre-wrap;
      `;
      storySection.appendChild(textDiv);

      container.appendChild(storySection);

      // Coloring page
      const coloringSection = document.createElement('div');
      coloringSection.style.cssText = `
        page-break-after: always;
        padding: 20mm;
        background: white;
      `;

      const coloringHeader = document.createElement('div');
      coloringHeader.style.cssText = `
        background: linear-gradient(to right, #fbbf24, #f97316);
        padding: 15px;
        margin: -20mm -20mm 20px -20mm;
        text-align: center;
      `;
      
      const coloringTitle = document.createElement('h2');
      coloringTitle.textContent = 'Color This Page!';
      coloringTitle.style.cssText = 'color: #92400e; margin: 0; font-size: 24px; font-weight: bold;';
      coloringHeader.appendChild(coloringTitle);
      coloringSection.appendChild(coloringHeader);

      try {
        const coloringImg = await loadImage(assets.coloring);
        const coloringImgEl = document.createElement('img');
        coloringImgEl.src = coloringImg.src;
        coloringImgEl.style.cssText = `
          width: 100%;
          height: auto;
          border: 4px solid #fbbf24;
          border-radius: 8px;
        `;
        coloringSection.appendChild(coloringImgEl);
      } catch (err) {
        console.warn(`Failed to load coloring page for story ${storyNumber}`);
      }

      container.appendChild(coloringSection);
    }

    // Trigger print dialog
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Please allow pop-ups to download the PDF');
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Little Light Bible Stories</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            @media print {
              .page-break {
                page-break-after: always;
              }
            }
          </style>
        </head>
        <body>
          ${container.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Wait a bit for images to load, then trigger print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      
      // Clean up after a delay
      setTimeout(() => {
        document.body.removeChild(container);
      }, 1000);
    }, 1000);

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF. Please check your browser settings and try again.');
  }
}
