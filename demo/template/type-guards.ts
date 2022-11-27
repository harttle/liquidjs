import { LayoutTag, ForTag, LiquidTag, CaptureTag, CaseTag, UnlessTag, TablerowTag, Tag, IfTag } from 'liquidjs'

export function isIfTag (tag: Tag): tag is IfTag {
  return tag.name === 'if'
}

export function isUnlessTag (tag: Tag): tag is UnlessTag {
  return tag.name === 'unless'
}

export function isLiquidTag (tag: Tag): tag is LiquidTag {
  return tag.name === 'liquid'
}

export function isCaseTag (tag: Tag): tag is CaseTag {
  return tag.name === 'case'
}

export function isCaptureTag (tag: Tag): tag is CaptureTag {
  return tag.name === 'capture'
}

export function isTablerowTag (tag: Tag): tag is TablerowTag {
  return tag.name === 'tablerow'
}

export function isForTag (tag: Tag): tag is ForTag {
  return tag.name === 'for'
}

export function isLayoutTag (tag: Tag): tag is LayoutTag {
  return tag.name === 'layout'
}
