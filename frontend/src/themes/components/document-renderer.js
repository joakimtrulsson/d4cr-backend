import React, { useState, useCallback, useMemo } from 'react'
import { createEditor } from "slate";
import { Slate, withReact, Editable } from "slate-react"
import YoutubeEmbed from '../components/youtube-embed.js'
import SpotifyEmbed from '../components/spotify-embed.js'


export default function DocumentRenderer({ initialValue }) {

  const [editor] = useState(() => withReact(createEditor()));
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  const Element = ({ attributes, children, element }) => {

    const style = { textAlign: element.align }

    switch (element.type) {

      case 'block-quote':
        return (<blockquote style={style} {...attributes}>{children}</blockquote>)

      case 'heading-one':
        return (<h1 style={style} {...attributes}>{children}</h1>)

      case 'heading-two':
        return (<h2 style={style} {...attributes}>{children}</h2>)

      case 'heading-three':
        return (<h3 style={style} {...attributes}>{children}</h3>)

      case 'heading-four':
        return (<h4 style={style} {...attributes}>{children}</h4>)

      case 'heading-five':
        return (<h5 style={style} {...attributes}>{children}</h5>)

      case 'heading-six':
        return (<h6 style={style} {...attributes}>{children}</h6>)

      case 'list-item':
        return (<li style={style} {...attributes}>{children}</li>)

      case 'numbered-list':
        return (<ol style={style} {...attributes}>{children}</ol>)

      case 'bulleted-list':
        return (<ul style={style} {...attributes}>{children}</ul>)

      case 'spotify-embed':
        return (<SpotifyEmbed embedId={children} />)

      case 'youtube-embed':
        return (<YoutubeEmbed embedId={children} />)

      case 'img':
        return (<img style={style} alt={element.alt} src={element.src} {...attributes} />);

      default:
        return (<p style={style} {...attributes}>{children}</p>)
    }
  }

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
    <div className="App">
      <Slate editor={editor} initialValue={initialValue} renderLeaf={renderLeaf}>
        <Editable readOnly renderElement={renderElement} />
      </Slate>
    </div>
  );
}