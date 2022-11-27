import { Output, Template, Tag } from 'liquidjs'
import { isLayoutTag, isIfTag, isUnlessTag, isLiquidTag, isCaseTag, isCaptureTag, isTablerowTag, isForTag } from './type-guards'

/**
 * iterate over all `{{ output }}`
 */
export function * getOutputs (templates: Template[]): Generator<Output, void> {
  for (const template of templates) {
    if (template instanceof Tag) {
      if (isIfTag(template) || isUnlessTag(template) || isCaseTag(template)) {
        for (const branch of template.branches) {
          yield * getOutputs(branch.templates)
        }
        yield * getOutputs(template.elseTemplates)
      } else if (isForTag(template)) {
        yield * getOutputs(template.templates)
        yield * getOutputs(template.elseTemplates)
      } else if (isLiquidTag(template) || isCaptureTag(template) || isTablerowTag(template) || isLayoutTag(template)) {
        yield * getOutputs(template.templates)
      }
    } else if (template instanceof Output) {
      yield template
    }
  }
}
