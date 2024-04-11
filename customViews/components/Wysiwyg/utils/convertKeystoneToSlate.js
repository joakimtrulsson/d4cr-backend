/* eslint-disable no-case-declarations */
const numberToWord = (num) => {
  switch (num) {
    case 2:
      return 'Two';
    case 3:
      return 'Three';
    case 4:
      return 'Four';
    // Add more cases if there are more numbers
    default:
      return '';
  }
};

export const convertKeystoneToSlate = (data) => {
  return data.map((element) => {
    let originalElement = { ...element };
    // let originalElement = Object.assign({}, element);

    switch (originalElement.type) {
      // case 'heading':
      //   if (originalElement.level === 2) {
      //     originalElement.type = 'headingTwo';
      //   }
      //   if (originalElement.level === 3) {
      //     originalElement.type = 'headingThree';
      //   }
      //   if (originalElement.level === 4) {
      //     originalElement.type = 'headingFour';
      //   }
      //   // originalElement.type = `heading${originalElement.level}`;
      //   delete originalElement.level;
      //   break;
      case 'heading':
        const textAlign = originalElement.textAlign;
        delete originalElement.textAlign;
        originalElement.type = `heading${numberToWord(originalElement.level)}`;
        delete originalElement.level;
        originalElement = {
          type: `align${textAlign === 'center' ? 'Center' : 'Right'}`,
          children: [originalElement],
        };
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

      case 'component-block':
        switch (originalElement.component) {
          case 'spotifyPlayer': {
            originalElement.type = 'spotify';
            originalElement.url = originalElement.props.url;
            originalElement.children = [
              {
                text: originalElement.props.url,
              },
            ];
            delete originalElement.component;
            delete originalElement.props;
            break;
          }
          case 'youtubePlayer': {
            originalElement.type = 'video';
            originalElement.url = originalElement.props.url;
            originalElement.children = [
              {
                text: originalElement.props.url,
              },
            ];
            delete originalElement.component;
            delete originalElement.props;
            break;
          }
          default:
            break;
        }
        break;
      default:
        break;
    }

    return originalElement;
  });
};
