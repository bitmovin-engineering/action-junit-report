import {Annotation} from './testParser'

/**
 * Limit output, because we use it to send a message to Slack inside a section
 * that is limited to 3000 chars and already contains some other text.
 */
const defaultOutputCharLimit = 2500

/**
 * Limit number of tests that are displayed, otherwise the Slack message will
 * get too big and will just be less readable.
 * For cases where there is a lot of failing tests in-depth review of the run will be needed anyway.
 */
const defaultMaxTestsToOutput = 8

/**
 * Takes [annotations] and returns a markdown-formatted string
 * of failing test titles and descriptions separated by new lines.
 */
export function generateFailedTestsReport(
  annotations: Annotation[],
  outputCharLimit: number = defaultOutputCharLimit,
  maxTestsToOutput: number = defaultMaxTestsToOutput
): String {
  const failedTestAnnotations = annotations.filter(annotation => annotation.annotation_level === 'failure')

  let output = failedTestAnnotations
    .slice(0, maxTestsToOutput)
    .map(annotation => formatAnnotation(annotation))
    .join('\\n')

  const ignoredTestsCount = failedTestAnnotations.length - maxTestsToOutput
  if (ignoredTestsCount > 0) {
    output += `\\n\\n+ additional *${ignoredTestsCount}* failed tests.`
  }

  return output.slice(0, outputCharLimit)
}

function formatAnnotation(annotation: Annotation): String {
  const title = escapeJsonIllegalChars(annotation.title)
  const description = escapeJsonIllegalChars(annotation.message)

  const formattedTitle = `*${title}*`
  const formattedDescription = `\`\`\`${description}\`\`\``
  return `${formattedTitle}\\n${formattedDescription}`
}

function escapeJsonIllegalChars(string: String): String {
  return string
    .replace(/\n/g, '\\n')
    .replace(/"/g, '\\"')
    .replace(/\t/g, '\\t')
    .replace(/\r/g, '\\r')
    .replace(/\v/g, '\\v')
}
