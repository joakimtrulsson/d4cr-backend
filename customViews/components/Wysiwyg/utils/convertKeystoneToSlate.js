export const convertKeystoneToSlate = (data) => {
  return data.map((element) => {
    const originalElement = Object.assign({}, element);

    switch (originalElement.type) {
      case 'heading':
        if (originalElement.level === 2) {
          originalElement.type = 'headingTwo';
        }
        if (originalElement.level === 3) {
          originalElement.type = 'headingThree';
        }
        if (originalElement.level === 4) {
          originalElement.type = 'headingFour';
        }
        // originalElement.type = `heading${originalElement.level}`;
        delete originalElement.level;
        break;
      case 'ordered-list':
        originalElement.type = 'orderedList';
        break;
      case 'unordered-list':
        originalElement.type = 'unorderedList';
        break;
      case 'paragraph':
        if (
          originalElement.textAlign === 'center' ||
          originalElement.textAlign === 'end'
        ) {
          originalElement.type = `align${
            originalElement.textAlign === 'center' ? 'Center' : 'Right'
          }`;
          originalElement.children = [
            { type: 'paragraph', children: originalElement.children },
          ];
        }
        break;
      case 'layout':
        originalElement.type = 'table';
        originalElement.columns = originalElement.layout.length;
        originalElement.rows = 1;
        originalElement.children = [
          {
            type: 'table-row',
            children: originalElement.children.map((area) => ({
              type: 'table-cell',
              children: area.children,
            })),
          },
        ];
        break;
      default:
        break;
    }

    return originalElement;
  });
};
