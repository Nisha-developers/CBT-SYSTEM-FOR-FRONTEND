import { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, ImagePlus, Undo2, Redo2,
  Heading2, Heading3, Quote, Minus,
} from 'lucide-react';

export default function TheoryQuestionEditor({
  value = '',
  onChange,
  onImageUpload,
  disabled = false,
  compact = false,          // <-- NEW: for options / passage
  placeholder = '',
}) {
  const fileInputRef = useRef(null);
  const savedSelection = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'inline-block max-w-full h-auto rounded-md align-middle my-1',
        },
      }),
    ],
    shouldRerenderOnTransaction: true,
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          (compact ? 'min-h-[56px]' : 'min-h-[140px]') +
          ' px-3 py-3 outline-none text-sm text-gray-800 max-w-none ' +
          '[&_p]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-2 ' +
          '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-2 ' +
          '[&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 ' +
          '[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic ' +
          '[&_hr]:my-3',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  if (!editor) return null;

  const Btn = ({ active, onClick, label, Icon, disabled: d }) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled || d}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 disabled:opacity-40 ${
        active ? 'bg-gray-200 text-blue-700' : 'text-gray-600'
      }`}
    >
      <Icon size={17} />
    </button>
  );

  const chooseImage = () => {
    if (!onImageUpload) return;
    savedSelection.current = {
      from: editor.state.selection.from,
      to: editor.state.selection.to,
    };
    fileInputRef.current?.click();
  };

  const handleImageSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      window.alert('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.alert('Image must not exceed 5 MB.');
      return;
    }

    try {
      const imageUrl = await onImageUpload(file);
      if (!imageUrl) throw new Error('Image upload did not return an image URL.');

      const { from, to } = savedSelection.current || {
        from: editor.state.selection.from,
        to: editor.state.selection.to,
      };
      const max = editor.state.doc.content.size;
      editor
        .chain()
        .focus()
        .setTextSelection({ from: Math.min(from, max), to: Math.min(to, max) })
        .setImage({ src: imageUrl })
        .run();
    } catch (error) {
      window.alert(error.message || 'Could not upload the image.');
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 p-1.5 border-b bg-gray-50">
        <Btn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold" Icon={Bold} />
        <Btn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic" Icon={Italic} />
        <Btn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} label="Underline" Icon={UnderlineIcon} />
        <Btn active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} label="Strikethrough" Icon={Strikethrough} />

        {!compact && (
          <>
            <span className="w-px h-6 bg-gray-300 mx-1" />
            <Btn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="Heading 2" Icon={Heading2} />
            <Btn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="Heading 3" Icon={Heading3} />
            <Btn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} label="Blockquote" Icon={Quote} />
          </>
        )}

        <span className="w-px h-6 bg-gray-300 mx-1" />
        <Btn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} label="Bullet list" Icon={List} />
        <Btn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Numbered list" Icon={ListOrdered} />
        {!compact && (
          <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} label="Horizontal rule" Icon={Minus} />
        )}

        <span className="w-px h-6 bg-gray-300 mx-1" />

        <Btn
          onClick={chooseImage}
          label={onImageUpload ? 'Insert image' : 'Image upload not configured'}
          Icon={ImagePlus}
          disabled={!onImageUpload}
        />
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageSelected} />

        <span className="w-px h-6 bg-gray-300 mx-1" />
        <Btn onClick={() => editor.chain().focus().undo().run()} label="Undo" Icon={Undo2} disabled={!editor.can().undo()} />
        <Btn onClick={() => editor.chain().focus().redo().run()} label="Redo" Icon={Redo2} disabled={!editor.can().redo()} />
      </div>

      <EditorContent editor={editor} />

      {!compact && (
        <div className="px-3 py-2 border-t bg-gray-50 text-xs text-gray-400">
          {placeholder || 'Format your text or insert an image anywhere in the text.'}
        </div>
      )}
    </div>
  );
}