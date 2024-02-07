import React, { useState, useCallback, useMemo } from 'react'
import { createEditor } from "slate";
import { Slate, withReact, Editable } from "slate-react"
import YoutubeEmbed from '../../components/youtube-embed.js'
import SpotifyEmbed from '../../components/spotify-embed.js'
import '../scss/base/utils.scss'

export default function DocumentRenderer({ content }) {

  console.log("doc content: ",content)

  const [editor] = useState(() => withReact(createEditor()));
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  const Element = ({ attributes, children, element }) => {

    const style = { textAlign: element.align };

    switch (element.type) {
      case 'alignStart':
        return <div className={element.className} style={{ textAlign: 'start' }} {...attributes}>{children}</div>;

      case 'alignCenter':
        return <div className={element.className} style={{ textAlign: 'center' }} {...attributes}>{children}</div>;

      case 'alignEnd':
        return <div className={element.className} style={{ textAlign: 'end' }} {...attributes}>{children}</div>;

      case 'blockQuote':
        return <blockquote className={element.className} style={style} {...attributes}>{children}</blockquote>;

      case 'headingOne':
        return <h1 className={element.className} style={style} {...attributes}>{children}</h1>;

      case 'headingTwo':
        return <h2 className={element.className} style={style} {...attributes}>{children}</h2>;

      case 'headingThree':
        return <h3 className={element.className} style={style} {...attributes}>{children}</h3>;

      case 'headingFour':
        return <h4 className={element.className} style={style} {...attributes}>{children}</h4>;

      case 'headingFive':
        return <h5 className={element.className} style={style} {...attributes}>{children}</h5>;

      case 'headingSix':
        return <h6 className={element.className} style={style} {...attributes}>{children}</h6>;

      case 'listItem':
        return <li className={element.className} style={style} {...attributes}>{children}</li>;

      case 'numberedList':
        return <ol className={element.className} style={style} {...attributes}>{children}</ol>;

      case 'bulletedList':
        return <ul className={element.className} style={style} {...attributes}>{children}</ul>;

      case 'spotify-embed':
        return <SpotifyEmbed className={element.className} url={element.url} />;

      case 'youtube-embed':
        return <YoutubeEmbed className={element.className} url={element.url} />;

      case 'img':
        return <img className={element.className} style={style} alt={element.alt} src={element.src} {...attributes} />;

      default:
        return <p className={element.className} style={style} {...attributes}>{children}</p>;
    }
  };

  const Leaf = ({ attributes, children, leaf }) => {

    if (leaf.bold) {
      children = <strong>{children}</strong>
    }

    if (leaf.code) {
      children = <code>{children}</code>
    }

    if (leaf.italic) {
      children = <em>{children}</em>
    }

    if (leaf.underline) {
      children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
  }

  return (
    <div className="document-render">
      <Slate editor={editor} initialValue={content}>
        <Editable readOnly renderElement={renderElement} renderLeaf={renderLeaf} />
      </Slate>
    </div>
  );
}