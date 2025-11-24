import DOMPurify from 'dompurify'

/**
 * 对后端返回的富文本进行安全清洗，防止 XSS
 *
 * 这里使用较为保守的白名单：
 * - 允许的标签：基础排版、列表、简单强调、图片
 * - 允许的属性：href/src/alt/title/target/rel
 * - 禁止内联事件(on*)、style 等高风险属性
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return ''

  const ALLOWED_TAGS = [
    'a',
    'abbr',
    'b',
    'blockquote',
    'br',
    'code',
    'em',
    'i',
    'li',
    'ol',
    'p',
    'pre',
    'span',
    'strong',
    'ul',
    'img',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6'
  ]

  const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'target', 'rel']

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // 确保外链安全：可在后端控制 rel="noopener noreferrer"
    ADD_ATTR: ['target', 'rel']
  })
}



