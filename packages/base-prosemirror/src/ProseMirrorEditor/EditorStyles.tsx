import { FC } from 'react'
import { Global, css } from '@emotion/react'

const EditorStyles: FC = () => {
  return (
    <Global
      styles={css`
        .prosemirror-editor {
          position: relative;
          border: 1px solid #eee;
          padding: 1em;
          border-radius: 2px;

          * {
            margin: 0;
          }

          hr {
            margin: 1em 0;
            height: 1px;
            background-color: #999;
            border: none;
          }

          .ProseMirror {
            outline: none;
          }

          blockquote {
            padding: .5em 1em;
            border-left: 3px solid #eee;
          }

          code, kbd, samp, pre {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: 1em;
          }


          .text-underline {
            text-decoration: underline;
          }

          .text-code {
            padding: 0 2px;
            margin: 0 2px;
            background-color: #f5f5f5;
            border-radius: 2px;
          }

          img {
            max-width: 100%;
            height: auto;
          }

          notegroup {
            display: block;
            border: 1px solid black;
            padding: .5em;
          }

          note {
            display: block;
            border: 1px solid blue;
            padding: .5em;

            &:not(:last-child) {
              margin-bottom: .5em;
            }
          }

          pre {
            padding: 1em;
            background-color: #f5f5f5;
            border-radius: 4px;
          }

          p,
          h1,
          h2,
          h3,
          h4,
          pre,
          ol,
          ul,
          blockquote {
            line-height: 1.5;

            &:not(:last-child) {
              margin-bottom: 1em;
            }
          }

          .img-wrapper {
            text-align: center;
          }
        }
      `}
    />
  )
}

export default EditorStyles
