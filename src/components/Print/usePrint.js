/**
 * Print any DOM node (a component wrapper) in isolation.
 * Usage:
 *   const { print } = usePrint();
 *   print(ref.current);
 */
export function usePrint() {
  const print = (node) => {
    if (!node) return;
    const win = window.open('', '_blank', 'width=900,height=1200');
    if (!win) {
      alert('Please allow pop-ups to print the report sheet.');
      return;
    }
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');

    win.document.open();
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Report Sheet</title>
          ${styles}
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; background: #fff; }
            @media print {
              .no-print { display: none !important; }
              .report-sheet { page-break-after: always; }
              .report-sheet:last-child { page-break-after: auto; }
            }
          </style>
        </head>
        <body>${node.outerHTML}</body>
      </html>
    `);
    win.document.close();
    win.focus();

    // Wait for images (logo) to load before printing
    const imgs = win.document.images;
    let loaded = 0;
    const total = imgs.length;
    const go = () => {
      win.print();
      win.close();
    };
    if (!total) return setTimeout(go, 300);
    for (const img of imgs) {
      if (img.complete) {
        if (++loaded === total) setTimeout(go, 300);
      } else {
        img.onload = img.onerror = () => {
          if (++loaded === total) setTimeout(go, 300);
        };
      }
    }
  };
  return { print };
}