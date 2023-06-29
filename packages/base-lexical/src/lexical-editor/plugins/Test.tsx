import { useEffect } from 'react'
import { $generateNodesFromDOM } from '@lexical/html';
import { $insertNodes } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

const html = `
  <p>1111111</p>
  <ul>
    <li><p>11111</p></li>
    <li><p>11111</p></li>
  </ul>

  <ol>
    <li><p>11111</p></li>
    <li><p>11111</p></li>
  </ol>
  <p>222222</p>
`

export default () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.update(() => {
      const parser = new DOMParser()
      const nodes = $generateNodesFromDOM(editor, parser.parseFromString(html, 'text/html'))
      $insertNodes(nodes)
    })
  }, [editor])

  return null
}
