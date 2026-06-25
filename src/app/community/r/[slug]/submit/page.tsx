'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/app/community/actions'
import Link from 'next/link'
import { use } from 'react'

export default function SubmitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [type, setType] = useState<'text' | 'link'>('text')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    formData.set('community', slug)
    formData.set('type', type)
    startTransition(async () => {
      const result = await createPost(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_316px] gap-6">
      <div>
        <div className="bg-white border border-[#EDEFF1] rounded p-4">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Create a Post</h1>
          <p className="text-sm text-gray-500 mb-4">
            Posting in{' '}
            <Link href={`/community/r/${slug}`} className="text-[#C6973E] font-semibold hover:underline">
              r/{slug}
            </Link>
          </p>

          {/* Type tabs */}
          <div className="flex border border-[#EDEFF1] rounded overflow-hidden mb-4">
            {(['text', 'link'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 ${
                  type === t
                    ? 'border-[#C6973E] text-[#C6973E] bg-amber-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50'
                }`}
              >
                {t === 'text' ? '📝 Text' : '🔗 Link'}
              </button>
            ))}
          </div>

          <form action={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <input
                name="title"
                type="text"
                placeholder="Title"
                required
                maxLength={300}
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#C6973E] focus:ring-1 focus:ring-[#C6973E]"
              />
              <p className="text-xs text-gray-400 mt-1">300 characters max</p>
            </div>

            {type === 'text' ? (
              <textarea
                name="body"
                placeholder="Text (optional)"
                rows={8}
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm resize-y focus:outline-none focus:border-[#C6973E] focus:ring-1 focus:ring-[#C6973E]"
              />
            ) : (
              <input
                name="url"
                type="url"
                placeholder="https://..."
                required
                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#C6973E] focus:ring-1 focus:ring-[#C6973E]"
              />
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 text-sm font-semibold bg-[#C6973E] text-white rounded-full hover:bg-[#b08535] disabled:opacity-50 transition-colors"
              >
                {isPending ? 'Posting…' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Sidebar tip */}
      <div className="hidden lg:block">
        <div className="bg-white border border-[#EDEFF1] rounded p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Posting tips</h3>
          <ul className="text-sm text-gray-600 space-y-1.5">
            <li>• Be specific and descriptive with your title</li>
            <li>• Include carat weight, cut, color, clarity for diamond questions</li>
            <li>• Share GIA report numbers for verification questions</li>
            <li>• No spam or self-promotion</li>
            <li>• Be respectful to all members</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
