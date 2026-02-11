import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getBlogPostById, createBlogPost, updateBlogPost, uploadFile } from '../services/api';
import { BlogPost } from '../types/admin';
import { Loader2, Save, ArrowLeft, Eye, Edit3, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image as ImageIcon, Undo2, Redo2, Code, Table as TableIcon, Plus, Minus, Trash2 } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

interface BlogFormProps {
  isEditing?: boolean;
}

const categories = [
  'Real Estate',
  'Market Trends',
  'Home Buying',
  'Home Selling',
  'Investment',
  'Property Management',
  'Architecture',
  'Interior Design',
  'Finance',
  'Lifestyle'
];

export default function BlogForm({ isEditing = false }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'Real Estate',
    tags: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    readTime: 5,
    metaTitle: '',
    metaDescription: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [wordCount, setWordCount] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState<string>('');
  const [draftAvailable, setDraftAvailable] = useState(false);
  const [slugLocked, setSlugLocked] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const draftKey = `blog-draft-${id || 'new'}`;
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setImageUploading(true);
      setImageError('');
      const result = await uploadFile(file);
      if (result?.url) {
        editor?.chain().focus().setImage({ src: result.url }).run();
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      setImageError('Failed to upload image.');
    } finally {
      setImageUploading(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Image.configure({
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing your post...',
      }),
    ],
    content: formData.content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const readTime = calculateReadTime(text);
      setFormData(prev => ({
        ...prev,
        content: html,
        readTime,
      }));
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;
        const file = Array.from(files).find((f) => f.type.startsWith('image/'));
        if (!file) return false;
        event.preventDefault();
        handleImageUpload(file);
        return true;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        const imageItem = Array.from(items).find((item) => item.type.startsWith('image/'));
        if (!imageItem) return false;
        const file = imageItem.getAsFile();
        if (!file) return false;
        event.preventDefault();
        handleImageUpload(file);
        return true;
      },
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchBlogPost(id);
    }
  }, [isEditing, id]);

  useEffect(() => {
    const stored = localStorage.getItem(draftKey);
    if (stored) {
      setDraftAvailable(true);
    }
  }, [draftKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(draftKey, JSON.stringify(formData));
      const ts = new Date().toLocaleTimeString();
      setLastSavedAt(ts);
      setDraftAvailable(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [formData, draftKey]);

  const restoreDraft = () => {
    const stored = localStorage.getItem(draftKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setFormData((prev) => ({ ...prev, ...parsed }));
      setDraftAvailable(false);
    } catch {
      setDraftAvailable(false);
    }
  };

  const discardDraft = () => {
    localStorage.removeItem(draftKey);
    setDraftAvailable(false);
  };

  const fetchBlogPost = async (blogId: string) => {
    try {
      setIsLoading(true);
      const blogPost = await getBlogPostById(blogId);

      setFormData({
        title: blogPost.title,
        slug: blogPost.slug,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        featuredImage: blogPost.featuredImage || '',
        category: blogPost.category,
        tags: blogPost.tags.join(', '),
        status: blogPost.status,
        readTime: blogPost.readTime,
        metaTitle: blogPost.metaTitle || '',
        metaDescription: blogPost.metaDescription || ''
      });

      if (editor) {
        editor.commands.setContent(blogPost.content || '');
      }
    } catch (err: any) {
      if (err.message && err.message.includes('not found')) {
        setError('Blog post not found. Please check the URL or create a new post.');
        setTimeout(() => {
          navigate('/blog/create');
        }, 2000);
      } else {
        setError('Failed to fetch blog post. Please try again later.');
      }
      console.error('Error fetching blog post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'title' && !slugLocked) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({
        ...prev,
        slug,
        excerpt: prev.excerpt || value.substring(0, 150)
      }));
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      tags: e.target.value
    }));
  };

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.trim().length ? content.trim().split(/\s+/) : [];
    const count = words.length;
    setWordCount(count);
    return Math.max(1, Math.ceil(count / wordsPerMinute));
  };

  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (formData.content && formData.content !== currentHtml) {
      editor.commands.setContent(formData.content);
    }
  }, [formData.content, editor]);

  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, featuredImage: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contentText = editor?.getText().trim() || formData.content.trim();
    if (!formData.title || !contentText || !formData.excerpt) {
      setError('Please fill in all required fields');
      return;
    }

    const isPublishing = formData.status === 'published';
    if (isPublishing) {
      const excerptLength = formData.excerpt.trim().length;
      const hasImage = Boolean(formData.featuredImage);
      const hasSeo = Boolean(formData.metaTitle.trim() && formData.metaDescription.trim());
      const excerptOk = excerptLength >= 80 && excerptLength <= 300;

      if (!excerptOk || !hasImage || !hasSeo) {
        setError('Publishing requires a complete checklist (SEO, excerpt length, featured image).');
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    try {
      const textForReadTime = editor?.getText() || formData.content;
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        readTime: calculateReadTime(textForReadTime)
      };

      if (isEditing && id) {
        await updateBlogPost(id, blogData);
      } else {
        await createBlogPost(blogData);
      }

      localStorage.removeItem(draftKey);
      navigate('/blog');
    } catch (err) {
      setError(isEditing ? 'Failed to update blog post' : 'Failed to create blog post');
      console.error('Error saving blog post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => navigate('/blog')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Blog</span>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEditing
                    ? 'Update your blog post content and settings'
                    : 'Create a new blog post to share with your audience'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  formData.status === 'published' ? 'bg-green-100 text-green-800' :
                  formData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {formData.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {draftAvailable && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded flex items-center justify-between">
                <span>A saved draft is available.</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={restoreDraft} className="text-sm font-medium text-amber-700 hover:underline">Restore</button>
                  <button type="button" onClick={discardDraft} className="text-sm text-amber-600 hover:underline">Discard</button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input text-xl"
                placeholder="Enter blog post title"
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="auto-generated-from-title"
                />
                <button
                  type="button"
                  className={`px-3 py-2 text-xs rounded border ${slugLocked ? 'border-teal-500 text-teal-600' : 'border-gray-200 text-gray-600'}`}
                  onClick={() => setSlugLocked(!slugLocked)}
                >
                  {slugLocked ? 'Unlock' : 'Lock'}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                This will be used in the URL. Leave empty to auto-generate from title.
              </p>
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="form-input resize-none"
                placeholder="Write a brief summary of your blog post..."
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                This appears in search results and social media previews.
              </p>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setEditorTab('write')}
                  className={`px-3 py-1 text-xs rounded ${editorTab === 'write' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <Edit3 className="h-3 w-3 inline mr-1" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('preview')}
                  className={`px-3 py-1 text-xs rounded ${editorTab === 'preview' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <Eye className="h-3 w-3 inline mr-1" />
                  Preview
                </button>
                <span className="text-xs text-gray-400 ml-auto">
                  {wordCount} words • {formData.readTime} min read {lastSavedAt ? `• Autosaved ${lastSavedAt}` : ''}
                </span>
              </div>
              {editorTab === 'write' ? (
                <div className="border border-gray-200 rounded-lg">
                  <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 px-3 py-2 bg-gray-50">
                    <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`editor-btn ${editor?.isActive('bold') ? 'active' : ''}`}><Bold className="h-4 w-4" /></button>
                    <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`editor-btn ${editor?.isActive('italic') ? 'active' : ''}`}><Italic className="h-4 w-4" /></button>
                    <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`editor-btn ${editor?.isActive('underline') ? 'active' : ''}`}><Underline className="h-4 w-4" /></button>
                    <button type="button" onClick={() => editor?.chain().focus().toggleStrike().run()} className={`editor-btn ${editor?.isActive('strike') ? 'active' : ''}`}><Strikethrough className="h-4 w-4" /></button>
                    <span className="h-5 w-px bg-gray-200 mx-1" />
                    <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className={`editor-btn ${editor?.isActive('heading', { level: 1 }) ? 'active' : ''}`}><Heading1 className="h-4 w-4" /></button>
                    <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`editor-btn ${editor?.isActive('heading', { level: 2 }) ? 'active' : ''}`}><Heading2 className="h-4 w-4" /></button>
                    <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={`editor-btn ${editor?.isActive('heading', { level: 3 }) ? 'active' : ''}`}><Heading3 className="h-4 w-4" /></button>
                    <span className="h-5 w-px bg-gray-200 mx-1" />
                    <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`editor-btn ${editor?.isActive('bulletList') ? 'active' : ''}`}><List className="h-4 w-4" /></button>
                    <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`editor-btn ${editor?.isActive('orderedList') ? 'active' : ''}`}><ListOrdered className="h-4 w-4" /></button>
                    <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={`editor-btn ${editor?.isActive('blockquote') ? 'active' : ''}`}><Quote className="h-4 w-4" /></button>
                    <button type="button" onClick={() => editor?.chain().focus().toggleCodeBlock().run()} className={`editor-btn ${editor?.isActive('codeBlock') ? 'active' : ''}`}><Code className="h-4 w-4" /></button>
                    <span className="h-5 w-px bg-gray-200 mx-1" />
                    <button type="button" onClick={() => editor?.chain().focus().setTextAlign('left').run()} className={`editor-btn ${editor?.isActive({ textAlign: 'left' }) ? 'active' : ''}`}><AlignLeft className="h-4 w-4" /></button>
                    <button type="button" onClick={() => editor?.chain().focus().setTextAlign('center').run()} className={`editor-btn ${editor?.isActive({ textAlign: 'center' }) ? 'active' : ''}`}><AlignCenter className="h-4 w-4" /></button>
                    <button type="button" onClick={() => editor?.chain().focus().setTextAlign('right').run()} className={`editor-btn ${editor?.isActive({ textAlign: 'right' }) ? 'active' : ''}`}><AlignRight className="h-4 w-4" /></button>
                    <span className="h-5 w-px bg-gray-200 mx-1" />
                    <button
                      type="button"
                      onClick={() => {
                        const url = window.prompt('Enter a URL');
                        if (url) {
                          editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                        }
                      }}
                      className={`editor-btn ${editor?.isActive('link') ? 'active' : ''}`}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className={`editor-btn ${imageUploading ? 'opacity-50' : ''}`}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file);
                        }
                        e.currentTarget.value = '';
                      }}
                    />
                    <span className="h-5 w-px bg-gray-200 mx-1" />
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                      className="editor-btn"
                      title="Insert table"
                    >
                      <TableIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().addRowAfter().run()}
                      className="editor-btn"
                      title="Add row"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().addColumnAfter().run()}
                      className="editor-btn"
                      title="Add column"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().deleteRow().run()}
                      className="editor-btn"
                      title="Delete row"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().deleteColumn().run()}
                      className="editor-btn"
                      title="Delete column"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().deleteTable().run()}
                      className="editor-btn"
                      title="Delete table"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <span className="h-5 w-px bg-gray-200 mx-1" />
                    <button type="button" onClick={() => editor?.chain().focus().undo().run()} className="editor-btn"><Undo2 className="h-4 w-4" /></button>
                    <button type="button" onClick={() => editor?.chain().focus().redo().run()} className="editor-btn"><Redo2 className="h-4 w-4" /></button>
                  </div>
                  {imageError && (
                    <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-b border-red-100">
                      {imageError}
                    </div>
                  )}
                  <EditorContent editor={editor} />
                </div>
              ) : (
                <div
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.content || '<p>Nothing to preview yet.</p>' }}
                />
              )}
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <span>Tip: Use the toolbar for formatting, links, and images</span>
              </div>
            </div>

            <div>
              <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="block w-full text-sm text-gray-600"
                />
                {formData.featuredImage && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, featuredImage: '' }))}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                type="url"
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleInputChange}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                URL of the featured image for this blog post.
              </p>
              {formData.featuredImage && (
                <div className="mt-3">
                  <img src={formData.featuredImage} alt="Featured preview" className="w-full max-h-64 object-cover rounded-lg border" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleTagsChange}
                className="form-input"
                placeholder="real estate, market trends, investment"
              />
              <p className="mt-1 text-sm text-gray-500">
                Comma-separated tags to help with discoverability.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Publish Checklist</h3>
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => setChecklistOpen(!checklistOpen)}
                >
                  {checklistOpen ? 'Hide' : 'Show'}
                </button>
              </div>
              {checklistOpen && (
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>SEO title + description</span>
                    <span className={formData.metaTitle.trim() && formData.metaDescription.trim() ? 'text-green-600' : 'text-gray-400'}>
                      {formData.metaTitle.trim() && formData.metaDescription.trim() ? 'Ready' : 'Missing'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Excerpt length (80–300 chars)</span>
                    <span className={
                      formData.excerpt.trim().length >= 80 && formData.excerpt.trim().length <= 300
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }>
                      {formData.excerpt.trim().length} chars
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Featured image</span>
                    <span className={formData.featuredImage ? 'text-green-600' : 'text-gray-400'}>
                      {formData.featuredImage ? 'Ready' : 'Missing'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Checklist is enforced when status is set to Published.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">SEO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="SEO title (optional)"
                  />
                </div>
                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="form-input resize-none"
                    placeholder="SEO description (optional)"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>{isEditing ? 'Update Post' : 'Create Post'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
