declare module '@ckeditor/ckeditor5-react' {
  import * as React from 'react'
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
  import Event from '@ckeditor/ckeditor5-utils/src/eventinfo'
  import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig'

  const CKEditor: React.FunctionComponent<{
    disabled?: boolean
    editor: typeof ClassicEditor
    data?: string
    id?: string
    config?: EditorConfig
    onReady?: (editor: ClassicEditor) => void
    onChange?: (event: Event, editor: ClassicEditor) => void
    onBlur?: (event: Event, editor: ClassicEditor) => void
    onFocus?: (event: Event, editor: ClassicEditor) => void
    onError?: (event: Event, editor: ClassicEditor) => void
    className?: string
    [key: string]: any
  }>
  export { CKEditor }
}

declare module 'ckeditor5-custom-build/ckeditor' {
  import ClassicEditor from 'ckeditor5-custom-build/ckeditor'

  export default ClassicEditor
}
